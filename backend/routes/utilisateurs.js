//routes/utilisateurs.js
router.post('/', auth, async (req, res) => {
    // Vérifier que l'utilisateur est administrateur
    if (req.user.role !== 'administrateur') {
      return res.status(403).json({ 
        success: false, 
        message: 'Accès refusé. Seuls les administrateurs peuvent créer des utilisateurs.' 
      });
    }
    
    try {
      const { 
        username, password, genre, prenom, nom, 
        email, telephone, role, initiales 
      } = req.body;
      
      // Vérifier si les champs obligatoires sont présents
      if (!username || !password || !genre || !prenom || !nom || !email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Tous les champs obligatoires doivent être remplis' 
        });
      }
      
      // Vérifier si l'username existe déjà
      const existingUser = await Utilisateur.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Ce nom d\'utilisateur est déjà utilisé' 
        });
      }
      
      // Vérifier si l'email existe déjà
      const existingEmail = await Utilisateur.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cette adresse email est déjà utilisée' 
        });
      }
      
      // Créer le nouvel utilisateur
      const newUser = new Utilisateur({
        username,
        password,
        genre,
        prenom,
        nom,
        email,
        telephone,
        role: role || 'redacteur', // par défaut redacteur
        initiales: initiales || null, // les initiales seront générées automatiquement si non fournies
        actif: true,
        passwordNeedsHash: false
      });
      
      // Sauvegarder l'utilisateur
      await newUser.save();
      
      // Renvoyer l'utilisateur créé (sans le mot de passe)
      const userWithoutPassword = { ...newUser.toObject() };
      delete userWithoutPassword.password;
      delete userWithoutPassword.passwordNeedsHash;
      
      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        utilisateur: userWithoutPassword
      });
      
    } catch (err) {
      console.error('Erreur lors de la création de l\'utilisateur:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la création de l\'utilisateur',
        error: err.message
      });
    }
  });