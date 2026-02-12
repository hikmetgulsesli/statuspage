import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

test('TypeScript configuration exists for backend', () => {
  const tsconfigPath = join(rootDir, 'tsconfig.json');
  assert.ok(existsSync(tsconfigPath), 'tsconfig.json should exist in project root');
  
  const config = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));
  assert.ok(config.compilerOptions, 'tsconfig.json should have compilerOptions');
  assert.strictEqual(config.compilerOptions.strict, true, 'strict mode should be enabled');
  assert.ok(config.include.includes('server/**/*'), 'should include server files');
});

test('TypeScript configuration exists for frontend', () => {
  const tsconfigPath = join(rootDir, 'src', 'tsconfig.json');
  assert.ok(existsSync(tsconfigPath), 'tsconfig.json should exist in src/');
  
  const config = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));
  assert.ok(config.compilerOptions, 'tsconfig.json should have compilerOptions');
  assert.strictEqual(config.compilerOptions.strict, true, 'strict mode should be enabled');
  assert.ok(config.compilerOptions.lib.includes('DOM'), 'frontend config should include DOM lib');
});

test('package.json has TypeScript scripts', () => {
  const packagePath = join(rootDir, 'package.json');
  const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
  
  assert.ok(pkg.scripts.typecheck, 'should have typecheck script');
  assert.ok(pkg.scripts['build:server'], 'should have build:server script');
  assert.ok(pkg.scripts.build.includes('build:server'), 'build script should include TypeScript compilation');
});

test('package.json has TypeScript dependencies', () => {
  const packagePath = join(rootDir, 'package.json');
  const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
  
  assert.ok(pkg.devDependencies.typescript, 'should have typescript as devDependency');
  assert.ok(pkg.devDependencies['@types/node'], 'should have @types/node');
  assert.ok(pkg.devDependencies['@types/express'], 'should have @types/express');
  assert.ok(pkg.devDependencies['@types/cors'], 'should have @types/cors');
  assert.ok(pkg.devDependencies.tsx, 'should have tsx for development');
});

test('TypeScript compiles successfully', () => {
  const compiledServerPath = join(rootDir, 'dist', 'server', 'index.js');
  assert.ok(existsSync(compiledServerPath), 'compiled server file should exist at dist/server/index.js');
  
  const compiledCode = readFileSync(compiledServerPath, 'utf-8');
  assert.ok(compiledCode.includes('express'), 'compiled code should import express');
  assert.ok(compiledCode.includes('/api/status'), 'compiled code should have API routes');
});

test('TypeScript source file exists', () => {
  const serverTsPath = join(rootDir, 'server', 'index.ts');
  assert.ok(existsSync(serverTsPath), 'server/index.ts should exist');
  
  const sourceCode = readFileSync(serverTsPath, 'utf-8');
  assert.ok(sourceCode.includes('import express'), 'should have typed imports');
  assert.ok(sourceCode.includes('Request, Response'), 'should import Express types');
  assert.ok(sourceCode.includes('interface Service'), 'should define TypeScript interfaces');
});
