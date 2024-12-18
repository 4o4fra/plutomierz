import {WebSocket} from 'ws';
import {validateAndFormatMessage, validateAndFormatNickname} from './validation';
import {saveMessageToDb} from '../../db/handleMessageDb';
import {ChatMessage} from '../../types/ChatMessage';
import wss from './websocketServer';

const handleChatMessage = async (ws: WebSocket, message: ChatMessage) => {
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
    message.timestamp = new Date();

    await saveMessageToDb(message);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({type: 'message', message}));
        }
    });
};

export default handleChatMessage;