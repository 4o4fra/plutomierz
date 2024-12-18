import {getLastVotesFromDb} from "../../db/handleVotesDb";

const accountVotes = async (plutaValue: number): Promise<number> => {

    const messages = await getLastVotesFromDb();

    const now = new Date();

    messages.map((message) => {
        if (message.created_at < now && now < message.date_end) {
            plutaValue += message.plutaBonus;
        }
    });

    return plutaValue;
}

export default accountVotes;