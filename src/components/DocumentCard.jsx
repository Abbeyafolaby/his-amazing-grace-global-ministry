import { useState } from 'react';
import { getFileIcon, getFileColor, formatFileSize } from '../utils/helpers';
import DocumentPreview from './DocumentPreview.jsx';
import { documentAPI } from '../utils/api.js';

function DocumentCard({ doc, config, currentUser, activeTab, showMessage, onDocumentUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileIcon = getFileIcon(doc.fileType);
  const fileColor = getFileColor(doc.fileType, config.primary_action_color);
  const ownerEmail = doc.uploadedBy?.email || 'Unknown';
  const isMyDocument = doc.uploadedBy?._id === currentUser.id;

  const handleToggleStar = async () => {
    setIsUpdating(true);

    try {
      await documentAPI.toggleStar(doc._id);
      showMessage(doc.starred ? 'Removed from starred' : 'Added to starred', 'success');
      // Refresh documents list
      if (onDocumentUpdate) {
        onDocumentUpdate();
      }
    } catch (error) {
      console.error('Failed to toggle star:', error);
      showMessage('Failed to update star status', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownload = () => {
    // Check if file data exists
    if (!doc.fileData) {
      showMessage('File data not available for download', 'error');
      return;
    }

    try {
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = doc.fileData;
      link.download = doc.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showMessage(`Downloaded: ${doc.title}`, 'success');
    } catch (error) {
      console.error('Download failed:', error);
      showMessage('Download failed', 'error');
    }
  };

  return (
    <div className="document-card fade-in" style={{ background: config.surface_color, borderRadius: `${config.font_size * 0.75}px`, padding: `${config.font_size * 1.25}px`, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: `${config.font_size}px` }}>
        <div style={{ fontSize: `${config.font_size * 2.5}px`, color: fileColor }}>
          <i className={fileIcon}></i>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ fontSize: `${config.font_size}px`, fontWeight: 600, color: config.text_color, margin: `0 0 ${config.font_size * 0.25}px 0`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {doc.title}
          </h4>
          <p style={{ fontSize: `${config.font_size * 0.875}px`, color: config.text_color, opacity: 0.6, margin: 0 }}>
            <i className="fas fa-hdd" style={{ marginRight: `${config.font_size * 0.25}px` }}></i>
            {formatFileSize(doc.size)}
            <i className="fas fa-calendar" style={{ marginLeft: `${config.font_size * 0.5}px`, marginRight: `${config.font_size * 0.25}px` }}></i>
            {new Date(doc.createdAt).toLocaleDateString()}
          </p>
          {activeTab === 'shared' && (
            <p style={{ fontSize: `${config.font_size * 0.75}px`, color: config.secondary_action_color, fontWeight: 600, marginTop: `${config.font_size * 0.25}px`, display: 'flex', alignItems: 'center', gap: `${config.font_size * 0.25}px` }}>
              <i className="fas fa-user"></i> {ownerEmail}
            </p>
          )}
        </div>
        <button
          onClick={handleToggleStar}
          disabled={isUpdating}
          style={{ padding: `${config.font_size * 0.5}px`, border: 'none', background: 'transparent', cursor: isUpdating ? 'not-allowed' : 'pointer', fontSize: `${config.font_size * 1.25}px`, color: doc.starred ? '#fbbf24' : `${config.text_color}33`, opacity: isUpdating ? 0.3 : 1 }}
        >
          {isUpdating ? <i className="fas fa-spinner spinner"></i> : <i className="fas fa-star"></i>}
        </button>
      </div>
      <div style={{ marginTop: `${config.font_size}px`, paddingTop: `${config.font_size}px`, borderTop: `1px solid ${config.text_color}11`, display: 'flex', gap: `${config.font_size * 0.5}px` }}>
        <button onClick={() => setShowPreview(true)} style={{ flex: 1, padding: `${config.font_size * 0.625}px`, border: 'none', borderRadius: `${config.font_size * 0.375}px`, fontSize: `${config.font_size * 0.875}px`, fontWeight: 600, cursor: 'pointer', background: config.primary_action_color, color: '#ffffff' }}>
          <i className="fas fa-eye"></i> View
        </button>
        <button onClick={handleDownload} style={{ flex: 1, padding: `${config.font_size * 0.625}px`, border: 'none', borderRadius: `${config.font_size * 0.375}px`, fontSize: `${config.font_size * 0.875}px`, fontWeight: 600, cursor: 'pointer', background: '#10b981', color: '#ffffff' }}>
          <i className="fas fa-download"></i> Download
        </button>
      </div>

      {showPreview && (
        <DocumentPreview
          doc={doc}
          config={config}
          onClose={() => setShowPreview(false)}
          showMessage={showMessage}
        />
      )}
    </div>
  );
}

export default DocumentCard;