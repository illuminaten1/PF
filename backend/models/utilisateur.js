const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UtilisateurSchema = new mongoose.Schema({
  // Informations d'authentification
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  
  // Informations personnelles
  genre: {
    type: String,
    enum: [
      'Madame', 'Monsieur', 
      'Général', 'Colonel', 'Lieutenant-colonel', 'Chef d\'escadron', 
      'Commandant', 'Capitaine', 'Lieutenant', 'Sous-lieutenant', 
      'Aspirant', 'Major', 'Adjudant-chef', 'Adjudant', 
      'Maréchal des logis-chef', 'Gendarme', 'Elève-Gendarme', 
      'Maréchal des logis', 'Brigadier-chef', 'Brigadier', 
      'Gendarme adjoint volontaire', 'Gendarme adjoint de 2ème classe'
    ],
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  nom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  telephone: {
    type: String
  },
  
  // Informations pour le système
  role: {
    type: String,
    enum: ['administrateur', 'redacteur'],
    default: 'redacteur'
  },
  initiales: {
    type: String,
    required: true,
    maxlength: 3  // Limiter à 3 caractères maximum
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dernierLogin: {
    type: Date
  },
  actif: {
    type: Boolean,
    default: true
  },
  passwordNeedsHash: {
    type: Boolean,
    default: false
  }
});

// Générer automatiquement les initiales à partir du prénom et du nom
UtilisateurSchema.pre('validate', function(next) {
  if (!this.initiales && this.prenom && this.nom) {
    // Prendre la première lettre du prénom et la première lettre du nom
    const prenomInitiale = this.prenom.charAt(0).toUpperCase();
    const nomInitiale = this.nom.charAt(0).toUpperCase();
    
    // Générer les initiales (2 lettres)
    this.initiales = prenomInitiale + nomInitiale;
    
    // Si le nom de famille a plusieurs parties (ex: "Le Grand"), prendre la première lettre de chaque partie
    if (this.nom.includes(' ')) {
      const nomParts = this.nom.split(' ');
      if (nomParts.length > 1 && nomParts[1].length > 0) {
        this.initiales += nomParts[1].charAt(0).toUpperCase();
      }
    }
  }
  next();
});

// Méthode pour comparer les mots de passe
UtilisateurSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Middleware pour hasher le mot de passe avant la sauvegarde
UtilisateurSchema.pre('save', async function(next) {
  // Seulement hasher le mot de passe s'il a été modifié ou est nouveau
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    if (this.passwordNeedsHash) this.passwordNeedsHash = false;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Utilisateur', UtilisateurSchema);