const Video = require("../models/Video");
const User = require("../models/User");

exports.createVideo = async (req, res) => {
  try {
    const { title, description, url, thumbnail, category, tags } = req.body;
    if (!title || !url) {
      return res.status(400).json({ error: "Titre et URL requis" });
    }
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      return res.status(400).json({ error: "L’URL doit être un lien YouTube" });
    }

    const video = new Video({
      title,
      description: description || "",
      url,
      thumbnail: thumbnail || "", // Accepte une miniature personnalisée
      category: category || "Autre",
      tags: tags || [],
      createdBy: req.userData.id,
    });

    await video.save();
    res.status(201).json({ message: "Vidéo ajoutée avec succès", video });
  } catch (err) {
    res.status(400).json({ error: "Échec de l’ajout de la vidéo" });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, url, thumbnail, category, tags } = req.body;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ error: "Vidéo non trouvée" });
    }

    if (title && title.trim() === "") {
      return res.status(400).json({ error: "Le titre ne peut pas être vide" });
    }
    if (url && !url.includes("youtube.com") && !url.includes("youtu.be")) {
      return res.status(400).json({ error: "L’URL doit être un lien YouTube" });
    }

    video.title = title || video.title;
    video.description =
      description !== undefined ? description : video.description;
    video.url = url || video.url;
    video.thumbnail = thumbnail !== undefined ? thumbnail : video.thumbnail; // Accepte une miniature personnalisée
    video.category = category || video.category;
    video.tags = tags || video.tags;

    await video.save();
    res.json({ message: "Vidéo mise à jour avec succès", video });
  } catch (err) {
    res.status(400).json({ error: "Échec de la mise à jour de la vidéo" });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return res.status(404).json({ error: "Vidéo non trouvée" });
    }

    await User.updateMany({ favorites: id }, { $pull: { favorites: id } });

    res.json({ message: "Vidéo supprimée avec succès" });
  } catch (err) {
    res.status(400).json({ error: "Échec de la suppression de la vidéo" });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate("createdBy", "username");
    res.json(videos);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des vidéos" });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { videoId } = req.body;
    if (!videoId) {
      return res.status(400).json({ error: "ID de la vidéo requis" });
    }

    const user = await User.findById(req.userData.id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    if (!user.favorites.includes(videoId)) {
      user.favorites.push(videoId);
      await user.save();
    }

    res.json({
      message: "Vidéo ajoutée aux favoris",
      favorites: user.favorites,
    });
  } catch (err) {
    res.status(400).json({ error: "Échec de l’ajout aux favoris" });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { videoId } = req.body;
    if (!videoId) {
      return res.status(400).json({ error: "ID de la vidéo requis" });
    }

    const user = await User.findById(req.userData.id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    user.favorites = user.favorites.filter((id) => id.toString() !== videoId);
    await user.save();

    res.json({
      message: "Vidéo retirée des favoris",
      favorites: user.favorites,
    });
  } catch (err) {
    res.status(400).json({ error: "Échec de la suppression des favoris" });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userData.id).populate("favorites");
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.json({ favorites: user.favorites });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des favoris" });
  }
};
