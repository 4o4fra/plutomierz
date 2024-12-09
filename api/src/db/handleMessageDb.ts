import dbPromise from '../db/db';
import {ChatMessage} from "../types/ChatMessage";

const saveMessageToDb = async (message: ChatMessage) => {
    const db = await dbPromise;
    await db.run(`
        INSERT INTO chat_messages (username, text, created_at)
        VALUES (?, ?, ?)
    `, [message.username, message.text, new Date().toISOString()]);
};

const getLastMessagesFromDb = async (limit: number): Promise<ChatMessage[]> => {
    const db = await dbPromise;
    const messages = await db.all<ChatMessage[]>(`
        SELECT username, text
        FROM chat_messages
        ORDER BY created_at DESC
        LIMIT ?
    `, [limit]);
    return messages.reverse();
};

export {saveMessageToDb, getLastMessagesFromDb};