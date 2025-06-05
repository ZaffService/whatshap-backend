import jsonServer from 'json-server';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import 'dotenv/config';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
    static: path.join(__dirname, 'public')
});

// Configuration CORS mise à jour
server.use(cors({
    origin: ['https://final-whatshap-5607yctih-bakeli.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Middleware pour préflight requests
server.options('*', cors());

// Middleware pour normaliser les noms de fichiers
function normalizeFileName(fileName) {
    return fileName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Route pour normaliser les images
server.get('/normalize-images', (req, res) => {
    const imagesDir = path.join(__dirname, 'images');
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lecture dossier' });
        }
        
        files.forEach(file => {
            const normalizedName = normalizeFileName(file);
            if (file !== normalizedName) {
                fs.renameSync(
                    path.join(imagesDir, file),
                    path.join(imagesDir, normalizedName)
                );
            }
        });
        
        res.json({ message: 'Images normalisées' });
    });
});

// Middleware pour les fichiers statiques
server.use('/images', express.static(path.join(__dirname, 'images')));
server.use(express.static('public'));

// Modifiez la route de test des images
server.get('/test-images', (req, res) => {
    fs.readdir(path.join(__dirname, 'images'), (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lecture dossier images' });
        }
        
        // Normalisez les noms de fichiers
        const normalizedFiles = files.map(file => ({
            original: file,
            normalized: normalizeFileName(file)
        }));

        // Renommez les fichiers si nécessaire
        normalizedFiles.forEach(({original, normalized}) => {
            if (original !== normalized) {
                fs.renameSync(
                    path.join(__dirname, 'images', original),
                    path.join(__dirname, 'images', normalized)
                );
            }
        });

        res.json({
            status: 'ok',
            imagesPath: path.join(__dirname, 'images'),
            baseUrl: `${req.protocol}://${req.get('host')}/images/`,
            images: normalizedFiles.map(f => f.normalized)
        });
    });
});

// Route racine pour vérifier l'API
server.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'WhatsApp Backend API is running',
        endpoints: {
            chats: '/chats',
            images: '/images'
        }
    });
});

// Middleware d'authentification
server.use((req, res, next) => {
    // Autoriser OPTIONS pour les requêtes CORS
    if (req.method === 'OPTIONS') {
        return next();
    }

    const userId = req.headers['authorization'];
    if (req.path.includes('/chats') && !userId) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    next();
});

// Middleware par défaut de json-server
server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});