import jsonServer from 'json-server';
import cors from 'cors';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`JSON Server est démarré sur le port ${PORT}`);
});