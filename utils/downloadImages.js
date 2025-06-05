import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '..', 'images');

const imagesList = [
    'pathe.jpeg',
    'abdallah.jpeg',
    'ousmane.jpeg',
    'die.jpeg',
    'zeynabe.jpeg',
    'kalidou.jpeg',
    'sems.jpeg',
    'vonne.jpeg'
];

// Créer le dossier images s'il n'existe pas
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

function downloadImage(imageName) {
    const url = `https://whatshap-backend.onrender.com/images/${imageName}`;
    const filePath = path.join(imagesDir, imageName);

    https.get(url, (response) => {
        if (response.statusCode === 200) {
            const fileStream = fs.createWriteStream(filePath);
            response.pipe(fileStream);
            console.log(`✅ Image téléchargée : ${imageName}`);
        } else {
            console.error(`❌ Erreur téléchargement ${imageName}: ${response.statusCode}`);
        }
    }).on('error', (err) => {
        console.error(`❌ Erreur : ${err.message}`);
    });
}

// Télécharger toutes les images
imagesList.forEach(downloadImage);