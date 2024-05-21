import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => cb(null, `${Date.now()}.pdf`),
});

const upload = multer({ storage });

app.post('/api/file', upload.single('file'), (req, res) => {
    res.sendFile(path.join(__dirname, `../uploads/${req.file?.filename}`));
});

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

    socket.on('draw:line', (data) => {
        socket.broadcast.emit('draw:line', data);
    });

    socket.on('draw:rectangle', (data) => {
        socket.broadcast.emit('draw:rectangle', data);
    });

    socket.on('stop-drawing:rectangle', (data) => {
        socket.broadcast.emit('stop-drawing:rectangle', data);
    });

    socket.on('draw:circle', (data) => {
        socket.broadcast.emit('draw:circle', data);
    });

    socket.on('stop-drawing:circle', (data) => {
        socket.broadcast.emit('stop-drawing:circle', data);
    });

    socket.on('url', (data) => {
        socket.broadcast.emit('url', data);
    });
});

server.listen(4000, () => console.log('Server running at http://localhost:4000.'));
