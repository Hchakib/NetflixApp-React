// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const authMiddleware = require('../middleware/verifyToken');

router.post('/signUp', authController.signUp);
router.post('/login', authController.login);
router.put('/updatePassword', authMiddleware, authController.updatePassword);
router.delete('/deleteAccount', authMiddleware, authController.deleteAccount);

module.exports = router;