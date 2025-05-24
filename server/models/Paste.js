import mongoose from 'mongoose';

const pasteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

pasteSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Paste = mongoose.model('Paste', pasteSchema);

export default Paste;
