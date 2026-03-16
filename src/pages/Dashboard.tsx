import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLinks } from '../context/LinkContext';
import LinkCard from '../components/LinkCard';
import { Bookmark, Folder, Search } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { links, folders, searchLinks } = useLinks();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q') || '';
  const tagFilter = searchParams.get('tag') || undefined;

  const isSearchMode = query !== '' || tagFilter !== undefined;
  
  // If in search mode, use searchLinks, otherwise show recent
  const displayLinks = isSearchMode 
    ? searchLinks(query, tagFilter)
    : [...links].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="dashboard animate-fade-in">
      <header className="page-header" style={{ marginBottom: '40px' }}>
        <h1 className="text-gradient">Dashboard</h1>
        <p className="text-secondary">Welcome back! Here's an overview of your links.</p>
      </header>

      {isSearchMode ? (
        <>
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>
              {query && tagFilter 
                ? `Search results for "${query}" in tag #${tagFilter}` 
                : query 
                  ? `Search results for "${query}"` 
                  : `Links with tag #${tagFilter}`
              }
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '12px', fontWeight: 'normal' }}>
                ({displayLinks.length} found)
              </span>
            </h2>
            <button onClick={clearFilters} style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', cursor: 'pointer' }}>
              Clear Filters
            </button>
          </div>
          
          {displayLinks.length > 0 ? (
            <div className="links-grid" style={{ 
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' 
            }}>
              {displayLinks.map(link => (
                <LinkCard key={link.id} link={link} />
              ))}
            </div>
          ) : (
            <div className="empty-state glass-panel flex-center" style={{ padding: '60px', flexDirection: 'column', gap: '16px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '50%', color: 'var(--text-muted)' }}>
                <Search size={32} />
              </div>
              <h3>No match found</h3>
              <p className="text-muted">Try adjusting your search query or filters.</p>
              <button onClick={clearFilters} className="btn btn-secondary btn-md mt-4">Clear Filters</button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="stats-grid grid-overview" style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' 
          }}>
            <div className="stat-card glass-panel flex-center" style={{ flexDirection: 'column', padding: '24px', borderRadius: '16px' }}>
              <div className="icon-wrapper" style={{ padding: '16px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', marginBottom: '16px' }}>
                <Bookmark size={24} />
              </div>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>{links.length}</h2>
              <span className="text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>Total Links</span>
            </div>
            
            <div className="stat-card glass-panel flex-center" style={{ flexDirection: 'column', padding: '24px', borderRadius: '16px' }}>
              <div className="icon-wrapper" style={{ padding: '16px', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--accent-secondary)', marginBottom: '16px' }}>
                <Folder size={24} />
              </div>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>{folders.length}</h2>
              <span className="text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>Folders</span>
            </div>
          </div>
          
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Recently Added</h2>
          </div>

          {displayLinks.length > 0 ? (
            <div className="links-grid" style={{ 
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' 
            }}>
              {displayLinks.map(link => (
                <LinkCard key={link.id} link={link} />
              ))}
            </div>
          ) : (
            <div className="empty-state glass-panel flex-center" style={{ padding: '60px', flexDirection: 'column', gap: '16px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '50%', color: 'var(--text-muted)' }}>
                <Bookmark size={32} />
              </div>
              <h3>No links found</h3>
              <p className="text-muted">You haven't added any links yet. Click "Add Link" to get started.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
