import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaste } from '../context/PasteContext';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import { Save, X, Tag } from 'lucide-react';

const PasteForm = ({ isEditing = false, pasteId = '' }) => {
  const navigate = useNavigate();
  const { createPaste, updatePaste, currentPaste } = usePaste();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && currentPaste) {
      setFormData({
        title: currentPaste.title,
        content: currentPaste.content,
        tags: currentPaste.tags || [],
      });
    }
  }, [isEditing, currentPaste]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing) {
        await updatePaste(pasteId, formData);
      } else {
        await createPaste(formData);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save paste:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Enter a title for your paste"
        fullWidth
      />

      <Textarea
        label="Content"
        name="content"
        value={formData.content}
        onChange={handleChange}
        error={errors.content}
        placeholder="Enter your paste content here..."
        rows={10}
        fullWidth
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 focus:outline-none"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddTag}
            disabled={!tagInput.trim()}
          >
            <Tag size={16} className="mr-1" />
            Add Tag
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate('/dashboard')}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          <Save size={16} className="mr-1" />
          {isEditing ? 'Update' : 'Save'} Paste
        </Button>
      </div>
    </form>
  );
};

export default PasteForm; 