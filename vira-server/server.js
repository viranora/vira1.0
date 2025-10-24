// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path')
require('dotenv').config();

// Rotalar
const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journal');
const goalRoutes = require('./routes/goals');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 4000;

// Genel ayarlar
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Vira'nın hafızasına (MongoDB) başarıyla bağlanıldı."))
.catch(err => console.error("❌ Bağlantı hatası:", err));

// Rota eşleşmeleri
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/upload', uploadRoutes); 

// Test endpoint
app.get('/', (req, res) => {
  res.send('🧠 Vira sunucusu çalışıyor!');
});

// Sunucuyu başlat
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 Vira ${PORT} portunda tüm ağlara açık!`);
});