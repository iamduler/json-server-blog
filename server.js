const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
	// publishDate: format: YYYY-MM-DD
	// check if publishDate is in the past
    if (new Date(req.body.publishDate) < new Date()) {
      return res.status(422).send({
        error: {
			publishDate: 'Publish date cannot be in the past'
		}
      })
    }
  }

  // Continue to JSON Server router
  next()
})

// Use default router
server.use(router)
server.listen(3004, () => {
  console.log('JSON Server is running')
})