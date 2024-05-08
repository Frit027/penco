import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    },
});

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected.`);
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected.`);
    });

    socket.on('drawLine', (data) => {
        socket.broadcast.emit('drawLine', data);
    });

    socket.on('drawRectangle', (data) => {
        socket.broadcast.emit('drawRectangle', data);
    });

    socket.on('drawRectangleStop', (data) => {
        socket.broadcast.emit('drawRectangleStop', data);
    });

    socket.on('drawCircle', (data) => {
        socket.broadcast.emit('drawCircle', data);
    });

    socket.on('drawCircleStop', (data) => {
        socket.broadcast.emit('drawCircleStop', data);
    });
});

server.listen(4000, () => console.log('Server running at http://localhost:4000.'));
