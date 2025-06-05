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

// Configuration CORS améliorée
server.use(cors({
    origin: '*', // Temporairement autoriser toutes les origines
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: false // Désactiver temporairement
}));

// Middleware pour les fichiers statiques
server.use(express.static('public'));
server.use('/images', express.static(path.join(__dirname, 'images')));

// Route de test
server.get('/test', (req, res) => {
    res.json({ status: 'ok' });
});

server.use(router);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});