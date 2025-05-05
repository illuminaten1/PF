# Protection Fonctionnelle (PF)

Application de gestion de la protection fonctionnelle pour les militaires et leurs ayants-droits, permettant de gérer les affaires, bénéficiaires, conventions et règlements.

## Structure du projet

```
PF/
├── docker-compose.yml        # Configuration pour le déploiement Docker
├── backend/                  # Code du serveur Node.js/Express
│   ├── middleware/           # Middlewares Express
│   │   └── auth.js           # Middleware d'authentification JWT
│   ├── models/               # Modèles MongoDB
│   │   └── utilisateur.js    # Modèle des utilisateurs
│   ├── node_modules/         # Dépendances Node.js
│   ├── routes/               # Routes API
│   │   └── utilisateurs.js   # Gestion des utilisateurs
│   ├── scripts/              # Scripts utilitaires
│   │   └── init-admin.js     # Script pour initialiser le premier administrateur
│   ├── temp/                 # Dossier temporaire
│   ├── templates/            # Templates pour les documents
│   ├── utils/                # Utilitaires
│   │   └── DocumentGenerator.js  # Génération de documents (PDFs, etc.)
│   ├── .env                  # Variables d'environnement
│   ├── app.js                # Point d'entrée du serveur
│   ├── docker-entrypoint.sh  # Script d'entrée pour Docker
│   ├── Dockerfile            # Configuration pour l'image Docker backend
│   ├── package.json          # Dépendances du backend
│   └── package-lock.json     # Versions verrouillées des dépendances
└── client/                   # Code de l'interface React
    ├── node_modules/         # Dépendances React
    ├── public/               # Fichiers statiques
    ├── src/                  # Code source React
    │   ├── components/       # Composants React
    │   │   ├── common/       # Composants génériques réutilisables
    │   │   │   ├── DataTable.js        # Tableau de données générique
    │   │   │   ├── ExpandableSection.js # Section dépliable
    │   │   │   ├── FormField.js        # Champ de formulaire
    │   │   │   ├── HeaderComponents.js # Composants d'en-tête
    │   │   │   ├── MarkdownEditor.js   # Éditeur Markdown pour les notes
    │   │   │   ├── Modal.js            # Fenêtre modale
    │   │   │   ├── PageHeader.js       # En-tête de page
    │   │   │   └── StatusTag.js        # Étiquette de statut
    │   │   ├── forms/       # Formulaires pour la création/édition
    │   │   │   ├── AvocatForm.js       # Formulaire des avocats
    │   │   │   └── UtilisateurForm.js  # Formulaire de gestion des utilisateurs
    │   │   └── specific/    # Composants spécifiques à l'application
    │   ├── contexts/        # Contextes React pour état global
    │   │   ├── AppContext.js     # Contexte global de l'application
    │   │   └── AuthContext.js    # Contexte d'authentification
    │   ├── layouts/         # Layouts principaux
    │   │   └── MainLayout.js     # Layout principal
    │   ├── pages/           # Pages principales (à créer)
    │   │   ├── Login.js            # Page de connexion
    │   │   ├── PFAffaires.js       # Page liste des affaires
    │   │   ├── PFBeneficiaires.js  # Page liste des bénéficiaires
    │   │   ├── PFConventions.js    # Page liste des conventions
    │   │   ├── PFReglements.js     # Page liste des règlements
    │   │   ├── PFStatistiques.js   # Page des statistiques
    │   │   └── PFParametres.js     # Page des paramètres
    │   ├── utils/          # Utilitaires frontend
    │   │   ├── api.js             # Client API (axios)
    │   │   └── PrivateRoute.js    # Composant pour protéger les routes privées
    │   ├── App.css         # Styles CSS de l'application
    │   ├── App.js          # Composant racine (avec routes protégées)
    │   ├── App.test.js     # Tests du composant racine
    │   ├── index.css       # Styles CSS globaux
    │   ├── index.js        # Point d'entrée React
    │   └── logo.svg        # Logo SVG
    ├── .env                # Variables d'environnement React
    ├── .gitignore          # Fichiers à ignorer par Git
    ├── Dockerfile          # Configuration pour l'image Docker frontend
    ├── nginx.conf          # Configuration Nginx
    ├── package.json        # Dépendances du client
    └── package-lock.json   # Versions verrouillées des dépendances
```

## Prérequis

- Node.js (v14 ou supérieur)
- MongoDB
- Docker et Docker Compose (pour le déploiement conteneurisé)
- LibreOffice (pour la génération de documents)

## Installation et configuration

### Développement local

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/votre-utilisateur/protection-fonctionnelle.git
   cd protection-fonctionnelle
   ```

2. **Configuration backend** :
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Modifier le fichier .env selon vos besoins
   ```

3. **Configuration frontend** :
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Modifier le fichier .env selon vos besoins
   ```

4. **Démarrer le serveur de développement backend** :
   ```bash
   cd ../backend
   npm run dev
   ```

5. **Démarrer le serveur de développement frontend** :
   ```bash
   cd ../client
   npm start
   ```

### Déploiement avec Docker

1. **Configuration** :
   
   Modifiez les fichiers `docker-compose.yml`, `.env` dans le dossier backend selon vos besoins.

2. **Construction et démarrage des conteneurs** :
   ```bash
   docker-compose up -d --build
   ```

3. **Accès à l'application** :
   - Interface web : http://localhost:81
   - API backend : http://localhost:5003/api

## Fonctionnalités principales

### Modèle de données

1. **PFAffaire** :
   - Année
   - Date des faits
   - Lieu des faits
   - Type (VICTIME, MIS_EN_CAUSE)
   - Type de décision (AJ, AJE, PJ, REJET)
   - Rédacteur
   - SGAMI compétent

2. **PFBeneficiaire** :
   - Grade/Genre
   - Nom, Prénom
   - Numéro et date de décision
   - Avocat
   - SGAMI compétent
   - Rédacteur
   - Affaire associée

3. **PFConvention** :
   - Numéro d'ordre (auto-incrémenté par année)
   - Type (CONVENTION, AVENANT)
   - Bénéficiaires concernés
   - Instance (enquête, information judiciaire, première instance, etc.)
   - Diligences
   - Montant
   - Date de création
   - Date de retour avocat
   - Avocat
   - Nom de fichier (selon convention de nommage)

4. **PFReglement** :
   - Bénéficiaires concernés
   - Qualité du destinataire
   - Identité du destinataire
   - Date du règlement
   - Objet de la dépense
   - Montant HT/TTC
   - SGAMI compétent
   - Coordonnées bancaires
   - Nom de fichier (selon convention de nommage)

5. **Utilisateur** :
   - Nom d'utilisateur et mot de passe
   - Genre/Grade
   - Prénom, Nom
   - Email, Téléphone
   - Rôle (administrateur, rédacteur)
   - Initiales (générées automatiquement)

### API Routes

Le backend expose les endpoints API suivants :

1. **Authentification** :
   - POST `/api/auth/login` - Connexion utilisateur
   - GET `/api/auth/verify` - Vérifier la validité du token
   - POST `/api/auth/init` - Initialiser le premier administrateur

2. **Utilisateurs** :
   - GET `/api/utilisateurs` - Liste des utilisateurs
   - POST `/api/utilisateurs` - Créer un utilisateur
   - PUT `/api/utilisateurs/:id` - Modifier un utilisateur
   - DELETE `/api/utilisateurs/:id` - Supprimer un utilisateur

3. **Avocats** :
   - GET `/api/avocats` - Liste des avocats
   - POST `/api/avocats` - Créer un avocat
   - PUT `/api/avocats/:id` - Modifier un avocat
   - DELETE `/api/avocats/:id` - Supprimer un avocat

4. **Affaires PF** :
   - GET `/api/pfAffaires` - Liste des affaires
   - POST `/api/pfAffaires` - Créer une affaire
   - GET `/api/pfAffaires/:id` - Détails d'une affaire
   - PUT `/api/pfAffaires/:id` - Modifier une affaire
   - DELETE `/api/pfAffaires/:id` - Supprimer une affaire

5. **Bénéficiaires PF** :
   - GET `/api/pfBeneficiaires` - Liste des bénéficiaires
   - POST `/api/pfBeneficiaires` - Créer un bénéficiaire
   - GET `/api/pfBeneficiaires/:id` - Détails d'un bénéficiaire
   - PUT `/api/pfBeneficiaires/:id` - Modifier un bénéficiaire
   - DELETE `/api/pfBeneficiaires/:id` - Supprimer un bénéficiaire

6. **Conventions PF** :
   - GET `/api/pfConventions` - Liste des conventions
   - POST `/api/pfConventions` - Créer une convention
   - GET `/api/pfConventions/:id` - Détails d'une convention
   - PUT `/api/pfConventions/:id` - Modifier une convention
   - DELETE `/api/pfConventions/:id` - Supprimer une convention
   - GET `/api/pfConventions/numero-ordre/:annee` - Récupérer le prochain numéro d'ordre
   - POST `/api/pfConventions/:id/generer` - Générer le document de convention

7. **Règlements PF** :
   - GET `/api/pfReglements` - Liste des règlements
   - POST `/api/pfReglements` - Créer un règlement
   - GET `/api/pfReglements/:id` - Détails d'un règlement
   - PUT `/api/pfReglements/:id` - Modifier un règlement
   - DELETE `/api/pfReglements/:id` - Supprimer un règlement
   - POST `/api/pfReglements/:id/generer` - Générer la fiche de règlement

8. **Paramètres** :
   - GET `/api/pfParametres` - Liste des paramètres
   - PUT `/api/pfParametres/sgamis` - Mettre à jour la liste des SGAMIs
   - PUT `/api/pfParametres/objets-depense` - Mettre à jour la liste des objets de dépense
   - PUT `/api/pfParametres/qualite-destinataires` - Mettre à jour la liste des qualités de destinataires
   - PUT `/api/pfParametres/diligences` - Mettre à jour la liste des diligences
   - PUT `/api/pfParametres/templates` - Mettre à jour les templates
   - GET `/api/pfParametres/templates/original` - Récupérer les templates originaux

9. **Statistiques** :
   - GET `/api/pfStatistiques/annee/:annee` - Statistiques par année
   - GET `/api/pfStatistiques/sgami/:sgami` - Statistiques par SGAMI
   - GET `/api/pfStatistiques/redacteur/:redacteur` - Statistiques par rédacteur

## Interface utilisateur

L'interface utilisateur React est composée des pages principales suivantes :

1. **Login** : Page de connexion à l'application
2. **Affaires** : Liste et gestion des affaires
3. **Conventions** : Liste et gestion des conventions d'honoraires
4. **Règlements** : Liste et gestion des fiches de règlement
5. **Statistiques** : Tableaux de bord et visualisations des données
6. **Paramètres** : Configuration de l'application

## Génération de documents

L'application utilise la bibliothèque Carbone pour générer des documents à partir de templates DOCX :

1. **Convention d'honoraires** : Document généré selon un format avec les conventions de nommage
   ```
   DATE_BRPF_INITIALESREDACTEUR_INSTANCE_NOMS-DES-BENEFICIAIRES-ANNEEAFFAIRE.docx
   ```

2. **Fiche de règlement** : Document généré selon un format avec les conventions de nommage
   ```
   DATE_BRPF_NUMEROORDREFRI-INITIALESREDACTEUR-NOMSMILITAIRES-ANNEEAFFAIRE-SGAMI.docx
   ```

## Authentification

L'application utilise JWT (JSON Web Tokens) pour l'authentification :

1. Les tokens sont générés lors de la connexion et ont une durée de vie de 24 heures
2. Le middleware d'authentification vérifie la validité du token pour chaque requête API protégée
3. Les routes sont protégées selon le rôle de l'utilisateur (administrateur ou rédacteur)

## Développement futur

Tâches à réaliser :

1. Implémenter les modèles de données pour PFAffaire, PFBeneficiaire, PFConvention et PFReglement
2. Développer les routes API correspondantes
3. Créer les pages et composants frontend pour ces entités
4. Mettre en place la génération de documents
5. Implémenter les visualisations statistiques

## Notes importantes

- Cette application est distincte de l'application PJC (Protection Juridique Complémentaire)
- Elle utilise des ports différents (5003 pour l'API, 81 pour l'interface web)
- La base de données MongoDB est configurée sur le port 27018 (différent de l'application PJC)
- Les modèles d'Avocats sont utilisés dans cette application

## Troubleshooting

### Problèmes courants

1. **Erreur de connexion à MongoDB**
   ```
   Vérifiez que MongoDB est en cours d'exécution ou que les informations de connexion dans .env sont correctes
   ```

2. **Problèmes avec LibreOffice**
   ```
   Assurez-vous que LibreOffice est correctement installé et accessible via la ligne de commande (soffice)
   ```

3. **Erreur lors de la génération de documents**
   ```
   Vérifiez les permissions sur les dossiers /templates et /temp
   ```