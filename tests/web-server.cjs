const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

function createWebServer(port = 8084) {
  const root = path.resolve(__dirname, '../dist');
  const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.ttf': 'font/ttf' };
  return http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, `http://localhost:${port}`).pathname);
    let filename = path.resolve(root, `.${pathname}`);
    if (!filename.startsWith(root + path.sep) && filename !== root) { response.writeHead(403).end(); return; }
    if (!path.extname(filename)) {
      if (fs.existsSync(`${filename}.html`)) filename += '.html';
      else if (fs.existsSync(path.join(filename, 'index.html'))) filename = path.join(filename, 'index.html');
      else filename = path.join(root, 'index.html'); // Client-side dynamic student route.
    }
    if (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) { response.writeHead(404).end(); return; }
    response.writeHead(200, { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream' });
    fs.createReadStream(filename).pipe(response);
  });
}

module.exports = { createWebServer };
if (require.main === module) createWebServer().listen(8084, '127.0.0.1', () => console.log('Student Manager: http://localhost:8084'));
