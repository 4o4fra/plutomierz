import {WebSocket} from 'ws';
import wss from './utils/websocketServer';
import createRateLimiter from './utils/rateLimiter';
import {validateAndFormatMessage, validateAndFormatNickname} from './utils/validation';
import {getLastMessagesFromDb, saveMessageToDb} from "../db/handleMessageDb";
import {plutaValue, updatePlutaValue} from './utils/updatePlutaValue';
import {ChatMessage} from '../types/ChatMessage';
import {sendPlutaDevToDiscord, sendPlutaValueToDiscord} from './utils/discordWebhook';
import {getPlutaLog, savePlutaToDb} from '../db/plutaLogDb';
import broadcastActiveUsersCount from "./utils/activeUsersCount";

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

    broadcastActiveUsersCount();

    try {
        const messages = await getLastMessagesFromDb(MAX_MESSAGES);
        ws.send(JSON.stringify({type: 'history', messages}));
    } catch (error) {
        ws.send(JSON.stringify({type: 'error', message: 'Failed to fetch message history'}));
    }

    ws.on('message', async (data: string) => {
        let message;
        try {
            message = JSON.parse(data);
        } catch (error) {
            ws.send(JSON.stringify({type: 'error', message: 'Invalid JSON format'}));
            return;
        }

        if (!rateLimiter()) {
            ws.send(JSON.stringify({type: 'error', message: 'Rate limit exceeded'}));
            ws.send(JSON.stringify({
                type: 'message',
                message: {
                    username: 'Pluta',
                    text: 'Nie spam na tym czacie tekstowym!',
                    timestamp: new Date()
                } as ChatMessage
            }));
            return;
        }

        if (!message.type || message.type === 'chatMessage') {
            try {
                const chatMessage: ChatMessage = message;

                const messageValidation = validateAndFormatMessage(chatMessage.text);
                if (!messageValidation.valid) {
                    ws.send(JSON.stringify({type: 'error', message: messageValidation.error}));
                    return;
                }

                const nicknameValidation = validateAndFormatNickname(chatMessage.username);
                if (!nicknameValidation.valid) {
                    ws.send(JSON.stringify({type: 'error', message: nicknameValidation.error}));
                    return;
                }

                chatMessage.text = messageValidation.formattedMessage || '';
                chatMessage.username = nicknameValidation.formattedNickname || '';
                chatMessage.timestamp = new Date();

                await saveMessageToDb(chatMessage);

                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({type: 'message', message: chatMessage}));
                    }
                });
            } catch (error) {
                ws.send(JSON.stringify({type: 'error', message: 'Invalid message format'}));
            }
        }
        if (message.type === 'getPlutaLog') {
            try {
                if (typeof message.dateRangeInMs !== 'number' || message.dateRangeInMs < 0) {
                    const logs = await getPlutaLog();
                    ws.send(JSON.stringify({type: 'plutaLog', value: logs, dateRangeInMs: "Infinity"}));
                    return;
                }

                const date = new Date(Date.now() - message.dateRangeInMs);
                const logs = await getPlutaLog(date);
                ws.send(JSON.stringify({type: 'plutaLog', value: logs, dateRangeInMs: message.dateRangeInMs}));
                return;
            } catch (error) {
                ws.send(JSON.stringify({type: 'error', message: 'Failed to fetch pluta log'}));
            }
        }
        // here you can add more message types
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        broadcastActiveUsersCount();
    });
});