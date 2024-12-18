import {WebSocket} from 'ws';
import {getPlutaLog} from '../../db/plutaLogDb';

const handleGetPlutaLog = async (ws: WebSocket, message: any) => {
    try {
        if (typeof message.dateRangeInMs !== 'number' || message.dateRangeInMs < 0) {
            const logs = await getPlutaLog();
            ws.send(JSON.stringify({type: 'plutaLog', value: logs, dateRangeInMs: "Infinity"}));
            return;
        }

        const date = new Date(Date.now() - message.dateRangeInMs);
        const logs = await getPlutaLog(date);
        ws.send(JSON.stringify({type: 'plutaLog', value: logs, dateRangeInMs: message.dateRangeInMs}));
    } catch (error) {
        ws.send(JSON.stringify({type: 'error', message: 'Failed to fetch pluta log'}));
    }
};

export default handleGetPlutaLog;