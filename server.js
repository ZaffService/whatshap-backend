import jsonServer from 'json-server';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router('db.json');

// Middleware CORS amélioré
server.use(cors({
    origin: ['https://final-whatshap.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true
}));

// Pre-flight requests pour CORS
server.options('*', cors());

// Middleware pour parser le JSON
server.use(express.json());

// Middleware pour les fichiers statiques
server.use('/images', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
}, express.static(path.join(__dirname, 'images')));

// Middleware d'authentification
server.use((req, res, next) => {
    if (req.path === '/login' || req.path.startsWith('/images')) {
        return next();
    }
    
    const userId = req.headers.authorization;
    if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    
    next();
});

// Routes de base
server.get('/test', (req, res) => {
    res.json({ status: 'ok' });
});

server.use(router);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});