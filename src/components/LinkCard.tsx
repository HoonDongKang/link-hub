import React from 'react';
import { ExternalLink, Tag, Clock, Trash2, Edit2, Folder as FolderIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Link } from '../types';
import Badge from './Badge';
import { useLinks } from '../context/LinkContext';
import './LinkCard.css';

interface LinkCardProps {
  link: Link;
  onEdit?: (link: Link) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onEdit }) => {
  const { folders, deleteLink } = useLinks();
  const navigate = useNavigate();
  
  const folder = link.folderId ? folders.find(f => f.id === link.folderId) : null;
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="link-card glass-panel">
      <div className="link-card-header">
        <div className="link-title-group">
          <h3>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-title">
              {link.title}
              <ExternalLink size={14} className="external-icon" />
            </a>
          </h3>
          <span className="link-url">{new URL(link.url).hostname}</span>
        </div>
        <div className="link-actions">
          {onEdit && (
            <button className="icon-btn edit-btn" onClick={() => onEdit(link)} title="Edit Link">
              <Edit2 size={16} />
            </button>
          )}
          <button className="icon-btn delete-btn" onClick={() => deleteLink(link.id)} title="Delete Link">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {link.description && (
        <p className="link-description">{link.description}</p>
      )}
      
      <div className="link-card-footer">
        <div className="link-tags">
          {link.tags.map(tag => (
            <div 
              key={tag} 
              onClick={(e) => {
                e.preventDefault();
                navigate(`/?tag=${encodeURIComponent(tag)}`);
              }}
              style={{ cursor: 'pointer' }}
            >
              <Badge color="var(--accent-primary)">
                <Tag size={10} /> {tag}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="link-meta">
          {folder && (
            <div className="link-folder" style={{ color: folder.color || 'var(--text-secondary)' }}>
              <FolderIcon size={14} />
              <span>{folder.name}</span>
            </div>
          )}
          <div className="link-date">
            <Clock size={14} />
            <span>{formatDate(link.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;
