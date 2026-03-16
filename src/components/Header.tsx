import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import Input from './Input';
import Button from './Button';
import AddLinkModal from './modals/AddLinkModal';
import PasswordModal from './modals/PasswordModal';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate('/');
      }
    }
  };

  const handleAddLinkClick = () => {
    if (sessionStorage.getItem('auth_password')) {
      setIsAddLinkModalOpen(true);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  return (
    <header className="header glass-panel">
      <div className="header-left">
        <div className="search-bar">
          <Input 
            placeholder="Search links and press Enter..." 
            icon={<Search size={18} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="search-input-wrapper"
          />
        </div>
      </div>
      <div className="header-right">
        <Button variant="primary" icon={<Plus size={18} />} onClick={handleAddLinkClick}>
          Add Link
        </Button>
      </div>
      
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => setIsAddLinkModalOpen(true)}
      />
      <AddLinkModal 
        isOpen={isAddLinkModalOpen} 
        onClose={() => setIsAddLinkModalOpen(false)} 
      />
    </header>
  );
};

export default Header;

