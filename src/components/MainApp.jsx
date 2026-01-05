import TabButton from './TabButton';
import UploadTab from './UploadTab';
import DocumentsView from './DocumentsView';

function MainApp({ config, currentUser, allData, activeTab, setActiveTab, searchQuery, setSearchQuery, viewMode, setViewMode, onLogout, message, showMessage, updateAllData }) {
  const myDocuments = allData.filter(d => !d.isUser && d.userId === currentUser.id);
  const allUserDocuments = allData.filter(d => !d.isUser);
  const documents = activeTab === 'shared' ? allUserDocuments : myDocuments;
  const allUsersCount = allData.filter(d => d.isUser).length;

  let filteredDocs = documents;
  if (activeTab === 'images') {
    filteredDocs = documents.filter(d => d.type && d.type.includes('image'));
  } else if (activeTab === 'media') {
    filteredDocs = documents.filter(d => d.type && (d.type.includes('video') || d.type.includes('audio')));
  } else if (activeTab === 'starred') {
    filteredDocs = documents.filter(d => d.starred);
  }

  if (searchQuery) {
    filteredDocs = filteredDocs.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
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
                {currentUser.userEmail}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: `${config.font_size * 0.5}px`, alignItems: 'center' }}>
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
          <UploadTab config={config} documents={myDocuments} currentUser={currentUser} showMessage={showMessage} allData={allData} updateAllData={updateAllData} />
        ) : (
          <DocumentsView config={config} documents={filteredDocs} allData={allData} currentUser={currentUser} activeTab={activeTab} searchQuery={searchQuery} setSearchQuery={setSearchQuery} showMessage={showMessage} updateAllData={updateAllData} />
        )}
      </main>
    </div>
  );
}

export default MainApp;