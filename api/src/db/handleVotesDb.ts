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
    let votes = await db.all<Vote[]>(`
        SELECT id, created_at, date_end, plutaBonus
        FROM votes
        ORDER BY date_end DESC
        LIMIT ?
    `, [limit]);

    votes = votes.map(vote => ({
        ...vote,
        date_end: new Date(vote.date_end),
        created_at: new Date(vote.created_at)
    })).reverse();

    const validVotes: Vote[] = [];

    // remove old votes
    const idsToDelete: number[] = [];
    for (let vote of votes) {
        if (vote.date_end < new Date()) {
            idsToDelete.push(vote.id);
        } else {
            validVotes.push(vote);
        }
    }
    if (idsToDelete.length > 0) {
        await db.run(`
        DELETE FROM votes
        WHERE id IN (${idsToDelete.join(',')})
    `);
    }

    // return not removed
    return validVotes.reverse();
};

export {saveVoteToDb, getLastVotesFromDb};