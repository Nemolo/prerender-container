const prerender = require('prerender')

const server = prerender({
  followRedirects: true,
  logRequests: true,
  chromeLocation: '/usr/bin/google-chrome',
  chromeFlags: ['--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222', '--hide-scrollbars', '--disable-dev-shm-usage'],
})
server.use(require('prerender-memory-cache'))
server.use(prerender.httpHeaders())
server.start()