const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  categories: { type: [String], default: ['Okul', 'İş'] },
  status: { type: String, default: 'Buraya durumunuzu girin' },
  profileImageUrl: { type: String, default: '' } 
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);