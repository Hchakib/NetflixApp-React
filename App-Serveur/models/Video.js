const mongoose = require("mongoose");

// Fonction pour extraire l'ID de la vidéo YouTube à partir de l'URL
function getYouTubeVideoId(url) {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Le titre est requis"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  url: {
    type: String,
    required: [true, "L’URL de la vidéo est requise"],
    trim: true,
    match: [
      /^https?:\/\/(www\.youtube\.com|youtu\.be)\/.+$/,
      "Veuillez fournir un lien YouTube valide",
    ],
  },
  thumbnail: {
    type: String,
    trim: true,
    default: "",
  },
  category: {
    type: String,
    enum: ["Film", "Série", "Documentaire", "Animation", "Autre"],
    default: "Autre",
  },
  tags: [
    {
      type: String,
      trim: true,
      default: [],
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "L’auteur est requis"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware pre-save pour définir la miniature YouTube par défaut si aucune n'est fournie
videoSchema.pre("save", function (next) {
  if (!this.thumbnail && this.url) {
    const videoId = getYouTubeVideoId(this.url);
    if (videoId) {
      this.thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }
  next();
});

module.exports = mongoose.model("Video", videoSchema);
