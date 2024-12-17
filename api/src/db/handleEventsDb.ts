import dbPromise from '../db/db';
import {Event} from "../types/Event";

const saveEventToDb = async (event: Event) => {
    const db = await dbPromise;
    await db.run(`
        INSERT INTO events (user_id, title, description, date_start, date_end, plutaMultiplier, plutaBonus, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        event.user_id,
        event.title,
        event.description,
        event.date_start ? event.date_start.toISOString() : null,
        event.date_end.toISOString(),
        event.plutaMultiplier,
        event.plutaBonus,
        event.created_at.toISOString()
    ]);
};

const getLastEventsFromDb = async (limit: number): Promise<Event[]> => {
    const db = await dbPromise;
    const events = await db.all<Event[]>(`
        SELECT id, user_id, title, description, date_start, date_end, plutaMultiplier, plutaBonus, created_at
        FROM events
        ORDER BY created_at DESC
        LIMIT ?
    `, [limit]);
    return (events as Event[]).map(event => ({
        ...event,
        date_start: new Date(event.date_start),
        date_end: new Date(event.date_end),
        created_at: new Date(event.created_at)
    })).reverse();
};

export {saveEventToDb, getLastEventsFromDb};