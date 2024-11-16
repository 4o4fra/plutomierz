import wss from './websocketServer';
import getPlutaValue from '../utils/getPlutaValue';
import {WebSocket} from 'ws';

let plutaValue: number | null = null;

const updatePlutaValue = async () => {
    const newPlutaValue = await getPlutaValue(54.372158, 18.638306);
    if (newPlutaValue !== plutaValue) {
        plutaValue = newPlutaValue;
        const message = JSON.stringify({plutaValue});
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
};

export {updatePlutaValue, plutaValue};