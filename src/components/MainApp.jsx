import { useState, useEffect } from 'react';
import TabButton from './TabButton';
import UploadTab from './UploadTab';
import DocumentsView from './DocumentsView';
import { documentAPI } from '../utils/api.js';

function MainApp({ config, currentUser, activeTab, setActiveTab, searchQuery, setSearchQuery, viewMode, setViewMode, onLogout, onShowAdmin, message, showMessage }) {
  const [myDocuments, setMyDocuments] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allUsersCount, setAllUsersCount] = useState(0);

  // Fetch documents based on active tab
  useEffect(() => {
    fetchDocuments();
  }, [activeTab]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      if (activeTab === 'shared') {
        const { data } = await documentAPI.getAll();
        setAllDocuments(data);
        // Count unique users
        const uniqueUsers = new Set(data.map(doc => doc.uploadedBy._id));
        setAllUsersCount(uniqueUsers.size);
      } else if (activeTab !== 'upload') {
        const { data } = await documentAPI.getMy();
        setMyDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      showMessage('Failed to load documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const documents = activeTab === 'shared' ? allDocuments : myDocuments;

  let filteredDocs = documents;
  if (activeTab === 'images') {
    filteredDocs = documents.filter(d => d.fileType && d.fileType.includes('image'));
  } else if (activeTab === 'media') {
    filteredDocs = documents.filter(d => d.fileType && (d.fileType.includes('video') || d.fileType.includes('audio')));
  } else if (activeTab === 'starred') {
    filteredDocs = documents.filter(d => d.starred);
  }

  if (searchQuery) {
    filteredDocs = filteredDocs.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  return (
    <div className="page-load" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ background: config.surface_color, borderBottom: `1px solid ${config.text_color}11`, padding: `${config.font_size}px ${config.font_size * 1.5}px`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto', flexWrap: 'wrap', gap: `${config.font_size}px` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: `${config.font_size}px` }}>
            <div className="bounce" style={{ fontSize: `${config.font_size * 2}px`, color: config.primary_action_color }}>
              <i className="fas fa-folder-open"></i>
            </div>
            <div>
              <h1 style={{ fontSize: `${config.font_size * 1.25}px`, fontWeight: 700, color: config.text_color, margin: 0 }}>
                {config.portfolio_title}
              </h1>
              <div style={{ fontSize: `${config.font_size * 0.75}px`, color: config.text_color, opacity: 0.6 }}>
                <i className="fas fa-user" style={{ marginRight: `${config.font_size * 0.25}px` }}></i>
                {currentUser.email}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: `${config.font_size * 0.5}px`, alignItems: 'center' }}>
            {currentUser?.isAdmin && (
              <button onClick={onShowAdmin} style={{ padding: `${config.font_size * 0.625}px ${config.font_size}px`, border: 'none', borderRadius: `${config.font_size * 0.5}px`, fontSize: `${config.font_size * 0.875}px`, fontWeight: 600, cursor: 'pointer', background: config.secondary_action_color, color: '#ffffff', marginRight: `${config.font_size * 0.5}px` }}>
                <i className="fas fa-user-shield"></i> Admin
              </button>
            )}
            <button onClick={onLogout} style={{ padding: `${config.font_size * 0.625}px ${config.font_size}px`, border: 'none', borderRadius: `${config.font_size * 0.5}px`, fontSize: `${config.font_size * 0.875}px`, fontWeight: 600, cursor: 'pointer', background: '#ef4444', color: '#ffffff' }}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, overflowY: 'auto', padding: `${config.font_size * 1.5}px`, maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: `${config.font_size * 0.5}px`, marginBottom: `${config.font_size * 1.5}px`, borderBottom: `2px solid ${config.text_color}11`, paddingBottom: `${config.font_size * 0.5}px`, overflowX: 'auto' }}>
          <TabButton config={config} active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon="fas fa-upload" text="Upload" />
          <TabButton config={config} active={activeTab === 'all'} onClick={() => setActiveTab('all')} icon="fas fa-folder" text="My Docs" />
          <TabButton config={config} active={activeTab === 'shared'} onClick={() => setActiveTab('shared')} icon="fas fa-users" text={`Shared (${allUsersCount})`} />
          <TabButton config={config} active={activeTab === 'images'} onClick={() => setActiveTab('images')} icon="fas fa-image" text="Images" />
          <TabButton config={config} active={activeTab === 'media'} onClick={() => setActiveTab('media')} icon="fas fa-video" text="Media" />
          <TabButton config={config} active={activeTab === 'starred'} onClick={() => setActiveTab('starred')} icon="fas fa-star" text="Starred" />
        </div>

        {message && (
          <div className="slide-in" style={{ padding: `${config.font_size}px`, background: message.type === 'error' ? '#fee2e2' : '#dcfce7', color: message.type === 'error' ? '#991b1b' : '#166534', borderRadius: `${config.font_size * 0.5}px`, marginBottom: `${config.font_size}px`, fontWeight: 600, display: 'flex', alignItems: 'center', gap: `${config.font_size * 0.5}px` }}>
            <i className={message.type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'}></i>
            {message.text}
          </div>
        )}

        {activeTab === 'upload' ? (
          <UploadTab config={config} documents={myDocuments} currentUser={currentUser} showMessage={showMessage} onUploadSuccess={fetchDocuments} />
        ) : (
          <DocumentsView config={config} documents={filteredDocs} currentUser={currentUser} activeTab={activeTab} searchQuery={searchQuery} setSearchQuery={setSearchQuery} showMessage={showMessage} loading={loading} onDocumentUpdate={fetchDocuments} />
        )}
      </main>
    </div>
  );
}

export default MainApp;