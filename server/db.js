
 //charge la librairie SQLite3 pour accèder à une database SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require("path");

const db_name = path.join(__dirname, "data", "data.db");
//Ouvre (ou crée si elle n'existe pas) un fichier SQLite qui va contenir la database.
const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    console.error('❌ Erreur connexion DB :', err.message);
  } else {
    console.log('✅ Connecté à SQLite');
  }
});


//CREATION DES TABLES

db.serialize(() => {

    db.run('PRAGMA foreign_keys = ON');

    //table des tokens révoqués 
    db.run(`
    CREATE TABLE IF NOT EXISTS revoked_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT NOT NULL UNIQUE,
      revoked_at TEXT NOT NULL
    )
  `);

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
      nom TEXT NOT NULL,
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
      nomOuvrage TEXT,
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
      surface INTEGER, force INTEGER,
      masse INTEGER,
      FOREIGN KEY (chantier_id) REFERENCES chantiers(id)
    )
  `);

  // --- Création des index ---
  db.run('CREATE INDEX IF NOT EXISTS idx_users_username ON usersCS(username)');

  db.run('CREATE INDEX IF NOT EXISTS idx_chantiers_affaire ON chantiers(affaire_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_chantiers_entreprise ON chantiers(entreprise_id)');

  db.run('CREATE INDEX IF NOT EXISTS idx_eprouvettes_chantier ON eprouvettes(chantier_id)');

  db.run('CREATE INDEX IF NOT EXISTS idx_revoked_tokens_token ON revoked_tokens(token)');


});


module.exports = db;