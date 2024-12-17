// web/src/utils/websocketWorker.js
let socket;
let connections = 0;

onconnect = function (e) {
    const port = e.ports[0];
    connections++;

    if (!socket) {
        socket = new WebSocket('wss://api.plutomierz.ovh');
    }

    socket.onmessage = function (event) {
        port.postMessage(event.data);
    };

    port.onmessage = function (event) {
        if (event.data === 'close') {
            connections--;
            if (connections === 0) {
                socket.close();
                socket = null;
            }
        } else {
            socket.send(event.data);
        }
    };

    port.start();
};