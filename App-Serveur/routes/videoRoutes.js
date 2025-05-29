// backend/routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/verifyToken');
const checkAdmin = require('../middleware/checkAdmin');
const videoController = require('../Controllers/videoController');

router.post('/', authMiddleware, checkAdmin, videoController.createVideo);
router.put('/:id', authMiddleware, checkAdmin, videoController.updateVideo);
router.delete('/:id', authMiddleware, checkAdmin, videoController.deleteVideo);
router.get('/', videoController.getAllVideos);
router.post('/favorite/add', authMiddleware, videoController.addFavorite);
router.post('/favorite/remove', authMiddleware, videoController.removeFavorite);
router.get('/favorites', authMiddleware, videoController.getFavorites);

module.exports = router;