import {WebSocketServer} from 'ws';
import server from '../server';

const wss = new WebSocketServer({server});

export default wss;