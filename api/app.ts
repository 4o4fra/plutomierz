import initDb from './src/db/initDb';
import './src/server';
import './src/websocket/websocket';

initDb().catch(err => {
    console.error('Failed to initialize database', err);
});