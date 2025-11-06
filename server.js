import { createRequestHandler } from '@remix-run/express';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;
const HOST = process.env.HOST || '0.0.0.0';

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve static files
app.use(express.static(join(__dirname, 'build/client'), { maxAge: '1h' }));

// Handle Remix requests
app.all(
  '*',
  createRequestHandler({
    build: await import('./build/server/index.js'),
    mode: process.env.NODE_ENV,
  })
);

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
});