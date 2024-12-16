import wss from './websocketServer';
//import getPlutaValue from '../websocket/getPlutaValue';
import getPlutaValue from '../../plutaValue/getPlutaValue';
import {WebSocket} from 'ws';

let plutaValue: number = 0;
let plutaDev:{[key:string]:any} = {};

const updatePlutaValue = async () => {
    const {plutaValue:pluta, plutaDev:dev} = await getPlutaValue(54.372158, 18.638306);
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