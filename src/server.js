import app from './app.js';
import { connectDB, disconnectDB } from './config/database.js';
import env from './config/env.js';

let server;

const start = async () => {
  await connectDB();

  server = app.listen(env.PORT, () => {
    console.log(`REAUX_labs server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
};

const shutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  server.close(async (err) => {
    if (err) {
      console.error('Error closing server:', err);
      process.exit(1);
    }

    console.log('HTTP server closed');
    await disconnectDB();
    console.log('Graceful shutdown complete');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
