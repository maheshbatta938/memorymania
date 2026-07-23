import express from 'express';
import auth from '../middleware/auth.js';
import Folder from '../models/Folder.js';
import Paste from '../models/Paste.js';

const router = express.Router();

// Get all folders of user
router.get('/', auth, async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user._id }).sort({ name: 1 });
    res.send(folders);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Create a new folder
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).send({ message: 'Folder name is required' });
    }

    const folder = new Folder({
      name: name.trim(),
      userId: req.user._id,
    });

    await folder.save();
    res.status(201).send(folder);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({ message: 'Folder name already exists' });
    }
    res.status(400).send({ message: error.message });
  }
});

// Delete a folder (and uncategorize its pastes)
router.delete('/:id', auth, async (req, res) => {
  try {
    const folder = await Folder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!folder) {
      return res.status(404).send({ message: 'Folder not found' });
    }

    // Set folderId to null for all pastes in this folder
    await Paste.updateMany(
      { folderId: folder._id, userId: req.user._id },
      { $set: { folderId: null } }
    );

    res.send({ message: 'Folder deleted and snippets uncategorized successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;
