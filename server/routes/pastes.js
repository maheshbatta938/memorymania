import express from 'express';
import auth from '../middleware/auth.js';
import Paste from '../models/Paste.js';

const router = express.Router();

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
  const allowedUpdates = ['title', 'content', 'tags'];
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

export default router;
