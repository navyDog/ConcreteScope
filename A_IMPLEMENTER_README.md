Page avec liste des entreprises avec bouton pour en ajouter/modifier/supprimer

-id
-nom
-contact principale (à implementer)
-courriel (à implementer)
-Telephone (à implementer)

Page avec liste des affaires avec bouton pour en ajouter/modifier/supprimer

-id
-nom
-contact de l'affaire (à implementer)
-courriel (à implementer)
-Telephone (à implementer)

Page avec liste des chantiers (par ordre du plus récent au plus ancien) avec bouton pour en ajouter/modifier/supprimer

-id
-numero
-nom (ouvrage/partie)
-affaire_id
-entreprise_id
-date_prelevement
-date reception
-Slump
-melange du beton sand/gravel/gravel2/cement/water (a implementer)
-Classe de béton visée (à implementer)
-NORMES (à implementer)
-piquage ou vibrage (à implementer)
-Essai sur beton hydraulique compression ou non (à implementer)
- type d'éprouvette (à implementer)
-lieu de confection sur site ou non/centrale ou toupie (à implementer)
-Rectification au sooufre ou non) (à implementer)
-condition de conservation (à implementer)

- on clique sur un chantier on peut avoir la liste des eprouvettes et toute les infos ( avec bouton pour en ajouter/modifier/supprimer

-éprouvettes 
-id
-chantier_id
-date_creation 
-date_ecrasement 
-age_jour
-hauteur (à implementer)
-diametre (à implementer)
-force (à implementer)
-masse (à implementer)




      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chantier_id INTEGER,
      date_creation TEXT,
      date_ecrasement TEXT,
      age_jour INTEGER,
      FOREIGN KEY (chantier_id) REFERENCES chantiers(id)
