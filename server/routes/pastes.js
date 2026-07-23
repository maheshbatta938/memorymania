import express from 'express';
import auth from '../middleware/auth.js';
import authApiKey from '../middleware/authApiKey.js';
import Paste from '../models/Paste.js';

const router = express.Router();

// Get analytics overview (requires auth)
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const pastes = await Paste.find({ userId: req.user._id });
    
    const totalPastes = pastes.length;
    const totalViews = pastes.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
    
    // Calculate language distribution
    const languageCounts = {};
    pastes.forEach(p => {
      const lang = p.language || 'plaintext';
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
    });
    const languageData = Object.keys(languageCounts).map(name => ({
      name,
      value: languageCounts[name]
    }));
    
    // Calculate creation history (last 7 days)
    const historyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const count = pastes.filter(p => {
        const pDate = new Date(p.createdAt);
        return pDate.toDateString() === date.toDateString();
      }).length;
      
      historyData.push({
        date: dateString,
        count
      });
    }
    
    res.send({
      totalPastes,
      totalViews,
      languageData,
      historyData
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Access a public paste by ID (no auth required)
router.get('/public/:id', async (req, res) => {
  try {
    const paste = await Paste.findById(req.params.id);
    
    if (!paste) {
      return res.status(404).send({ message: 'Paste not found' });
    }
    
    if (!paste.isPublic) {
      return res.status(403).send({ message: 'Access denied (private paste)' });
    }
    
    // Check if expired
    if (paste.expiresAt && new Date(paste.expiresAt) < new Date()) {
      await Paste.findByIdAndDelete(paste._id);
      return res.status(404).send({ message: 'Paste expired' });
    }
    
    // Update view count
    paste.viewCount = (paste.viewCount || 0) + 1;
    await paste.save();
    
    // If burn after read, delete immediately after serving
    if (paste.burnAfterRead) {
      await Paste.findByIdAndDelete(paste._id);
    }
    
    res.send(paste);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const paste = new Paste({
      ...req.body,
      userId: req.user._id,
    });
    
    await paste.save();
    res.status(201).send(paste);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const pastes = await Paste.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.send(pastes);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get('/search', auth, async (req, res) => {
  try {
    const query = req.query.q;
    
    if (!query) {
      return res.status(400).send({ message: 'Search query is required' });
    }
    
    const pastes = await Paste.find({
      $and: [
        { userId: req.user._id },
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } },
          ],
        },
      ],
    }).sort({ createdAt: -1 });
    
    res.send(pastes);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const paste = await Paste.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!paste) {
      return res.status(404).send({ message: 'Paste not found' });
    }
    
    res.send(paste);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'content', 'tags', 'language', 'isPublic', 'expiresAt', 'burnAfterRead', 'isEncrypted'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  
  if (!isValidOperation) {
    return res.status(400).send({ message: 'Invalid updates' });
  }
  
  try {
    const paste = await Paste.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!paste) {
      return res.status(404).send({ message: 'Paste not found' });
    }
    
    updates.forEach((update) => (paste[update] = req.body[update]));
    await paste.save();
    
    res.send(paste);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const paste = await Paste.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!paste) {
      return res.status(404).send({ message: 'Paste not found' });
    }
    
    res.send({ message: 'Paste deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Toggle star status of a paste
router.put('/:id/star', auth, async (req, res) => {
  try {
    const paste = await Paste.findOne({ _id: req.params.id, userId: req.user._id });
    if (!paste) {
      return res.status(404).send({ message: 'Paste not found' });
    }
    
    paste.isStarred = !paste.isStarred;
    await paste.save();
    res.send(paste);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Create paste via developer API Key (programmatic access)
router.post('/api', authApiKey, async (req, res) => {
  try {
    const { title, content, tags, language } = req.body;
    if (!title || !content) {
      return res.status(400).send({ message: 'Title and content are required' });
    }
    
    const paste = new Paste({
      title: title.trim(),
      content,
      tags: tags || [],
      language: language || 'plaintext',
      userId: req.user._id,
      isPublic: true, // Default programmatically created notes as public for ease of share
    });
    
    await paste.save();
    res.status(201).send(paste);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
