



//SERVER EXPRESS

/* const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),   // clé privée
  cert: fs.readFileSync('cert.pem')  // certificat auto-signé
}; */




//charge le module express qui permet de créer un serveur WEB en node.js
const express = require('express');
const path = require('path');
// crée une instance du serveur Express
const app = express();
//ecoute sur le port 3000, "http://localhost:3000
const { JWT_SECRET, PORT } = require('./config');
//charge le module CORS, cela permet d'autoriser le front à appeler les API sans blocage par le naviguateur
const cors = require('cors');


//Middleware le serveur lit automatiquement les requetes au format JSON
app.use(express.json());
// lit automatiquement les fichier statiques dans le dossier public
app.use(express.static(path.resolve(__dirname, '../public')));

const authMiddleware = require('./utils/authMiddleware'); // si on veut authentifier les routes
// il faut ecrire //app.use('/api/affaires',authMiddleware, require('./routes/affairesRoutes'));

// Routes publiques
app.use('/auth', require('./routes/auth')); // login/register accessibles sans token


// Routes à utiliser avec authentification
app.use('/api/affaires', require('./routes/affairesRoutes'));
app.use('/api/entreprises', require('./routes/entreprisesRoutes'));
app.use('/api/chantiers', require('./routes/chantiersRoutes'));
app.use('/api/eprouvettes', require('./routes/eprouvettesRoutes'));

// charle le middlex$ware d'erreur
app.use(require('./utils/errorHandler'));

// initialise la DB + crée les tables
require('./db');           
//active CORS, autorise les requetes cross-origin
app.use(cors({
  origin: 'http://localhost:3000', //  front vanilla
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Il manque un token d'identification pour empecher les requetes par n'importe qui 

const RevokedToken = require('./models/revokedTokenModel');

setInterval(() => {
  RevokedToken.purgeExpired().catch(err => console.error('Erreur purge tokens:', err));
}, 3600 * 1000); // toutes les heures
// il faut un  middleware pour verifier tout ca. Je me renseigne. 

 app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
}); 

/* https.createServer(options, app).listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
}); */