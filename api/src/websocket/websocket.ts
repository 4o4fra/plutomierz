import {WebSocket} from 'ws';
import wss from './utils/websocketServer';
import createRateLimiter from './utils/rateLimiter';
import {getLastMessagesFromDb} from "../db/handleMessageDb";
import {plutaValue, updatePlutaValue} from './utils/updatePlutaValue';
import {sendPlutaDevToDiscord, sendPlutaValueToDiscord} from './utils/discordWebhook';
import broadcastActiveUsersCount from "./utils/activeUsersCount";
import handleChatMessage from './utils/handleChatMessage';
import handleGetPlutaLog from './utils/handleGetPlutaLog';
import {savePlutaToDb} from "../db/plutaLogDb";

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
                }
            }));
            return;
        }

        if (!message.type || message.type === 'chatMessage') {
            await handleChatMessage(ws, message);
        }
        if (message.type === 'getPlutaLog') {
            await handleGetPlutaLog(ws, message);
        }
        // here you can add more message types
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        broadcastActiveUsersCount();
    });
});