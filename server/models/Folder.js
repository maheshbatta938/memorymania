import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
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

// A user can't create duplicate folder names, but different users can have the same folder name
folderSchema.index({ name: 1, userId: 1 }, { unique: true });

const Folder = mongoose.model('Folder', folderSchema);

export default Folder;
