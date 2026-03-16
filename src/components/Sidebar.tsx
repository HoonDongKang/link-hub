import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLinks } from '../context/LinkContext';
import { Folder, Home, Plus, Hash } from 'lucide-react';
import AddFolderModal from './modals/AddFolderModal';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { folders } = useLinks();
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = React.useState(false);

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo flex-center">
          <Hash className="logo-icon text-gradient" size={28} />
          <h2>LinkHub</h2>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <Home size={18} />
            <span>Dashboard</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <div className="nav-section-title flex-between">
            <span>Folders</span>
            <button className="add-folder-btn" title="New Folder" onClick={() => setIsAddFolderModalOpen(true)}>
              <Plus size={16} />
            </button>
          </div>
          <div className="folder-list">
            {folders.map(folder => (
              <NavLink 
                key={folder.id} 
                to={`/folder/${folder.id}`} 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <div className="folder-icon" style={{ backgroundColor: folder.color || 'var(--accent-primary)' }}>
                  <Folder size={14} color="#fff" />
                </div>
                <span className="folder-name">{folder.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">U</div>
          <span>Local User</span>
        </div>
      </div>

      <AddFolderModal 
        isOpen={isAddFolderModalOpen} 
        onClose={() => setIsAddFolderModalOpen(false)} 
      />
    </aside>
  );
};

export default Sidebar;
