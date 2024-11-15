import { createServer } from 'http';

const port = 3000;
const server = createServer();

server.listen(port, () => {
    console.log(`Pluta is listening on port ${port}`);
});

export default server;