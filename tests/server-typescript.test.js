import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

test('server/index.ts exists with proper TypeScript types', () => {
  const serverTsPath = join(rootDir, 'server', 'index.ts');
  assert.ok(existsSync(serverTsPath), 'server/index.ts should exist');
  
  const sourceCode = readFileSync(serverTsPath, 'utf-8');
  assert.ok(sourceCode.includes('interface Service'), 'should define Service interface');
  assert.ok(sourceCode.includes('interface ServiceStatus'), 'should define ServiceStatus interface');
  assert.ok(sourceCode.includes('interface StatusResponse'), 'should define StatusResponse interface');
});

test('Service interface is properly defined', () => {
  const serverTsPath = join(rootDir, 'server', 'index.ts');
  const sourceCode = readFileSync(serverTsPath, 'utf-8');
  
  // Check Service interface has required properties
  assert.ok(sourceCode.includes('name: string'), 'Service should have name property');
  assert.ok(sourceCode.includes('url: string'), 'Service should have url property');
  assert.ok(sourceCode.includes('path: string'), 'Service should have path property');
});

test('StatusResponse interface is properly defined', () => {
  const serverTsPath = join(rootDir, 'server', 'index.ts');
  const sourceCode = readFileSync(serverTsPath, 'utf-8');
  
  // Check StatusResponse interface has required properties
  assert.ok(sourceCode.includes('overall:'), 'StatusResponse should have overall property');
  assert.ok(sourceCode.includes('uptime:'), 'StatusResponse should have uptime property');
  assert.ok(sourceCode.includes('services:'), 'StatusResponse should have services property');
  assert.ok(sourceCode.includes('lastUpdated:'), 'StatusResponse should have lastUpdated property');
});

test('axios calls have proper type annotations', () => {
  const serverTsPath = join(rootDir, 'server', 'index.ts');
  const sourceCode = readFileSync(serverTsPath, 'utf-8');
  
  // Check axios is imported and used with proper typing
  assert.ok(sourceCode.includes("import axios from 'axios'"), 'should import axios');
  assert.ok(sourceCode.includes('await axios.get'), 'should use axios.get with await');
});

test('Express routes have proper type annotations', () => {
  const serverTsPath = join(rootDir, 'server', 'index.ts');
  const sourceCode = readFileSync(serverTsPath, 'utf-8');
  
  // Check Express types are used
  assert.ok(sourceCode.includes('Request, Response'), 'should import Request and Response types');
  assert.ok(sourceCode.includes('_req: Request'), 'should type the request parameter');
  assert.ok(sourceCode.includes('res: Response'), 'should type the response parameter');
});

test('Error handling is properly typed', () => {
  const serverTsPath = join(rootDir, 'server', 'index.ts');
  const sourceCode = readFileSync(serverTsPath, 'utf-8');
  
  // Check error handling with type guards
  assert.ok(sourceCode.includes('error instanceof Error'), 'should use instanceof Error for type checking');
});

test('SERVICES array is properly typed', () => {
  const serverTsPath = join(rootDir, 'server', 'index.ts');
  const sourceCode = readFileSync(serverTsPath, 'utf-8');
  
  // Check SERVICES has type annotation
  assert.ok(sourceCode.includes('const SERVICES: Service[]'), 'SERVICES should be typed as Service[]');
});

test('API status endpoint returns properly typed response', () => {
  const serverTsPath = join(rootDir, 'server', 'index.ts');
  const sourceCode = readFileSync(serverTsPath, 'utf-8');
  
  // Check the response is typed
  assert.ok(sourceCode.includes('const response: StatusResponse'), 'response should be typed as StatusResponse');
  assert.ok(sourceCode.includes('results: ServiceStatus[]'), 'results should be typed as ServiceStatus[]');
});
