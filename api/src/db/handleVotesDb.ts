import dbPromise from '../db/db';
import {Vote} from "../types/Vote";

const saveVoteToDb = async (vote: Vote) => {
    const db = await dbPromise;
    await db.run(`
        INSERT INTO votes (date_end, plutaBonus)
        VALUES (?, ?)
    `, [vote.date_end.toISOString(), vote.plutaBonus]);
};

const getLastVotesFromDb = async (limit: number): Promise<Vote[]> => {
    const db = await dbPromise;
    const votes = await db.all<Vote[]>(`
        SELECT id, created_at, date_end, plutaBonus
        FROM votes
        ORDER BY created_at DESC
        LIMIT ?
    `, [limit]);
    return votes.map(vote => ({
        ...vote,
        date_end: new Date(vote.date_end),
        created_at: new Date(vote.created_at)
    })).reverse();
};

export {saveVoteToDb, getLastVotesFromDb};