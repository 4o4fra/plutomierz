import dbPromise from '../db/db';

const savePlutaToDb = async (plutaValue: number) => {
    try {
        const db = await dbPromise;
        await db.run(`
            INSERT INTO pluta_log (plutaValue, created_at)
            VALUES (?, ?)
        `, [plutaValue, new Date().toISOString()]);
    } catch (error) {
        console.error('Error saving Pluta to DB:', error);
        throw error;
    }
};

const getPlutaLog = async (fromDate?: Date): Promise<{ plutaValue: number, created_at: string }[]> => {
    try {
        const db = await dbPromise;
        const query = `
            SELECT plutaValue, created_at
            FROM pluta_log ${fromDate ? 'WHERE created_at > ?' : ''}
            ORDER BY created_at DESC
        `;
        const params = fromDate ? [new Date(fromDate).toISOString()] : [];
        return await db.all<{ plutaValue: number, created_at: string }[]>(query, params);
    } catch (error) {
        console.error('Error retrieving Pluta logs:', error);
        throw error;
    }
};

export {savePlutaToDb, getPlutaLog};