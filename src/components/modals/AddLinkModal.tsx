import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import Badge from '../Badge';
import { useLinks } from '../../context/LinkContext';
import type { Link } from '../../types';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string; // Preselect folder if opened from a specific folder view
  linkToEdit?: Link | null; // Pass link if editing
}

const AddLinkModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose, folderId, linkToEdit }) => {
  const { addLink, updateLink, folders } = useLinks();
  
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('unorganized');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      if (linkToEdit) {
        setUrl(linkToEdit.url);
        setTitle(linkToEdit.title);
        setDescription(linkToEdit.description);
        setSelectedFolderId(linkToEdit.folderId || 'unorganized');
        setTags(linkToEdit.tags);
      } else {
        setUrl('');
        setTitle('');
        setDescription('');
        setSelectedFolderId(folderId || 'unorganized');
        setTags([]);
        setTagInput('');
      }
    }
  }, [isOpen, folderId, linkToEdit]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim()) return;

    let fId = selectedFolderId === 'unorganized' ? null : selectedFolderId;

    if (linkToEdit) {
      updateLink(linkToEdit.id, {
        url, title, description, tags, folderId: fId
      });
    } else {
      // Basic auto-fetching logic could go here, but since front-end only, user provides title.
      addLink({
        url,
        title,
        description,
        tags,
        folderId: fId
      });
    }
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={linkToEdit ? "Edit Link" : "Add New Link"}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input 
          label="URL"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        
        <Input 
          label="Title"
          placeholder="A catchy title for this link"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <div className="input-wrapper">
          <label className="input-label">Description (Optional)</label>
          <div className="input-container">
            <textarea 
              className="input-field"
              placeholder="What is this link about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', padding: '10px 0', width: '100%', resize: 'none' }}
            />
          </div>
        </div>

        <div className="input-wrapper">
          <label className="input-label">Folder</label>
          <div className="input-container">
            <select 
              className="input-field"
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
            >
              <option value="unorganized">Unorganized</option>
              {folders.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-wrapper">
          <label className="input-label">Tags (Press Enter or Comma to add)</label>
          <Input 
            placeholder="e.g. react, design"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
          />
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {tags.map(tag => (
                <Badge key={tag} onRemove={() => removeTag(tag)}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" type="submit" disabled={!url.trim() || !title.trim()}>
            {linkToEdit ? "Save Changes" : "Save Link"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddLinkModal;
