import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins for demo
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('ESP32 connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('ESP32 disconnected:', socket.id);
    });
  });

  // Make io available globally or in a module
  global.io = io;

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
}); 