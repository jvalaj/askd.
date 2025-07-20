const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const chatsRouter = require('./routes/chats');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/chats', chatsRouter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
  })
  .catch(err => console.error(err));
