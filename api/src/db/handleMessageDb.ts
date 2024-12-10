import dbPromise from '../db/db';
import {PlutaLog} from "../types/ChatMessage";

const saveMessageToDb = async (message: PlutaLog) => {
    const db = await dbPromise;
    await db.run(`
        INSERT INTO chat_messages (username, text, created_at)
        VALUES (?, ?, ?)
    `, [message.username, message.text, new Date().toISOString()]);
};

const getLastMessagesFromDb = async (limit: number): Promise<PlutaLog[]> => {
    const db = await dbPromise;
    const messages = await db.all<PlutaLog[]>(`
        SELECT username, text
        FROM chat_messages
        ORDER BY created_at DESC
        LIMIT ?
    `, [limit]);
    return messages.reverse();
};

export {saveMessageToDb, getLastMessagesFromDb};