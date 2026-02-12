import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4505;

// CORS
app.use(cors());
app.use(express.json());

// Uptime Kuma API config
const UPTIME_KUMA_URL = process.env.UPTIME_KUMA_URL || 'http://localhost:3001';

// Servis listesi
const SERVICES = [
  { name: 'Mission Control', url: 'http://localhost:3080', path: '/health' },
  { name: 'Antfarm Dashboard', url: 'http://localhost:3333', path: '/health' },
  { name: 'LogPulse', url: 'http://localhost:3502', path: '/health' },
  { name: 'AgentViz', url: 'http://localhost:3503', path: '/health' },
  { name: 'RestMenu', url: 'http://localhost:3501', path: '/health' },
  { name: 'ClawDocs', url: 'http://localhost:3504', path: '/health' },
  { name: 'Grafana', url: 'http://localhost:3002', path: '/api/health' },
  { name: 'n8n', url: 'http://localhost:5678', path: '/healthz' }
];

// Health check endpoint
app.get('/api/status', async (req, res) => {
  const results = await Promise.all(
    SERVICES.map(async (service) => {
      try {
        const start = Date.now();
        const response = await axios.get(`${service.url}${service.path}`, {
          timeout: 5000,
          validateStatus: () => true
        });
        const latency = Date.now() - start;
        return {
          name: service.name,
          status: response.status === 200 ? 'up' : 'down',
          statusCode: response.status,
          latency: `${latency}ms`,
          lastChecked: new Date().toISOString()
        };
      } catch (error) {
        return {
          name: service.name,
          status: 'down',
          error: error.message,
          lastChecked: new Date().toISOString()
        };
      }
    })
  );

  const upCount = results.filter(r => r.status === 'up').length;
  
  res.json({
    overall: upCount === results.length ? 'operational' : upCount > 0 ? 'degraded' : 'down',
    uptime: `${((upCount / results.length) * 100).toFixed(1)}%`,
    services: results,
    lastUpdated: new Date().toISOString()
  });
});

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'statuspage' });
});

app.listen(PORT, () => {
  console.log(`📊 StatusPage API running on port ${PORT}`);
});
