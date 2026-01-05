import React from 'react';

function DocumentPreview({ doc, config, onClose, showMessage }) {
    if (!doc) return null;

    const handleDownload = () => {
        if (!doc.fileData) {
            showMessage('File data not available for download', 'error');
            return;
        }

        try {
            const link = document.createElement('a');
            link.href = doc.fileData;
            link.download = doc.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showMessage(`Downloaded: ${doc.name}`, 'success');
        } catch (error) {
            console.error('Download failed:', error);
            showMessage('Download failed', 'error');
        }
    };

    const renderPreviewContent = () => {
        if (!doc.fileData) {
            return (
                <div style={{ textAlign: 'center', padding: `${config.font_size * 4}px`, color: config.text_color }}>
                    <i className="fas fa-exclamation-circle" style={{ fontSize: `${config.font_size * 4}px`, marginBottom: `${config.font_size}px`, color: '#ef4444' }}></i>
                    <p style={{ fontSize: `${config.font_size * 1.25}px`, fontWeight: 600 }}>File data not available</p>
                    <p style={{ fontSize: `${config.font_size}px`, opacity: 0.7 }}>Unable to preview this file</p>
                </div>
            );
        }

        // Image files
        if (doc.type.includes('image')) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: `${config.font_size}px` }}>
                    <img
                        src={doc.fileData}
                        alt={doc.name}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: `${config.font_size * 0.5}px` }}
                    />
                </div>
            );
        }

        // PDF files
        if (doc.type.includes('pdf')) {
            return (
                <embed
                    src={doc.fileData}
                    type="application/pdf"
                    style={{ width: '100%', height: '100%', border: 'none', borderRadius: `${config.font_size * 0.5}px` }}
                />
            );
        }

        // Video files
        if (doc.type.includes('video')) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: `${config.font_size}px` }}>
                    <video
                        controls
                        style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: `${config.font_size * 0.5}px` }}
                    >
                        <source src={doc.fileData} type={doc.type} />
                        Your browser does not support video playback.
                    </video>
                </div>
            );
        }

        // Audio files
        if (doc.type.includes('audio')) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: `${config.font_size * 4}px`, color: config.text_color }}>
                    <i className="fas fa-music" style={{ fontSize: `${config.font_size * 6}px`, marginBottom: `${config.font_size * 2}px`, color: config.primary_action_color }}></i>
                    <p style={{ fontSize: `${config.font_size * 1.25}px`, fontWeight: 600, marginBottom: `${config.font_size * 2}px` }}>{doc.name}</p>
                    <audio
                        controls
                        style={{ width: '100%', maxWidth: '500px' }}
                    >
                        <source src={doc.fileData} type={doc.type} />
                        Your browser does not support audio playback.
                    </audio>
                </div>
            );
        }

        // Text files
        if (doc.type.includes('text') || doc.name.endsWith('.txt')) {
            // For text files, we need to decode the Base64 if it's a data URL
            try {
                let textContent = doc.fileData;
                if (textContent.startsWith('data:')) {
                    const base64Data = textContent.split(',')[1];
                    textContent = atob(base64Data);
                }
                return (
                    <div style={{ width: '100%', height: '100%', padding: `${config.font_size * 2}px`, overflow: 'auto' }}>
                        <pre style={{
                            fontFamily: 'monospace',
                            fontSize: `${config.font_size}px`,
                            color: config.text_color,
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            margin: 0,
                            background: config.background_color,
                            padding: `${config.font_size}px`,
                            borderRadius: `${config.font_size * 0.5}px`
                        }}>
                            {textContent}
                        </pre>
                    </div>
                );
            } catch (error) {
                console.error('Failed to decode text:', error);
            }
        }

        // Unsupported file types
        return (
            <div style={{ textAlign: 'center', padding: `${config.font_size * 4}px`, color: config.text_color }}>
                <i className="fas fa-file" style={{ fontSize: `${config.font_size * 6}px`, marginBottom: `${config.font_size * 2}px`, color: config.primary_action_color }}></i>
                <p style={{ fontSize: `${config.font_size * 1.5}px`, fontWeight: 700, marginBottom: `${config.font_size}px` }}>{doc.name}</p>
                <p style={{ fontSize: `${config.font_size}px`, opacity: 0.7, marginBottom: `${config.font_size * 2}px` }}>Preview not available for this file type</p>
                <button onClick={handleDownload} className="btn-primary" style={{ padding: `${config.font_size}px ${config.font_size * 2}px`, border: 'none', borderRadius: `${config.font_size * 0.5}px`, fontSize: `${config.font_size}px`, fontWeight: 600, cursor: 'pointer', background: config.primary_action_color, color: '#ffffff' }}>
                    <i className="fas fa-download" style={{ marginRight: `${config.font_size * 0.5}px` }}></i>
                    Download to View
                </button>
            </div>
        );
    };

    return (
        <div
            className="fade-in"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.9)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 9999,
                padding: `${config.font_size}px`
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            {/* Header */}
            <div style={{
                background: config.surface_color,
                borderRadius: `${config.font_size * 0.75}px ${config.font_size * 0.75}px 0 0`,
                padding: `${config.font_size}px ${config.font_size * 1.5}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: `${config.font_size}px`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                        fontSize: `${config.font_size * 1.25}px`,
                        fontWeight: 700,
                        color: config.text_color,
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        <i className="fas fa-eye" style={{ marginRight: `${config.font_size * 0.5}px`, color: config.primary_action_color }}></i>
                        {doc.name}
                    </h3>
                </div>
                <div style={{ display: 'flex', gap: `${config.font_size * 0.5}px` }}>
                    <button
                        onClick={handleDownload}
                        className="btn-primary"
                        style={{
                            padding: `${config.font_size * 0.625}px ${config.font_size}px`,
                            border: 'none',
                            borderRadius: `${config.font_size * 0.375}px`,
                            fontSize: `${config.font_size * 0.875}px`,
                            fontWeight: 600,
                            cursor: 'pointer',
                            background: '#10b981',
                            color: '#ffffff'
                        }}
                    >
                        <i className="fas fa-download"></i> Download
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            padding: `${config.font_size * 0.625}px ${config.font_size}px`,
                            border: 'none',
                            borderRadius: `${config.font_size * 0.375}px`,
                            fontSize: `${config.font_size * 0.875}px`,
                            fontWeight: 600,
                            cursor: 'pointer',
                            background: '#ef4444',
                            color: '#ffffff'
                        }}
                    >
                        <i className="fas fa-times"></i> Close
                    </button>
                </div>
            </div>

            {/* Preview Content */}
            <div style={{
                flex: 1,
                background: config.surface_color,
                borderRadius: `0 0 ${config.font_size * 0.75}px ${config.font_size * 0.75}px`,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {renderPreviewContent()}
            </div>
        </div>
    );
}

export default DocumentPreview;
