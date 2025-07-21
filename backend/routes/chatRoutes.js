const express = require('express');
const Chat = require('../models/ChatSchema');
const { nanoid } = require('nanoid');
const scrapeChatContent = require('../utils/scrapeClassifier'); 
const { clerkClient } = require('@clerk/clerk-sdk-node');

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
  const { content: scrapedContent, service, category } = await scrapeChatContent(link);

  const chat = new Chat({
    slug,
    link,
    userId: req.userId,
    service,                // <== here
    category,
    content: scrapedContent,
  });


  await chat.save();

  res.status(201).json(chat);
});


// Get all chats
router.get('/allchats', async (req, res) => {
  const chats = await Chat.find().sort({ createdAt: -1 });
  const enriched = await Promise.all(chats.map(async (chat) => {
    let username = '';
    try {
      const user = await clerkClient.users.getUser(chat.userId);
      username = user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim();
    } catch (err) {
      console.error('Error fetching user', err);
    }
    return { ...chat.toObject(), username };
  }));
  res.json(enriched);
});

// Get my chats
router.get('/my-chats', async (req, res) => {
  const chats = await Chat.find({ userId: req.userId }).sort({ createdAt: -1 });
  const enriched = await Promise.all(chats.map(async (chat) => {
    let username = '';
    try {
      const user = await clerkClient.users.getUser(chat.userId);
      username = user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim();
    } catch (err) {
      console.error('Error fetching user', err);
    }
    return { ...chat.toObject(), username };
  }));
  res.json(enriched);
});

// Delete one chat by slug (only owner can delete)
router.delete('/:slug', async (req, res) => {
  const chat = await Chat.findOne({ slug: req.params.slug });
  if (!chat) {
    return res.status(404).json({ error: 'Chat not found' });
  }
  if (chat.userId !== req.userId) {
    return res.status(403).json({ error: 'Not authorized to delete this chat' });
  }
  await Chat.deleteOne({ slug: req.params.slug });
  res.json({ message: 'Chat deleted successfully', slug: req.params.slug });
});

// Get one chat by slug
router.get('/:slug', async (req, res) => {
  const chat = await Chat.findOne({ slug: req.params.slug });
  if (!chat) return res.status(404).json({ error: 'Not found' });
  res.json(chat);
});

module.exports = router;
