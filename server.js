import jsonServer from 'json-server';
import cors from 'cors';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Configuration CORS améliorée
server.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware de logging
server.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

server.use(middlewares);
server.use(router);

// Configuration du port
const PORT = process.env.PORT || 5001;

server.listen(PORT, '0.0.0.0', () => {
    console.log('------------------------------------');
    console.log(`✅ Serveur démarré sur le port: ${PORT}`);
    console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log('------------------------------------');
});