import {WebSocket, WebSocketServer} from 'ws';
import server from './server';
import getPlutaValue from "./utils/getPlutaValue";

const wss = new WebSocketServer({server});

let plutaValue: number | null = null;

const updatePlutaValue = async () => {
    const newPlutaValue = await getPlutaValue(54.372158, 18.638306);
    if (newPlutaValue !== plutaValue) {
        plutaValue = newPlutaValue;
        const message = JSON.stringify({plutaValue});
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
};

updatePlutaValue().then(r => r);
setInterval(updatePlutaValue, 15000);

wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    if (plutaValue !== null) {
        ws.send(JSON.stringify({plutaValue}));
    }

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});