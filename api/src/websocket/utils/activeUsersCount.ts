import wss from "./websocketServer";
import {WebSocket} from "ws";

const getActiveUsersCount = (): number => {
    return Array.from(wss.clients).filter(client => client.readyState === WebSocket.OPEN).length;
};

const broadcastActiveUsersCount = (): void => {
    const count = getActiveUsersCount();
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({type: 'activeUsers', count}));
        }
    });
};

export default broadcastActiveUsersCount;