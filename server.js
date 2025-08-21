
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
// "nom" nom de l'affaire à donner par l'utilisateur - c'est le nom du projet
// "contact" : contact principale de l'entreprise
// "courriel" : son courriel
// "telephone" : son tel
// "MOA" : Maitre d'ouvrage de l'affaire
// "MOE" : Maitre d"oeuvre de l'affaire
  
  db.run(`
    CREATE TABLE IF NOT EXISTS affaires (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      nom TEXT NOT NULL,
      contact TEXT, 
      courriel TEXT, 
      telephone TEXT,
      MOA TEXT,
      MOE TEXT
    )
  `);

//TABLE "entreprises"
// "id" c'est lidentifiant unique crée par SQLite
// "nom" nom de l'entreprise à donner par l'utilisateur 
// "contact" : contact principale pour cette affaire
// "courriel" : son courriel
// "telephone" : son tel
  
  db.run(`
    CREATE TABLE IF NOT EXISTS entreprises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL
      contact TEXT, 
      courriel TEXT, 
      telephone TEXT
    )
  `);

  
//TABLE "chantiers"
// "id" c'est lidentifiant unique crée par SQLite
// "affaire_id" id de l'affaire associé à ce chantier
// "entrerpises_id" id de l'entreprise qui est en charge du chantier
// "numero" c'est le numero du chantier qui est généré automatiquement. Il vaut "Année en cours"-"B"-"numérotation progressive" soit le premier de l'an "2025-B-0001"
// "nomOuvrage" nom de l'ouvrage pour ce chantier 
// "nomPartieOuvrage" nom de la partie de l'ouvrage pour ce chantier
// "fabricantBeton" fabricant du beton 
// "lieuFabrication" Lieu de fabrication du beton sur site ou centrale etc
// "modeLivraison" mode de livraison du beton toupie, betoniere etc 
// "date_reception" date de reception du béton
// "date_prelevement" date de prelevement du béton
// "cBeton" : classe de béton visée C30/37 C25/30 etc
// "vBeton"  volume de béton coulé pour ce chantier 
// "norme" choisir la norme de travail NF P94-??? 
// 'infoFormule", inforamtion sur le beton 
// "melangeBeton" type de melange du beton sand/gravel/cement/water 
// "tEprouvette" type d'éprouvette : Cylindrique CUBIQUE Prismatiques Carottes 16x32 ou C 15x30 etc 
// "lieuPrelevement" Lieu de prelevement Chantier Centrale
// "slump" affaissement mesurée 
// "serrage"  mode serrage du béton : piquage/vibration avec aiguille à vibrer ? 
// "conservation" : mode de conservation : piscine thermostat 20degré 
// "couches" nombres de couches 
// "tVibration" durée de vibration 
// "typeEssai" : type d'essai Essai de compression/fendage/flexion sur béton hydraulique  
// "preparation" mode de preparation des appuis : Rectification, souffrage, sableuse ? 
// "presse" type de presse utilisée  

  db.run(`
    CREATE TABLE IF NOT EXISTS chantiers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      affaire_id INTEGER,
      entreprise_id INTEGER,
      numero INTEGER UNIQUE,
      nomOuvrage TEXT NOT NULL,
      nomPartieOuvrage TEXT,
      fabricantBeton TEXT,
      lieuFabrication TEXT,
      modeLivraison TEXT,
      date_reception TEXT,
      date_prelevement TEXT,
      cBeton TEXT,
      vBeton TEXT,
      norme TEXT,
      infoFormule TEXT,
      melangeBeton TEXT, 
      tEprouvette TEXT,
      lieuPrelevement TEXT,
      slump TEXT,
      serrage TEXT,
      conservation TEXT,
      couches TEXT,
      tVibration TEXT,
      typeEssai TEXT,
      preparation TEXT,
      presse TEXT,
      FOREIGN KEY (affaire_id) REFERENCES affaires(id),
      FOREIGN KEY (entreprise_id) REFERENCES entreprises(id)
    )
  `);

//TABLE "eprouvettes"
// "id" c'est lidentifiant unique crée par SQLite
// "chantier_id" id du chantier associé à ces éprouvettes
 // "age_jour" nombre de jour avant écrasement des éprouvettes 
// "date_creation" = date de prevelevement
// "date_ecrasement" = date creation + age jour
//"hauteur" 
//"diametre
// surface = pi*(diametre/2)^2 
//"force
//"masse 
  db.run(`
    CREATE TABLE IF NOT EXISTS eprouvettes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chantier_id INTEGER,
      age_jour INTEGER,
      date_creation TEXT,
      date_ecrasement TEXT,
      hauteur INTEGER,
      diametre INTEGER,
      surface INTEGER
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


// Requetes GET tous les chantiers
app.get('/api/chantiers', (req, res) => {
  db.all('SELECT * FROM chantiers', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// Requetes GET tous les chantiers avec nom affaire

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

// Requetes GET pour une éprouvettes à partir de son ID. 

app.get('/api/eprouvettes', (req, res) => {
  const chantierId = req.query.chantier_id;
  const sql = `SELECT * FROM eprouvettes WHERE chantier_id = ?`;
  db.all(sql, [chantierId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur DB' });
    }
    res.json(rows);
  });
});


// POST une nouvelle affaire

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
  if (!nom || !affaire_id || !entreprise_id) return res.status(400).json({ error: 'Nom et affaire obligatoires' });
  
 

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

// Liste des éprouvettes dans leur totalité
app.get('/api/alleprouvettes', (req, res) => {
  db.all(`
    SELECT e.*, c.nom as chantier_nom
    FROM eprouvettes e
    LEFT JOIN chantiers c ON e.chantier_id = c.id
    ORDER BY e.date_ecrasement ASC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});



app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});
