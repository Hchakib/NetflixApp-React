// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware pour le parsing JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion MongoDB:', err));

// Routes
const authRouter = require('./routes/authRoutes');
app.use('/auth', authRouter);

const videoRouter = require('./routes/videoRoutes');
app.use('/videos', videoRouter); // Changé de /videoRouter à /videos

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});