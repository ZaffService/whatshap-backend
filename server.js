import jsonServer from 'json-server';
import cors from 'cors';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Configuration CORS améliorée
server.use(cors({
    origin: ['https://final-whatshap.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ajoutez ces headers à chaque réponse
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Middleware de logging
server.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

server.use(middlewares);
server.use(router);

// Gestion des erreurs
server.use((err, req, res, next) => {
    console.error('Erreur:', err);
    res.status(500).json({ error: 'Erreur serveur interne' });
});

const PORT = process.env.PORT || 10000;

try {
    server.listen(PORT, '0.0.0.0', () => {
        console.log('------------------------------------');
        console.log(`✅ JSON Server est démarré sur le port ${PORT}`);
        console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}`);
        console.log('------------------------------------');
    });
} catch (error) {
    console.error('Erreur de démarrage:', error);
    process.exit(1);
}