import dbPromise from '../db/db';
import {ChatMessage} from "../types/ChatMessage";

const saveMessageToDb = async (message: ChatMessage) => {
    const db = await dbPromise;
    await db.run(`
        INSERT INTO chat_messages (username, text, created_at)
        VALUES (?, ?, ?)
    `, [message.username, message.text, message.timestamp.toISOString()]);
};

const getLastMessagesFromDb = async (limit: number): Promise<ChatMessage[]> => {
    const db = await dbPromise;
    const messages = await db.all<ChatMessage[]>(`
        SELECT username, text, created_at as timestamp
        FROM chat_messages
        ORDER BY created_at DESC
        LIMIT ?
    `, [limit]);
    return messages.map(message => ({
        ...message,
        timestamp: new Date(message.timestamp)
    })).reverse();
};

export {saveMessageToDb, getLastMessagesFromDb};