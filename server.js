import jsonServer from 'json-server';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Configuration CORS correcte
server.use(cors({
    origin: '*',  // Permettre toutes les origines en développement
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: false,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

server.use(middlewares);
server.use(router);
server.use('/images', express.static(path.join(__dirname, 'images')));

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