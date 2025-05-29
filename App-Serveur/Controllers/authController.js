// backend/Controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

exports.signUp = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ error: 'Email, mot de passe et nom d’utilisateur requis' });
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ error: 'Email invalide' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
        }
        if (username.trim().length < 3) {
            return res.status(400).json({ error: 'Le nom d’utilisateur doit contenir au moins 3 caractères' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashedPassword,
            username,
            favorites: [],
            isAdmin: false
        });

        await user.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Échec de la création de l’utilisateur' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Utilisateur non trouvé' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Mot de passe incorrect' });
        }

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.json({ token, username: user.username, isAdmin: user.isAdmin });
    } catch (err) {
        res.status(400).json({ error: 'Échec de la connexion' });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Mot de passe actuel et nouveau requis' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
        }

        const user = await User.findById(req.userData.id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Mot de passe requis' });
        }

        const user = await User.findById(req.userData.id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Mot de passe incorrect' });
        }

        await User.findByIdAndDelete(req.userData.id);
        res.status(200).json({ message: 'Compte supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression du compte' });
    }
};