import wss from './websocketServer';
//import getPlutaValue from '../utils/getPlutaValue';
import getNewPlutaValue from '../utils/getNewPlutaValue';
import {WebSocket} from 'ws';

let plutaValue: string = "";

const updatePlutaValue = async () => {
    const newPlutaValue = await getNewPlutaValue(54.372158, 18.638306);
    //const newPlutaValue = await getNewPlutaValue(54.372158, 18.638306);
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