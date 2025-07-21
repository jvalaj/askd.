const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  link: { type: String, required: true },
  userId: { type: String, required: true },
  service: { 
    type: String, 
    required: true, 
    enum: ['chatgpt', 'grok', 'claude', 'gemini'] 
  },
  category: {
    type: String,
    required: true,
    enum: ['education', 'tech', 'money', 'creative', 'business', 'other'],
    default: 'other'
  },
  content: [
    {
      role: String,
      message: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Chat', chatSchema);
