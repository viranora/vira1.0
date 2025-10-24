const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const router = express.Router();

// Yüklenen dosyaların nereye ve nasıl kaydedileceğini belirle
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {

    cb(null, `${req.params.userId}-${Date.now()}.${file.mimetype.split('/')[1]}`);
  }
});

const upload = multer({ storage: storage });

// Profil fotoğrafı yükleme rotası
router.post('/profile-picture/:userId', upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Lütfen bir dosya seçin.' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { profileImageUrl: imageUrl },
      { new: true }
    );

    res.status(200).json(updatedUser);

  } catch (error) {
    console.error("Profil fotoğrafı yüklenirken hata:", error);
    res.status(500).json({ message: 'Sunucuda bir hata oluştu.' });
  }
});

module.exports = router;