const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  link: { type: String, required: true },
  content: [
    {
      role: String,
      message: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Chat', chatSchema);
