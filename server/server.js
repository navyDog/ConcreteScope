



//SERVER EXPRESS


//charge le module express qui permet de créer un serveur WEB en node.js
const express = require('express');
const path = require('path');
// crée une instance du serveur Express
const app = express();
//ecoute sur le port 3000, "http://localhost:3000
const PORT = 3000;
//charge le module CORS, cela permet d'autoriser le front à appeler les API sans blocage par le naviguateur
const cors = require('cors');


//Middleware le serveur lit automatiquement les requetes au format JSON
app.use(express.json());
// lit automatiquement les fichier statiques dans le dossier public
app.use(express.static(path.resolve(__dirname, '../public')));







 


// Routes à utiliser
app.use('/api/affaires', require('./routes/affairesRoutes'));
app.use('/api/entreprises', require('./routes/entreprisesRoutes'));
app.use('/api/chantiers', require('./routes/chantiersRoutes'));
app.use('/api/eprouvettes', require('./routes/eprouvettesRoutes'));

// charle le middlex$ware d'erreur
app.use(require('./utils/errorHandler'));

// initialise la DB + crée les tables
require('./db');           
//active CORS, autorise les requetes cross-origin
app.use(cors());

// Il manque un token d'identification pour empecher les requetes par n'importe qui 
// il faut un  middleware pour verifier tout ca. Je me renseigne. 

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});