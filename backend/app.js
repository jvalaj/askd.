const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authMiddleware = require('./middlewares/auth');
const chatsRouter = require('./routes/chatRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('🌟 Welcome to chats.com API — home page');
});

app.use('/api/chats', authMiddleware, chatsRouter);

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    //app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(console.error);