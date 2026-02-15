import express, { Request, Response } from 'express';
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

// Uptime Kuma API config (for future use)
// const UPTIME_KUMA_URL = process.env.UPTIME_KUMA_URL || 'http://localhost:3001';

interface Service {
  name: string;
  url: string;
  path: string;
}

interface ServiceStatus {
  name: string;
  status: 'up' | 'down';
  statusCode?: number;
  latency?: string;
  error?: string;
  lastChecked: string;
}

interface StatusResponse {
  overall: 'operational' | 'degraded' | 'down';
  uptime: string;
  services: ServiceStatus[];
  lastUpdated: string;
}

// Servis listesi
const SERVICES: Service[] = [
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
app.get('/api/status', async (_req: Request, res: Response) => {
  const results: ServiceStatus[] = await Promise.all(
    SERVICES.map(async (service): Promise<ServiceStatus> => {
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
          error: error instanceof Error ? error.message : 'Unknown error',
          lastChecked: new Date().toISOString()
        };
      }
    })
  );

  const upCount = results.filter(r => r.status === 'up').length;
  
  const response: StatusResponse = {
    overall: upCount === results.length ? 'operational' : upCount > 0 ? 'degraded' : 'down',
    uptime: `${((upCount / results.length) * 100).toFixed(1)}%`,
    services: results,
    lastUpdated: new Date().toISOString()
  };

  res.json(response);
});

// Static files
app.use(express.static(path.join(__dirname, '..')));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'statuspage' });
});

app.listen(PORT, () => {
  console.log(`📊 StatusPage API running on port ${PORT}`);
});
