import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';

// Local preview only: generated session key and in-memory data never reach source control.
const apiPort = Number(process.env.LOCAL_API_PORT ?? 4000);
const webPort = Number(process.env.LOCAL_WEB_PORT ?? 3000);
if (![apiPort, webPort].every(port => Number.isInteger(port) && port > 0 && port <= 65535) || apiPort === webPort) {
  console.error('Choose distinct LOCAL_API_PORT and LOCAL_WEB_PORT values between 1 and 65535.');
  process.exit(1);
}

const webOrigin = `http://localhost:${webPort}`;
const apiOrigin = `http://localhost:${apiPort}`;
const env = {
  ...process.env,
  DATA_MODE: 'memory',
  JWT_SECRET: randomBytes(32).toString('hex'),
  PORT: String(apiPort),
  ALLOWED_ORIGINS: webOrigin,
  NEXT_PUBLIC_API_URL: apiOrigin,
  NODE_ENV: 'development',
  DATABASE_URL: '',
  ADMIN_EMAIL: '',
  ADMIN_PASSWORD: ''
};
delete env.GITHUB_ACTIONS;
delete env.GITHUB_REPOSITORY;

const children = [
  spawn(process.execPath, ['node_modules/tsx/dist/cli.mjs', 'watch', 'server/index.ts'], { env, stdio: 'inherit' }),
  spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--port', String(webPort)], { env, stdio: 'inherit' })
];
let stopping = false;
function stop(signal = 'SIGTERM') {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (child.pid && child.exitCode === null) child.kill(signal);
}
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => stop(signal));
for (const child of children) child.on('exit', (code, signal) => {
  if (!stopping) {
    console.error(`A local service stopped (${signal ?? `exit ${code}`}); stopping the other service.`);
    stop();
  }
});
console.log(`Local preview: ${webOrigin} (API: ${apiOrigin}); sample data resets when stopped.`);
