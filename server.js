
const sqlite3 = require('sqlite3').verbose(); 
 //charge la librairie SQLite3 pour accèder à une database SQLite

const db = new sqlite3.Database('./data.db');
//Ouvre (ou crée si elle n'existe pas) un fichier SQLite qui va contenir la database.

//CREATION DES TABLES

db.serialize(() => {

//TABLE "users"
// "id" c'est lidentifiant unique crée par SQLite
// "username" nom de l'utilisateur
// "passwordHash" mdp du compte

 
  db.run(`
    CREATE TABLE IF NOT EXISTS usersCS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL
    )
  `);
 
//TABLE "affaires"
// "id" c'est lidentifiant unique crée par SQLite
// "nom" nom de l'affaire à donner par l'utilisateur 
  
  db.run(`
    CREATE TABLE IF NOT EXISTS affaires (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      nom TEXT NOT NULL
    )
  `);

//TABLE "entreprises"
// "id" c'est lidentifiant unique crée par SQLite
// "nom" nom de l'entreprise à donner par l'utilisateur 
  
  db.run(`
    CREATE TABLE IF NOT EXISTS entreprises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL
    )
  `);

  
//TABLE "chantiers"
// "id" c'est lidentifiant unique crée par SQLite
// "numero" c'est le numero du chantier qui est généré automatiquement. Il vaut "Année en cours"-"B"-"numérotation progressive" soit le premier de l'an "2025-B-0001"
// "nom" nom du chantier donnée par l'utilisateur
// "affaire_id" id de l'affaire associé à ce chantier
// "entrerpises_id" id de l'entreprise qui est en charge du chantier
// "date_reception" date de reception du béton
// "date_prelevement" date de prelevement du béton
// "slump" slump du béton mesuré par le cône d'Abraham
  db.run(`
    CREATE TABLE IF NOT EXISTS chantiers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero INTEGER UNIQUE,
      nom TEXT NOT NULL,
      affaire_id INTEGER,
      entreprise_id INTEGER,
      date_reception TEXT,
      date_prelevement TEXT,
      slump TEXT,
      FOREIGN KEY (affaire_id) REFERENCES affaires(id),
      FOREIGN KEY (entreprise_id) REFERENCES entreprises(id)
    )
  `);

//TABLE "eprouvettes"
// "id" c'est lidentifiant unique crée par SQLite
// "chantier_id" id du chantier associé à ces éprouvettes
// "age_jour" nombre de jour avant écrasement des éprouvettes 
// "nombre" nombre d'éprouvettes
  db.run(`
    CREATE TABLE IF NOT EXISTS eprouvettes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chantier_id INTEGER,
      date_creation TEXT,
      date_ecrasement TEXT,
      age_jour INTEGER,
      hauteur INTEGER,
      diametre INTEGER,
      force INTEGER,
      masse INTEGER,
      FOREIGN KEY (chantier_id) REFERENCES chantiers(id)
    )
  `);


});


//SERVER EXPRESS

const express = require('express');
//charge le module express qui permet de créer un serveur WEB en node.js
const cors = require('cors');
//charge le module CORS, cela permet d'autoriser le front à appeler les API sans blocage par le naviguateur
const app = express();
// crée une instance du serveur Express
const PORT = 3000;
//ecoute sur le port 3000, "http://localhost:3000
app.use(cors());
//active CORS, autorise les requetes cross-origin
app.use(express.json());
//le serveur lit automatiquement les requetes au format JSON
app.use(express.static('public'));
// lit automatiquement les fichier statiques dans le dossier public

// Il manque un token d'identification pour empecher les requetes par n'importe qui 
// il faut un  middleware pour verifier tout ca. Je me renseigne. 

//Requetes GET pour avoir la liste des affaires
app.get('/api/affaires', (req, res) => {
  db.all('SELECT * FROM affaires', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

//Requetes GET pour avoir la liste des entreprises
app.get('/api/entreprises', (req, res) => {
  db.all('SELECT * FROM entreprises', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Requetes GET pour avoir tous les chantiers avec nom affaire
app.get('/api/chantiers', (req, res) => {
  const sql = `
    SELECT chantiers.*, affaires.nom as affaire_nom, entreprises.nom as entreprise_nom
    FROM chantiers
    LEFT JOIN affaires ON chantiers.affaire_id = affaires.id
    LEFT JOIN entreprises ON chantiers.entreprise_id = entreprises.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lecture chantiers' });
    }
    res.json(rows);
  });
});



// Requete POST pour avoir une nouvelle affaire

app.post('/api/affaires', (req, res) => {
  const { nom } = req.body;
   // Vérifie que le nom est fourni
  if (!nom || nom.trim() === '') {
    return res.status(400).json({ error: 'Nom obligatoire' });
  }

  //insertion dans la table affaires 
  db.run('INSERT INTO affaires (nom) VALUES (?)', [nom], function (err) {
    if (err) return res.status(500).json({ error: err.message });
   // this.lastID = ID auto-incrémenté de la nouvelle affaire
    res.json({ id: this.lastID, nom });
  });
});

// POST une nouvelle entreprise

app.post('/api/entreprises', (req, res) => {
  const { nom } = req.body;

   // Vérifie que le nom est fourni
  if (!nom || nom.trim() === '') {
    return res.status(400).json({ error: 'Nom obligatoire' });
  }

  //insertion dans la table entreprises
  db.run('INSERT INTO entreprises (nom) VALUES (?)', [nom], function (err) {
    if (err) return res.status(500).json({ error: err.message });

   // this.lastID = ID auto-incrémenté de la nouvelle entreprise
    res.json({ id: this.lastID, nom });
  });
});

//Post nouveau chantier 

app.post('/api/chantiers', (req, res) => {
  const { nom, affaire_id, entreprise_id , date_reception, date_prelevement, slump} = req.body;
  const year = new Date().getFullYear();
  const prefix = `${year}-B-`;

  // Vérifie les champs
  if (!nom || !affaire_id || !entreprise_id) return res.status(400).json({ error: 'Nom,entreprise et affaire obligatoires' });
 
  // Numérotation automatique par année
  db.get('SELECT COUNT(*) AS count FROM chantiers WHERE numero LIKE ?', [`${prefix}%`], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    const numero = `${prefix}${row.count + 1}`; // ex: "2025-B-1"
    console.log(numero, nom, affaire_id, entreprise_id, date_reception, date_prelevement, slump );

    const sql = `
      INSERT INTO chantiers (numero, nom, affaire_id, entreprise_id, date_reception, date_prelevement, slump)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [numero, nom, affaire_id, entreprise_id, date_reception, date_prelevement, slump ];

    db.run(sql, params, function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur création chantier' });
      }
      res.json({ id: this.lastID, numero: numero });
    });
  });
});

// Requete GET pour récupérer toutes les éprouvettes
app.get('/api/eprouvettes', (req, res) => {
  const sql = `
    SELECT eprouvettes.*, chantiers.nom as chantier_nom, chantiers.numero as chantier_numero
    FROM eprouvettes
    LEFT JOIN chantiers ON eprouvettes.chantier_id = chantiers.id
    ORDER BY eprouvettes.date_creation DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lecture éprouvettes' });
    }
    res.json(rows);
  });
});

// Requete POST pour avoir une serie d'éprouvettes
app.post('/api/eprouvettes', (req, res) => {
  const {chantier_id, nb, jours } = req.body; 

  if (!chantier_id) return res.status(400).json({ error: 'Chantier ID obligatoire' });

  // Récupérer la date de réception du chantier
  db.get('SELECT date_reception FROM chantiers WHERE id = ?', [chantier_id], (err, chantier) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!chantier || !chantier.date_reception) return res.status(400).json({ error: 'Date de réception non définie pour ce chantier' });

    const date_creation = new Date(chantier.date_reception);

    const stmt = db.prepare(`
      INSERT INTO eprouvettes (chantier_id, date_creation, date_ecrasement, age_jour, hauteur, diametre, force, masse)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < nb; i++) {
      const date_ecrasement = new Date(date_creation);
      date_ecrasement.setDate(date_creation.getDate() + parseInt(jours));
      stmt.run(
        chantier_id,
        date_creation.toISOString().split('T')[0],
        date_ecrasement.toISOString().split('T')[0],
        parseInt(jours),
        null, // hauteur - sera rempli plus tard
        null, // diametre - sera rempli plus tard
        null, // force - sera rempli plus tard
        null  // masse - sera rempli plus tard
      );
    }

    stmt.finalize(err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });
});


app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});
