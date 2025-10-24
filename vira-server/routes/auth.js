const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// -- KAYIT OLMA --
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Kullanıcı adı ve şifre gerekli." });
    
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Bu isimde bir kale zaten mevcut." });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    
    res.status(201).json({ message: "Kalen başarıyla inşa edildi.", token: newUser._id, user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Sunucuda bir hata oluştu." });
  }
});

// -- GİRİŞ YAPMA --
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Kullanıcı adı ve şifre gerekli." });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "Bu isimde bir kale bulunamadı." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Yanlış anahtar (şifre)." });

    res.status(200).json({ message: "Kalene hoş geldin.", token: user._id, user: user });
  } catch (error) {
    res.status(500).json({ message: "Sunucuda bir hata oluştu." });
  }
});

// -- KATEGORİLERİ GÜNCELLEME --
router.patch('/users/:userId/categories', async (req, res) => {
    try {
        const { userId } = req.params;
        const { categories } = req.body;
        if (!Array.isArray(categories)) return res.status(400).json({ message: 'Kategoriler geçerli bir liste olmalı.' });
        
        const updatedUser = await User.findByIdAndUpdate(userId, { categories }, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        res.status(200).json(updatedUser.categories);
    } catch (error) {
        res.status(500).json({ message: 'Sunucuda bir hata oluştu.' });
    }
});

// -- DURUM YAZISINI GÜNCELLEME --
router.patch('/users/:userId/status', async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;
        if (typeof status !== 'string') return res.status(400).json({ message: 'Durum yazısı geçerli bir metin olmalı.' });
        
        const updatedUser = await User.findByIdAndUpdate(userId, { status }, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Sunucuda bir hata oluştu.' });
    }
});

// -- KULLANICI ADINI GÜNCELLEME --
router.patch('/users/:userId/username', async (req, res) => {
    try {
        const { userId } = req.params;
        const { currentPassword, newUsername } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: "Mevcut şifren yanlış." });

        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ message: "Bu kullanıcı adı zaten alınmış." });
        }
        user.username = newUsername;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Sunucuda bir hata oluştu." });
    }
});

// -- ŞİFREYİ GÜNCELLEME --
router.patch('/users/:userId/password', async (req, res) => {
    try {
        const { userId } = req.params;
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: "Mevcut şifren yanlış." });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.status(200).json({ message: "Şifren başarıyla güncellendi." });
    } catch (error) {
        res.status(500).json({ message: "Sunucuda bir hata oluştu." });
    }
});

module.exports = router;