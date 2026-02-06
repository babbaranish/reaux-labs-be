import app from './app.js';
import { connectDB } from './config/database.js';
import env from './config/env.js';

const start = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`REAUX_labs server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
};

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
