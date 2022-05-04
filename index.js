const { PORT } = require('./utils/config');
const http = require('http')
const app = require('./app');
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})