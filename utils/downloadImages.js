import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '..', 'images');

// Création du dossier images s'il n'existe pas
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const images = [
    'pathe.jpeg',
    'abdallah.jpeg',
    'ousmane.jpeg',
    'die.jpeg',
    'zeynabe.jpeg',
    'kalidou.jpeg',
    'sems.jpeg',
    'vonne.jpeg'
];

function downloadImage(imageName) {
    const url = `https://whatshap-backend.onrender.com/images/${imageName}`;
    const filePath = path.join(imagesDir, imageName);
    
    https.get(url, (response) => {
        if (response.statusCode === 200) {
            const fileStream = fs.createWriteStream(filePath);
            response.pipe(fileStream);
            console.log(`✅ Image téléchargée : ${imageName}`);
        } else {
            console.error(`❌ Erreur : ${imageName} (${response.statusCode})`);
        }
    }).on('error', (err) => {
        console.error(`❌ Erreur réseau : ${err.message}`);
    });
}

console.log('Début du téléchargement des images...');
images.forEach(downloadImage);