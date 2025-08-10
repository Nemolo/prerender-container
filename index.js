const express = require('express')

// Crea app Express
const app = express()

// Rotta healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'prerender-server',
    version: require('./package.json').version || '1.0.0'
  })
})
const prerender = require('prerender')
// Importa il server prerender senza avviarlo
const server = require('prerender/lib/server')

// Inizializza il server con le opzioni ma senza listen
server.init({
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

server.use(require('prerender-memory-cache'))
server.use(prerender.sendPrerenderHeader());
server.use(prerender.browserForceRestart());
server.use(prerender.addMetaTags());
// server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());
// Bind onRequest per usarlo come handler
server.onRequest = server.onRequest.bind(server)
server.start();
// Gestisci tutte le altre rotte con prerender
app.use('/', server.onRequest)
app.disable('x-powered-by');
// Avvia SOLO il server Express
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Prerender server with healthcheck running on port ${PORT}`)
  console.log(`Healthcheck available at: http://localhost:${PORT}/health`)
  console.log(`Prerender available at: http://localhost:${PORT}/render?url=<URL>`)
})