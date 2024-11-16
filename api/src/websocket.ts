import { WebSocketServer, WebSocket } from 'ws';
import server from './server';
import getPlutaValue from "./utils/getPlutaValue";

const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
        console.log(`Received message: ${message}`);
        const basePlutaValue = await getPlutaValue(54.372158, 18.638306);
        ws.send(basePlutaValue.toString());
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});