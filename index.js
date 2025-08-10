const prerender = require('prerender')

const server = prerender({
  followRedirects: true,
  logRequests: false,
  captureConsoleLog: false,
  chromeLocation: '/usr/bin/google-chrome',
  chromeFlags: ['--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222', '--hide-scrollbars', '--disable-dev-shm-usage'],
})

// Add whitelist plugin if ALLOWED_DOMAINS environment variable is set
if (process.env.ALLOWED_DOMAINS) {
  server.use(prerender.whitelist())
}

server.use(require('prerender-memory-cache'));
server.use(prerender.httpHeaders());
server.get('health', (req, res) => {
  res.send('OK');
});
server.start();