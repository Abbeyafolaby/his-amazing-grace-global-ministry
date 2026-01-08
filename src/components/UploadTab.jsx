import { useRef, useState } from 'react';
import { documentAPI } from '../utils/api.js';

function UploadTab({ config, documents, currentUser, showMessage, onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (files) => {
    const filesArray = Array.from(files);
    if (documents.length + filesArray.length > 999) {
      showMessage('Maximum limit of 999 documents reached', 'error');
      return;
    }

    setIsUploading(true);
    let uploadedCount = 0;

    // Process each file and upload to backend
    for (const file of filesArray) {
      try {
        // Convert file to Base64
        const fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(file);
        });

        // Upload to backend
        await documentAPI.upload({
          title: file.name,
          fileType: file.type || 'application/octet-stream',
          fileData: fileData, // Base64 string
          size: file.size
        });

        uploadedCount++;
      } catch (error) {
        console.error(`Failed to upload file: ${file.name}`, error);
        showMessage(`Failed to upload ${file.name}`, 'error');
      }
    }

    if (uploadedCount > 0) {
      showMessage(`Uploaded ${uploadedCount} file(s)!`, 'success');
      // Refresh the documents list
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    }

    setIsUploading(false);
  };

  return (
    <>
      <div
        className={`upload-zone ${isDragging ? 'dragover' : ''}`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files); }}
        style={{ background: config.surface_color, borderColor: `${config.primary_action_color}33`, borderRadius: `${config.font_size}px`, padding: `${config.font_size * 4}px ${config.font_size * 2}px`, textAlign: 'center', cursor: isUploading ? 'wait' : 'pointer', marginBottom: `${config.font_size * 2}px` }}
      >
        <div style={{ fontSize: `${config.font_size * 4}px`, color: config.primary_action_color, marginBottom: `${config.font_size}px` }}>
          {isUploading ? <i className="fas fa-spinner spinner"></i> : <i className="fas fa-cloud-upload-alt"></i>}
        </div>
        <h3 style={{ fontSize: `${config.font_size * 1.5}px`, fontWeight: 700, color: config.text_color, margin: `0 0 ${config.font_size * 0.5}px 0` }}>
          {isUploading ? (
            <span className="loading-dots">Uploading<span>.</span><span>.</span><span>.</span></span>
          ) : (
            <><i className="fas fa-file-upload" style={{ marginRight: `${config.font_size * 0.5}px` }}></i>{config.upload_button_text}</>
          )}
        </h3>
        <p style={{ fontSize: `${config.font_size}px`, color: config.text_color, opacity: 0.7, margin: 0 }}>
          <i className="fas fa-hand-pointer" style={{ marginRight: `${config.font_size * 0.5}px` }}></i>
          {isUploading ? 'Please wait...' : 'Click to browse or drag and drop files here'}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={isUploading}
          style={{ display: 'none' }}
        />
      </div>

      <div className="fade-in" style={{ background: config.surface_color, borderRadius: `${config.font_size}px`, padding: `${config.font_size * 1.5}px`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontSize: `${config.font_size * 1.125}px`, fontWeight: 700, color: config.text_color, marginBottom: `${config.font_size}px` }}>
          <i className="fas fa-chart-bar" style={{ color: config.primary_action_color, marginRight: `${config.font_size * 0.5}px` }}></i> Upload Stats
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: `${config.font_size}px` }}>
          <div style={{ textAlign: 'center', padding: `${config.font_size}px`, background: `${config.primary_action_color}11`, borderRadius: `${config.font_size * 0.5}px` }}>
            <div style={{ fontSize: `${config.font_size * 2}px`, fontWeight: 800, color: config.primary_action_color }}>
              <i className="fas fa-file" style={{ fontSize: `${config.font_size * 1.25}px`, marginRight: `${config.font_size * 0.5}px` }}></i>
              {documents.length}
            </div>
            <div style={{ fontSize: `${config.font_size * 0.875}px`, color: config.text_color, opacity: 0.7 }}>Total Files</div>
          </div>
          <div style={{ textAlign: 'center', padding: `${config.font_size}px`, background: `${config.primary_action_color}11`, borderRadius: `${config.font_size * 0.5}px` }}>
            <div style={{ fontSize: `${config.font_size * 2}px`, fontWeight: 800, color: config.primary_action_color }}>
              <i className="fas fa-layer-group" style={{ fontSize: `${config.font_size * 1.25}px`, marginRight: `${config.font_size * 0.5}px` }}></i>
              {999 - documents.length}
            </div>
            <div style={{ fontSize: `${config.font_size * 0.875}px`, color: config.text_color, opacity: 0.7 }}>Remaining</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadTab;