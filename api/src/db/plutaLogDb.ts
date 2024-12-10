import dbPromise from '../db/db';

const savePlutaToDb = async (plutaValue) => {
    const db = await dbPromise;
    await db.run(`
        INSERT INTO pluta_log (plutaValue, created_at)
        VALUES (?, ?)
    `, [plutaValue, new Date().toISOString()]);
};

export {savePlutaToDb};