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

// Configuration CORS
server.use(cors({
    origin: '*',  // Temporairement autoriser toutes les origines
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

// Pre-flight requests
server.options('*', cors());

// Middleware d'authentification simplifié
server.use((req, res, next) => {
    // Chemins publics
    if (req.path === '/login' || req.path.startsWith('/images')) {
        return next();
    }

    const auth = req.headers.authorization;
    if (!auth) {
        return res.status(401).json({ 
            error: 'Non autorisé',
            message: 'Authentification requise'
        });
    }

    // Vérifier l'utilisateur dans la base
    const user = router.db.get('users').find({ id: auth }).value();
    if (!user) {
        return res.status(401).json({ 
            error: 'Non autorisé',
            message: 'Utilisateur non trouvé'
        });
    }

    req.user = user;
    next();
});

// Route de login
server.post('/login', (req, res) => {
    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ error: 'Numéro de téléphone requis' });
    }

    const user = router.db.get('users').find({ phone }).value();
    if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
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