// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Configuration Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du frontend en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Routes API (à décommenter quand vous aurez créé ces fichiers)
// app.use('/api/pfAffaires', require('./routes/pfAffaires'));
// app.use('/api/pfBeneficiaires', require('./routes/pfBeneficiaires'));
// app.use('/api/pfConventions', require('./routes/pfConventions'));
// app.use('/api/pfReglements', require('./routes/pfReglements'));
// app.use('/api/parametres', require('./routes/parametres'));
// app.use('/api/avocats', require('./routes/avocats'));
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/utilisateurs', require('./routes/utilisateurs'));
// app.use('/api/documents', require('./routes/documents'));
// app.use('/api/statistiques', require('./routes/statistiques'));

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Une erreur est survenue',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27018/protection-fonctionnelle', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB établie'))
.catch(err => console.error('Erreur de connexion à MongoDB', err));

// Route "catchall" pour SPA React en production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Vérifier les permissions des dossiers au démarrage
const checkDirectoryPermissions = () => {
  const dirs = ['templates', 'temp'];
  
  dirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(dirPath)) {
      try {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Dossier ${dir} créé avec succès`);
      } catch (err) {
        console.error(`❌ Erreur lors de la création du dossier ${dir}:`, err);
      }
    }
    
    // Vérifier les permissions d'écriture
    try {
      const testFile = path.join(dirPath, '.permissions-test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      console.log(`✅ Permissions d'écriture valides pour le dossier ${dir}`);
    } catch (err) {
      console.error(`❌ ERREUR: Pas de permissions d'écriture pour le dossier ${dir}. Carbone ne fonctionnera pas correctement.`, err);
    }
  });
};

// Exécuter la vérification au démarrage
checkDirectoryPermissions();

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

module.exports = app;
