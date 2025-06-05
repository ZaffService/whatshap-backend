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

// Middleware pour parser le JSON
server.use(jsonServer.bodyParser);

// Configuration CORS pour Vercel
server.use(cors({
    origin: [
        'https://final-whatshap.vercel.app',
        'https://final-whatshap-*.vercel.app'
    ],
    credentials: true
}));

// Route de login
server.post('/login', (req, res) => {
    try {
        const { phone } = req.body;
        const users = router.db.get('users').value();
        const user = users.find(u => u.phone === phone);
        
        if (!user) {
            return res.status(404).json({ 
                error: 'Utilisateur non trouvé',
                message: 'Numéro de téléphone incorrect'
            });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ 
            error: 'Erreur serveur',
            message: error.message 
        });
    }
});

// Middleware pour les images
server.use('/images', express.static(path.join(__dirname, 'images')));

// Routes API protégées
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

server.use(router);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur ${PORT}`);
});