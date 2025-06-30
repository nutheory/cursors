const http = require('http');
const WebSocketServer = require('ws');

const url = require('url');
const uuidv4 = require('uuid').v4

const port = 3000;
const server = http.createServer();
const wsServer = new WebSocketServer({ server })

const connections = []
const users = []

const broadcast = () => {
  Object.keys(connections).forEach(uuid => {
    const connection = connections[uuid]
    const message = JSON.stringify(users)
    connection.send(message)
  })
}

const handleMessage = (bytes, uuid) => {
  const message = JSON.parse(bytes.toString())
  const user = users[uuid]
  user.state = message

}

const handleClose = uuid => {
  delete connections[uuid]
  delete users[uuid]

  broadcast()
}

wsServer.on("connection", ( connection, request ) => {

  const { username } = url.parse(request, true).query
  const uuid = uuidv4()

  connections[uuid] = connection

  users[uuid] = {
    username,
    state: {}
  }

  connection.on("message", message => handleMessage(message, uuid))
  connection.on("close", () => handleClose(uuid))
})



server.listen(port, () => {
  console.log(`server is lestening on port ${port}`)
})