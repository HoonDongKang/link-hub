import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLinks } from '../context/LinkContext';
import LinkCard from '../components/LinkCard';
import Button from '../components/Button';
import AddLinkModal from '../components/modals/AddLinkModal';
import { Trash2 } from 'lucide-react';

const FolderView: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const { folders, links, deleteFolder } = useLinks();
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);

  const folder = folders.find(f => f.id === folderId);
  const folderLinks = links.filter(l => l.folderId === folderId).sort((a, b) => b.createdAt - a.createdAt);

  if (!folder) {
    return <div className="animate-fade-in" style={{ padding: '40px' }}>Folder not found.</div>;
  }

  const handleDeleteFolder = () => {
    if (folderId && window.confirm('Are you sure you want to delete this folder? Links inside will be moved to unorganized.')) {
      deleteFolder(folderId);
      navigate('/');
    }
  };

  return (
    <div className="folder-view animate-fade-in">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div className="folder-icon" style={{ backgroundColor: folder.color, width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white' }}>📁</span>
            </div>
            <h1 className="text-gradient" style={{ margin: 0, fontSize: '2.5rem' }}>{folder.name}</h1>
          </div>
          <p className="text-secondary">{folderLinks.length} items saved in this folder</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="danger" icon={<Trash2 size={16} />} onClick={handleDeleteFolder}>Delete</Button>
          <Button variant="primary" onClick={() => setIsAddLinkModalOpen(true)}>Add Link Here</Button>
        </div>
      </header>
      
      {folderLinks.length > 0 ? (
        <div className="links-grid" style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginTop: '40px' 
        }}>
          {folderLinks.map(link => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      ) : (
        <div className="empty-state glass-panel flex-center" style={{ padding: '60px', flexDirection: 'column', gap: '16px', borderRadius: '16px', textAlign: 'center', marginTop: '40px' }}>
          <h3>It's empty here</h3>
          <p className="text-muted">Save your first link in this folder.</p>
          <Button variant="secondary" onClick={() => setIsAddLinkModalOpen(true)}>Add Link</Button>
        </div>
      )}

      <AddLinkModal 
        isOpen={isAddLinkModalOpen}
        onClose={() => setIsAddLinkModalOpen(false)}
        folderId={folder.id}
      />
    </div>
  );
};

export default FolderView;
