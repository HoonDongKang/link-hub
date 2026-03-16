import React, { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Link, Folder } from '../types';

interface LinkContextType {
  links: Link[];
  folders: Folder[];
  addLink: (link: Omit<Link, 'id' | 'createdAt'>) => void;
  updateLink: (id: string, updatedFields: Partial<Link>) => void;
  deleteLink: (id: string) => void;
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt'>) => void;
  updateFolder: (id: string, updatedFields: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  searchLinks: (query: string, tag?: string) => Link[];
}

const LinkContext = createContext<LinkContextType | undefined>(undefined);

// Initial dummy data for better UX on first load
const initialFolders: Folder[] = [
  { id: 'f1', name: 'Design Inspiration', color: '#ec4899', createdAt: Date.now() },
  { id: 'f2', name: 'Dev Tools', color: '#6366f1', createdAt: Date.now() - 100000 },
];

const initialLinks: Link[] = [
  {
    id: 'l1',
    title: 'React Documentation',
    url: 'https://react.dev',
    description: 'The official React documentation.',
    tags: ['react', 'frontend'],
    folderId: 'f2',
    createdAt: Date.now(),
  },
  {
    id: 'l2',
    title: 'Dribbble',
    url: 'https://dribbble.com',
    description: 'Discover the world’s top designers & creatives.',
    tags: ['design', 'inspiration'],
    folderId: 'f1',
    createdAt: Date.now() - 50000,
  }
];

export const LinkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [links, setLinks] = useLocalStorage<Link[]>('linkhub_links', initialLinks);
  const [folders, setFolders] = useLocalStorage<Folder[]>('linkhub_folders', initialFolders);

  const addLink = (linkData: Omit<Link, 'id' | 'createdAt'>) => {
    const newLink: Link = {
      ...linkData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setLinks([newLink, ...links]);
  };

  const updateLink = (id: string, updatedFields: Partial<Link>) => {
    setLinks(links.map(l => l.id === id ? { ...l, ...updatedFields } : l));
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const addFolder = (folderData: Omit<Folder, 'id' | 'createdAt'>) => {
    const newFolder: Folder = {
      ...folderData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setFolders([newFolder, ...folders]);
  };

  const updateFolder = (id: string, updatedFields: Partial<Folder>) => {
    setFolders(folders.map(f => f.id === id ? { ...f, ...updatedFields } : f));
  };

  const deleteFolder = (id: string) => {
    setFolders(folders.filter(f => f.id !== id));
    // Also move links out of this folder to root
    setLinks(links.map(l => l.folderId === id ? { ...l, folderId: null } : l));
  };

  const searchLinks = (query: string, tag?: string) => {
    return links.filter(link => {
      const matchQuery = query === '' || 
        link.title.toLowerCase().includes(query.toLowerCase()) || 
        link.description.toLowerCase().includes(query.toLowerCase()) ||
        link.url.toLowerCase().includes(query.toLowerCase());
        
      const matchTag = !tag || link.tags.includes(tag);
      
      return matchQuery && matchTag;
    });
  };

  return (
    <LinkContext.Provider value={{
      links, folders, addLink, updateLink, deleteLink, addFolder, updateFolder, deleteFolder, searchLinks
    }}>
      {children}
    </LinkContext.Provider>
  );
};

export const useLinks = () => {
  const context = useContext(LinkContext);
  if (context === undefined) {
    throw new Error('useLinks must be used within a LinkProvider');
  }
  return context;
};
