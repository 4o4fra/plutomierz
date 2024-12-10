import dbPromise from '../db/db';

const savePlutaToDb = async (plutaValue: number) => {
    const db = await dbPromise;
    await db.run(`
        INSERT INTO pluta_log (plutaValue, created_at)
        VALUES (?, ?)
    `, [plutaValue, new Date().toISOString()]);
};

const getPlutaLog = async (fromDate?: Date): Promise<{ plutaValue: number, created_at: string }[]> => {
    const db = await dbPromise;
    const query = `
        SELECT plutaValue, created_at
        FROM pluta_log
        ${fromDate ? 'WHERE created_at > ?' : ''}
        ORDER BY created_at DESC
    `;
    const params = fromDate ? [new Date(fromDate).toISOString()] : [];
    const logs = await db.all<{ plutaValue: number, created_at: string }[]>(query, params);
    return logs;
};

export { savePlutaToDb, getPlutaLog };