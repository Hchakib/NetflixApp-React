// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'L’email est requis'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir un email valide']
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
    },
    username: {
        type: String,
        required: [true, 'Le nom d’utilisateur est requis'],
        trim: true,
        minlength: [3, 'Le nom d’utilisateur doit contenir au moins 3 caractères']
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        default: []
    }],
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);