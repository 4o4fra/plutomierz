import wss from './websocketServer';
//import getPlutaValue from '../utils/getPlutaValue';
import getNewPlutaValue from '../utils/getNewPlutaValue';
import {WebSocket} from 'ws';

let plutaValue: number = 0;
let plutaDev = "";

const updatePlutaValue = async () => {
    const {plutaValue:pluta, plutaDev:dev} = await getNewPlutaValue(54.372158, 18.638306);
    plutaValue = pluta;
    plutaDev = dev;
    const message = JSON.stringify({type: 'pluta', value: plutaValue});
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};
export {updatePlutaValue, plutaValue, plutaDev};