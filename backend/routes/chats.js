const express = require('express');
const Chat = require('../models/Chat');
const { nanoid } = require('nanoid');
const scrapeChatContent = require('../utils/scrapeChat');

const router = express.Router();

// Create a new chat
router.post('/', async (req, res) => {
  const { link } = req.body;

  if (!link) {
    return res.status(400).json({ error: 'Link is required' });
  }
  // ✅ Check if this link already exists
  const existing = await Chat.findOne({ link });
  if (existing) {
    return res.status(409).json({ error: 'This link has already been posted' });
  }
  const slug = nanoid(6);

  // scrape the chat content from the link
  const scrapedContent = await scrapeChatContent(link);

  const chat = new Chat({
    slug,
    link,
    content: scrapedContent,
  });

  await chat.save();

  res.status(201).json(chat);
});

// Get all chats
router.get('/', async (req, res) => {
  const chats = await Chat.find().sort({ createdAt: -1 });
  res.json(chats);
});

// Get one chat by slug
router.get('/:slug', async (req, res) => {
  const chat = await Chat.findOne({ slug: req.params.slug });
  if (!chat) return res.status(404).json({ error: 'Not found' });
  res.json(chat);
});

module.exports = router;
