import wss from './websocketServer';
import getNewPlutaValue from '../utils/getNewPlutaValue';
import {WebSocket} from 'ws';

let plutaValue: number | null = null;

const updatePlutaValue = async () => {
    const newPlutaValue = await getNewPlutaValue(54.372158, 18.638306);
    if (newPlutaValue !== plutaValue) {
        plutaValue = newPlutaValue;
        const message = JSON.stringify({type: 'pluta', value: plutaValue});
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
};
export {updatePlutaValue, plutaValue};