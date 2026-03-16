import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Link, Folder } from '../types';
import { fetchData, saveData } from '../services/api';

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

export const LinkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchData();
      if (data) {
        setLinks(data.links || []);
        setFolders(data.folders || []);
      }
      setIsLoaded(true);
    };
    loadData();
  }, []);

  const updateAndSave = (newLinks: Link[], newFolders: Folder[]) => {
    setLinks(newLinks);
    setFolders(newFolders);
    if (isLoaded) {
      saveData({ links: newLinks, folders: newFolders });
    }
  };

  const addLink = (linkData: Omit<Link, 'id' | 'createdAt'>) => {
    const newLink: Link = {
      ...linkData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    updateAndSave([newLink, ...links], folders);
  };

  const updateLink = (id: string, updatedFields: Partial<Link>) => {
    const newLinks = links.map(l => l.id === id ? { ...l, ...updatedFields } : l);
    updateAndSave(newLinks, folders);
  };

  const deleteLink = (id: string) => {
    const newLinks = links.filter(l => l.id !== id);
    updateAndSave(newLinks, folders);
  };

  const addFolder = (folderData: Omit<Folder, 'id' | 'createdAt'>) => {
    const newFolder: Folder = {
      ...folderData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    updateAndSave(links, [newFolder, ...folders]);
  };

  const updateFolder = (id: string, updatedFields: Partial<Folder>) => {
    const newFolders = folders.map(f => f.id === id ? { ...f, ...updatedFields } : f);
    updateAndSave(links, newFolders);
  };

  const deleteFolder = (id: string) => {
    const newFolders = folders.filter(f => f.id !== id);
    // Also move links out of this folder to root
    const newLinks = links.map(l => l.folderId === id ? { ...l, folderId: null } : l);
    updateAndSave(newLinks, newFolders);
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

  // Prevent flashing empty state before data loads, could also return a loading spinner here
  if (!isLoaded) {
    return null; // or <div className="loading-screen">Loading your links...</div>
  }

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
