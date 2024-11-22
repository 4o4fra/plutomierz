import {WebSocket} from 'ws';
import {plutaValue, updatePlutaValue} from './updatePlutaValue';
import wss from "./websocketServer";
import createRateLimiter from '../utils/rateLimiter';

interface ChatMessage {
    username: string;
    text: string;
}

const messages: ChatMessage[] = [];
const MAX_MESSAGES = 100;
const rateLimiter = createRateLimiter(10000, 2);

updatePlutaValue().then(r => r);
setInterval(updatePlutaValue, 15000);

wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    ws.send(JSON.stringify({type: 'history', messages}));

    if (plutaValue !== null) {
        ws.send(JSON.stringify({type: 'pluta', value: plutaValue}));
    }

    ws.on('message', (data: string) => {
        if (!rateLimiter()) {
            ws.send(JSON.stringify({type: 'error', message: 'Rate limit exceeded'}));
            return;
        }
        try {
            const message: ChatMessage = JSON.parse(data);

            if (message.text.length > 200) {
                ws.send(JSON.stringify({type: 'error', message: 'Message too long'}));
                return;
            }

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