import {getLastEventsFromDb} from "../../db/handleEventsDb";

const accountEvents = async (plutaValue: number): Promise<number> => {

    const messages = await getLastEventsFromDb();

    const now = new Date();

    messages.map((message) => {
        if (message.date_start < now && now < message.date_end) {
            plutaValue *= message.plutaMultiplier;
            plutaValue += message.plutaBonus;
        }
    });

    return plutaValue;
}

export default accountEvents;