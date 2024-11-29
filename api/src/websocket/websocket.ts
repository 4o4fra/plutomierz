import {WebSocket} from 'ws';
import {plutaValue, updatePlutaValue} from './updatePlutaValue';
import wss from './websocketServer';
import createRateLimiter from '../utils/rateLimiter';
import {validateAndFormatMessage, validateAndFormatNickname} from '../utils/validation';
import axios from 'axios';

interface ChatMessage {
    username: string;
    text: string;
}

const messages: ChatMessage[] = [];
const MAX_MESSAGES = 100;
const rateLimiter = createRateLimiter(10000, 2);

updatePlutaValue().then(r => r);
setInterval(updatePlutaValue, 15000);

// testing new pluta
setInterval(() => {
    if (plutaValue !== null) {
        axios.post('https://discord.com/api/webhooks/1312149530598178967/5Nh0cEXsFpTYqtcB14SxR7LXai_Z74cGkeRxXY5uboFSFDzx6cNZGNfpSU3NPkmALzZ_', {
            content: `${plutaValue}`
        }).then(response => {
            if (response.status !== 204) {
                console.error('Failed to send Pluta to Discord webhook');
            }
        }).catch(error => {
            console.error('Error sending Pluta to Discord webhook:', error);
        });
    }
}, 600000);


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

            const messageValidation = validateAndFormatMessage(message.text);
            if (!messageValidation.valid) {
                ws.send(JSON.stringify({type: 'error', message: messageValidation.error}));
                return;
            }

            const nicknameValidation = validateAndFormatNickname(message.username);
            if (!nicknameValidation.valid) {
                ws.send(JSON.stringify({type: 'error', message: nicknameValidation.error}));
                return;
            }

            message.text = messageValidation.formattedMessage || '';
            message.username = nicknameValidation.formattedNickname || '';

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