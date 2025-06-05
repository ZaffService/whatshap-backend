import jsonServer from 'json-server';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
    static: path.join(__dirname, 'public')
});

// Configuration CORS
server.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Middleware pour les images
server.use('/images', express.static(path.join(__dirname, 'images')));

// Middleware par défaut de json-server
server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});