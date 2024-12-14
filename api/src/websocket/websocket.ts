import {WebSocket} from 'ws';
import wss from './utils/websocketServer';
import createRateLimiter from './utils/rateLimiter';
import {validateAndFormatMessage, validateAndFormatNickname} from './utils/validation';
import {getLastMessagesFromDb, saveMessageToDb} from "../db/handleMessageDb";
import {plutaValue, updatePlutaValue} from './utils/updatePlutaValue';
import {ChatMessage} from '../types/ChatMessage';
import {sendPlutaDevToDiscord, sendPlutaValueToDiscord} from './utils/discordWebhook';
import {getPlutaLog, savePlutaToDb} from '../db/plutaLogDb';

// pluta value
updatePlutaValue().then(r => r);
setInterval(updatePlutaValue, 15000); //15000 = 15 seconds

// save pluta for plutoGraph
setInterval(async () => await savePlutaToDb(plutaValue), 600000); //600000 = 10 minutes

// discord webhook
setInterval(sendPlutaDevToDiscord, 600000); //600000 = 10 minutes
setInterval(sendPlutaValueToDiscord, 60000); //60000 = 1 minute

// pluta chat
const MAX_MESSAGES = 100;
const rateLimiter = createRateLimiter(5000, 5); //5000 = 5 seconds

wss.on('connection', async (ws: WebSocket) => {
    console.log('Client connected');

    ws.send(JSON.stringify({type: 'pluta', value: plutaValue}));

    ws.on('message', async (data: string) => {
        const message = JSON.parse(data);
        if (message.type === 'getPlutaLog') {
            const date = new Date(message.date);
            if (isNaN(date.getTime())) {
                ws.send(JSON.stringify({type: 'error', message: 'Invalid date format'}));
                return;
            }
            const logs = await getPlutaLog(date);
            ws.send(JSON.stringify({type: 'plutaLog', value: logs}));
            return;
        }
    });


    const messages = await getLastMessagesFromDb(MAX_MESSAGES);
    ws.send(JSON.stringify({type: 'history', messages}));

    ws.on('message', async (data: string) => {
        if (!rateLimiter()) {
            ws.send(JSON.stringify({type: 'error', message: 'Rate limit exceeded'}));
            ws.send(JSON.stringify({
                type: 'message',
                message: {username: 'Pluta', text: 'Nie spam na tym czacie tekstowym!'} as ChatMessage
            }));
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

            await saveMessageToDb(message);

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