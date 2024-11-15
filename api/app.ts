import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

const port = 3000;
const server = createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket, req) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Pluta is listening on port ${port}`);
});