import React, { useState } from 'react';
import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import { useLinks } from '../../context/LinkContext';

interface AddFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  '#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#14b8a6'
];

const AddFolderModal: React.FC<AddFolderModalProps> = ({ isOpen, onClose }) => {
  const { addFolder } = useLinks();
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    addFolder({ name: name.trim(), color });
    setName('');
    setColor(COLORS[0]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Folder">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Input 
          label="Folder Name"
          placeholder="e.g. Design Inspiration"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Folder Color</label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: c,
                  border: color === c ? '2px solid white' : '2px solid transparent',
                  boxShadow: color === c ? '0 0 0 2px var(--bg-secondary)' : 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
          <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" type="submit" disabled={!name.trim()}>Create Folder</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFolderModal;
