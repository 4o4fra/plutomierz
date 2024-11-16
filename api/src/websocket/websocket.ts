import {WebSocket} from 'ws';
import {plutaValue, updatePlutaValue} from './updatePlutaValue';
import wss from "./websocketServer";

interface ChatMessage {
    username: string;
    text: string;
}

const messages: ChatMessage[] = [];
const MAX_MESSAGES = 20;

updatePlutaValue().then(r => r);
setInterval(updatePlutaValue, 15000);

wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    ws.send(JSON.stringify({type: 'history', messages}));

    if (plutaValue !== null) {
        ws.send(JSON.stringify({plutaValue}));
    }

    ws.on('message', (data: string) => {
        console.log('Message received:', data);
        try {
            const message: ChatMessage = JSON.parse(data);

            messages.push(message);

            if (messages.length > MAX_MESSAGES) {
                messages.shift();
            }

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({type: 'message', message}));
                }
            });
        } catch (error) {
            ws.send(JSON.stringify({type: 'error', message: 'Invalid message format'}));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});