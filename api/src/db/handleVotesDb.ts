import dbPromise from '../db/db';
import {Vote} from "../types/Vote";

const getLastVotesFromDb = async (): Promise<Vote[]> => {
    try {
        const db = await dbPromise;
        let votes = await db.all<Vote[]>(`
            SELECT id, created_at, date_end, plutaBonus
            FROM votes
            ORDER BY date_end DESC
        `);

        votes = votes.map(vote => ({
            ...vote,
            date_end: new Date(vote.date_end),
            created_at: new Date(vote.created_at)
        })).reverse();

        const validVotes: Vote[] = [];

        // remove expired votes
        for (let vote of votes) {
            if (vote.date_end < new Date()) {
                await db.run(`
                    DELETE FROM votes
                    WHERE id = ?
                `, [vote.id]);
            } else {
                validVotes.push(vote);
            }
        }

        return validVotes.reverse();
    } catch (error) {
        console.error('Failed to fetch votes:', error);
        throw error;
    }
};

export { getLastVotesFromDb };