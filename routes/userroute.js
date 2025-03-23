const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Assurez-vous que le chemin est correct
const bcrypt = require("bcrypt");

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Vérification des champs
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hashage du mot de passe avant de l'enregistrer
        const hashedPassword = await bcrypt.hash(password, 10);  // 10 est le nombre de tours de hachage

        // Créer un nouvel utilisateur
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {    
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Utilisateur non trouvé" });
        }

        // Vérifier le mot de passe avec bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // Réponse en cas de succès
        res.status(200).json({ message: "Connexion réussie", user });
    } catch (error) {
        console.error("❌ Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

router.get('/getallusers', async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclure les mots de passe des résultats
        return res.status(200).json(users);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des utilisateurs :", error);
        return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});


module.exports = router;
