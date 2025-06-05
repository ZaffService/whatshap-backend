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

// Configuration CORS simplifiée
server.use(cors());

// Middleware pour parser le JSON
server.use(jsonServer.bodyParser);

// Route de login
server.post('/login', (req, res) => {
    const { phone } = req.body;
    const user = router.db.get('users').find({ phone }).value();
    
    if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
});

// Routes API protégées
server.use((req, res, next) => {
    if (req.path === '/login' || req.method === 'OPTIONS') {
        return next();
    }

    const userId = req.headers.authorization;
    if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
    }

    next();
});

server.use(router);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur ${PORT}`);
});