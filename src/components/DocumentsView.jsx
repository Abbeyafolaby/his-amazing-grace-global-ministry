import DocumentCard from './DocumentCard';

function DocumentsView({ config, documents, currentUser, activeTab, searchQuery, setSearchQuery, showMessage, loading, onDocumentUpdate }) {
  return (
    <>
      <div style={{ marginBottom: `${config.font_size * 1.5}px` }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder={config.search_placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: `${config.font_size * 0.875}px ${config.font_size}px ${config.font_size * 0.875}px ${config.font_size * 3}px`, border: `2px solid ${config.text_color}11`, borderRadius: `${config.font_size * 0.5}px`, fontSize: `${config.font_size}px`, outline: 'none' }}
          />
          <i className="fas fa-search" style={{ position: 'absolute', left: `${config.font_size}px`, top: '50%', transform: 'translateY(-50%)', color: config.text_color, opacity: 0.4 }}></i>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: `${config.font_size * 4}px`, color: config.primary_action_color }}>
          <i className="fas fa-spinner spinner" style={{ fontSize: `${config.font_size * 3}px` }}></i>
          <p style={{ fontSize: `${config.font_size}px`, marginTop: `${config.font_size}px` }}>Loading documents...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {documents.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: `${config.font_size * 4}px`, color: config.text_color, opacity: 0.6 }}>
              <div style={{ fontSize: `${config.font_size * 3}px`, marginBottom: `${config.font_size}px` }}>
                <i className="fas fa-folder-open"></i>
              </div>
              <p style={{ fontSize: `${config.font_size * 1.125}px` }}>
                <i className="fas fa-info-circle" style={{ marginRight: `${config.font_size * 0.5}px` }}></i>
                {config.empty_state_message}
              </p>
            </div>
          ) : (
            documents.map(doc => (
              <DocumentCard
                key={doc._id}
                doc={doc}
                config={config}
                currentUser={currentUser}
                activeTab={activeTab}
                showMessage={showMessage}
                onDocumentUpdate={onDocumentUpdate}
              />
            ))
          )}
        </div>
      )}
    </>
  );
}

export default DocumentsView;