const express = require('express');
const Goal = require('../models/Goal');
const router = express.Router();

// Yeni hedef ekle
router.post('/add', async (req, res) => {
  try {
    const newGoal = new Goal(req.body);
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    console.error("Hedef ekleme hatası:", error);
    res.status(500).json({ message: "Hedef eklenemedi." });
  }
});

// Kullanıcının hedeflerini getir
router.get('/:userId', async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.params.userId });
    res.status(200).json(goals);
  } catch (error) {
    console.error("Hedefleri getirme hatası:", error);
    res.status(500).json({ message: "Hedefler getirilemedi." });
  }
});

// Hedef güncelle
router.patch('/update/:goalId', async (req, res) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.goalId, req.body, { new: true });
    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error("Hedef güncelleme hatası:", error);
    res.status(500).json({ message: "Hedef güncellenemedi." });
  }
});

// Hedef sil
router.delete('/delete/:goalId', async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.goalId);
    res.status(200).json({ message: "Hedef silindi." });
  } catch (error) {
    console.error("Hedef silme hatası:", error);
    res.status(500).json({ message: "Hedef silinemedi." });
  }
});

module.exports = router;
