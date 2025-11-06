import { createRequestHandler } from '@remix-run/node';
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
app.use(express.static(join(__dirname, 'build/client')));

// Handle Remix requests
let build;
try {
  build = await import('./build/server/index.js');
  if (!build || !build.default) {
    throw new Error('Build manifest is empty');
  }
} catch (error) {
  console.error('Failed to load Remix build:', error);
  process.exit(1);
}

const requestHandler = createRequestHandler({ 
  build: build.default || build 
});

app.all('*', requestHandler);

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log('Build manifest loaded successfully');
});