const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

app.use(express.static('../site'))

io.on('connection', socket => {
    socket.on('join', name => {
        socket.data.name = name
        socket.broadcast.emit('notification', name + ' joined the chat')
    })

    socket.on('message', msg => {
        const payload = { from: socket.data.name || 'Anonymous', text: msg, time: Date.now() }
        io.emit('message', payload)
    })

    socket.on('disconnect', () => {
        const name = socket.data.name
        if (name) io.emit('notification', name + ' left the chat')
    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log('Server listening on port', PORT)
})
