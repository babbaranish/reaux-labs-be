/**
 * Keep-Alive Script for Render Free Tier
 *
 * Pings the server every 14 minutes to prevent Render
 * from spinning down the free tier instance.
 *
 * Usage:
 *   node keep-alive.js https://your-app.onrender.com
 */

const URL = process.argv[2];

if (!URL) {
  console.error('Usage: node keep-alive.js <your-render-url>');
  console.error('Example: node keep-alive.js https://reaux-labs.onrender.com');
  process.exit(1);
}

const INTERVAL = 14 * 60 * 1000; // 14 minutes
const endpoint = `${URL.replace(/\/$/, '')}/api/health`;

async function ping() {
  const time = new Date().toLocaleTimeString();
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    console.log(`[${time}] ${res.status} - ${data.status ?? 'ok'}`);
  } catch (err) {
    console.error(`[${time}] FAILED - ${err.message}`);
  }
}

console.log(`Pinging ${endpoint} every 14 minutes...\n`);
ping();
setInterval(ping, INTERVAL);
