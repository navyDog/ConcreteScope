const sqlite3 = require('sqlite3').verbose(); 
 //charge la librairie SQLite3 pour accèder à une database SQLite

const db = new sqlite3.Database('./data.db');
//Ouvre (ou crée si elle n'existe pas) un fichier SQLite qui va contenir la database.

//CREATION DES TABLES

db.serialize(() => {

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
