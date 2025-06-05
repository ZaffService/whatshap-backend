import jsonServer from 'json-server';
import cors from 'cors';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Configuration CORS améliorée
server.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

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
    res.status(500).json({ 
        error: 'Erreur serveur',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
    });
});

// Configuration du port (priorité à la variable d'environnement Render)
const PORT = process.env.RENDER_PORT || process.env.PORT || 5001;

try {
    server.listen(PORT, '0.0.0.0', () => {
        console.log('------------------------------------');
        console.log(`✅ Serveur démarré sur le port: ${PORT}`);
        console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}`);
        console.log('------------------------------------');
    });
} catch (error) {
    console.error('❌ Erreur de démarrage:', error);
    process.exit(1);
}