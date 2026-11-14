const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.mp3': 'audio/mpeg',
};

http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end('Method Not Allowed');
    return;
  }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end('Bad Request'); return; }
  const name = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = path.resolve(root, name);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end('Forbidden'); return; }
  fs.realpath(file, (realError, realFile) => {
    if (realError || (realFile !== root && !realFile.startsWith(root + path.sep))) { res.writeHead(404).end('Not Found'); return; }
    fs.stat(realFile, (error, stat) => {
    if (error || !stat.isFile()) { res.writeHead(404).end('Not Found'); return; }
    const headers = {
      'Content-Type': mime[path.extname(realFile)] || 'application/octet-stream',
      'Accept-Ranges': 'bytes',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Cache-Control': /\.(?:html|css|js)$/.test(realFile) ? 'no-cache' : 'public, max-age=86400'
    };
    const range = req.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match || (!match[1] && !match[2])) {
        res.writeHead(416, { ...headers, 'Content-Range': `bytes */${stat.size}` }).end();
        return;
      }
      let start, end;
      if (!match[1]) {
        const suffixLength = Number(match[2]);
        start = Math.max(0, stat.size - suffixLength);
        end = stat.size - 1;
      } else {
        start = Number(match[1]);
        end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
      }
      if (!Number.isFinite(start) || !Number.isFinite(end) || start >= stat.size || end < start) {
        res.writeHead(416, { ...headers, 'Content-Range': `bytes */${stat.size}` }).end();
        return;
      }
      headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
      headers['Content-Length'] = end - start + 1;
      res.writeHead(206, headers);
      if (req.method === 'HEAD') res.end();
      else fs.createReadStream(realFile, { start, end }).pipe(res);
      return;
    }
    headers['Content-Length'] = stat.size;
    res.writeHead(200, headers);
    if (req.method === 'HEAD') res.end();
    else fs.createReadStream(realFile).pipe(res);
    });
  });
}).listen(Number(process.env.PORT || 4173), '127.0.0.1', () => {
  console.log(`Birthday site available at http://localhost:${process.env.PORT || 4173}`);
});
