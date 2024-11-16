import dbPromise from '../db/db';

const getCurrentEvent = async (): Promise<number> => {
    const db = await dbPromise;
    const now = new Date().toISOString();
    const event = await db.get(`
        SELECT plutaMultiplier
        FROM events
        WHERE date_start <= ? AND date_end >= ?
        LIMIT 1
    `, [now, now]);

    return event ? event.plutaMultiplier : 1;
};

export default getCurrentEvent;