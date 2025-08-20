
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
    CREATE TABLE users (
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
      FOREIGN KEY (entrerprise_id) REFERENCES entreprises(id)
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
      age_jour INTEGER,
      nombre INTEGER,
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

// Requetes GET tous les chantiers avec nom affaire

app.get('/api/chantiers', (req, res) => {
  const sql = `
    SELECT chantiers.*, affaires.nom as affaire_nom
    FROM chantiers
    LEFT JOIN affaires ON chantiers.affaire_id = affaires.id
    LEFT JOIN entreprises ON chantiers.entreprises_id = entreprises.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lecture chantiers' });
    }
    res.json(rows);
  });
});

