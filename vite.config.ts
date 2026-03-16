import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import fs from 'fs';
import path from 'path';

const localDataPlugin = () => {
  return {
    name: 'local-data-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/data', (req: any, res: any, next: any) => {
        const dataPath = path.resolve(process.cwd(), 'data.json');

        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 200;
          res.end();
          return;
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'GET') {
          try {
            if (fs.existsSync(dataPath)) {
              const data = fs.readFileSync(dataPath, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(data);
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ links: [], folders: [] }));
            }
          } catch (e) {
            console.error('Error reading data.json:', e);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to read data' }));
          }
          return;
        }

        if (req.method === 'PUT') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              fs.writeFileSync(dataPath, body, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true }));
            } catch (e) {
              console.error('Error writing data.json:', e);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to write data' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localDataPlugin()],
})


