const express = require('express');
const Journal = require('../models/Journal');
const router = express.Router();

// Yeni Günlük Yazısı Ekleme
router.post('/add', async (req, res) => {
  try {
    const { userId, content } = req.body;
    if (!userId || !content) {
      return res.status(400).json({ message: "Kullanıcı ID'si ve içerik gerekli." });
    }
    const newEntry = new Journal({ userId, content });
    await newEntry.save();
    res.status(201).json({ message: "Günlüğe kaydedildi.", entry: newEntry });
  } catch (error) {
    res.status(500).json({ message: "Kaydederken bir hata oluştu." });
  }
});

// Bir Kullanıcının Tüm Günlük Yazılarını Getirme
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const entries = await Journal.find({ userId }).sort({ date: -1 }); 
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Yazılar getirilirken bir hata oluştu." });
  }
});

// Bir Günlük Yazısını Silme
router.delete('/delete/:entryId', async (req, res) => {
    try {
        const { entryId } = req.params;
        await Journal.findByIdAndDelete(entryId);
        res.status(200).json({ message: "Yazı silindi." });
    } catch (error) {
        res.status(500).json({ message: "Yazı silinirken bir hata oluştu." });
    }
});

module.exports = router;