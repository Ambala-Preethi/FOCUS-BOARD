const http = require('http');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const distDir = path.join(__dirname, '..', 'dist');
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
const tempProfile = path.join(__dirname, '..', 'temp_chrome_profile');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}
if (!fs.existsSync(tempProfile)) {
  fs.mkdirSync(tempProfile, { recursive: true });
}

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(path.join(distDir, 'index.html')).pipe(res);
  }
});

const PORT = 5188;

server.listen(PORT, () => {
  console.log(`HTTP server serving dist at http://localhost:${PORT}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const desktopOut = path.join(screenshotsDir, 'desktop-dashboard-1440x1000.png');
  const mobileOut = path.join(screenshotsDir, 'mobile-dashboard-390x1128.png');

  try {
    console.log('Capturing Desktop 1440x1000 screenshot...');
    execSync(`"${chromePath}" --headless=new --no-sandbox --disable-gpu --user-data-dir="${tempProfile}" --window-size=1440,1000 --screenshot="${desktopOut}" http://localhost:${PORT}`, { stdio: 'ignore', timeout: 15000 });
    console.log('Saved desktop screenshot:', desktopOut);

    console.log('Capturing Mobile 390x1128 screenshot...');
    execSync(`"${chromePath}" --headless=new --no-sandbox --disable-gpu --user-data-dir="${tempProfile}" --window-size=390,1128 --screenshot="${mobileOut}" http://localhost:${PORT}`, { stdio: 'ignore', timeout: 15000 });
    console.log('Saved mobile screenshot:', mobileOut);
  } catch (err) {
    console.error('Error during screenshot capture:', err.message);
  } finally {
    server.close();
    console.log('Server closed. Screenshot capture finished.');
  }
});
