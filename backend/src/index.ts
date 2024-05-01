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
    console.log(`a user ${socket.id} connected`);
    socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected`);
    });

    socket.on('click', (data) => {
        socket.broadcast.emit('click', data);
    });
});

server.listen(4000, () => console.log('Server running at http://localhost:4000'));
