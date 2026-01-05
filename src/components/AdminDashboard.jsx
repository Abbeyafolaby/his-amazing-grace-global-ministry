import React, { useState } from 'react';

const defaultConfig = {
    admin_code: "12345"
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const getFileIcon = (type) => {
    if (type.includes('pdf')) return 'fas fa-file-pdf';
    if (type.includes('word') || type.includes('document')) return 'fas fa-file-word';
    if (type.includes('sheet') || type.includes('excel')) return 'fas fa-file-excel';
    if (type.includes('image')) return 'fas fa-file-image';
    if (type.includes('video')) return 'fas fa-file-video';
    return 'fas fa-file';
};

const getFileColor = (type, primary) => {
    if (type.includes('pdf')) return '#ef4444';
    if (type.includes('word') || type.includes('document')) return '#3b82f6';
    if (type.includes('sheet') || type.includes('excel')) return '#10b981';
    if (type.includes('image')) return '#8b5cf6';
    if (type.includes('video')) return '#ec4899';
    return primary;
};

function AdminDashboard({ config, allData, currentUser, showMessage, onBack, updateAllData }) {
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [showChangeCode, setShowChangeCode] = useState(false);
    const [newCode, setNewCode] = useState('');
    const allUsers = allData.filter(d => d.isUser);
    const allDocuments = allData.filter(d => !d.isUser);
    const totalStorage = allDocuments.reduce((acc, doc) => acc + doc.size, 0);

    const handleDeleteDocument = async (doc) => {
        if (confirmDelete !== doc.id) {
            setConfirmDelete(doc.id);
            setTimeout(() => setConfirmDelete(null), 3000);
            return;
        }

        // Filter out the document to delete
        const newData = allData.filter(d => d.id !== doc.id);
        updateAllData(newData);
        setConfirmDelete(null);
        showMessage(`Deleted document: ${doc.name}`, 'success');
    };

    const handleBulkDeleteAllDocuments = async () => {
        setBulkDeleting(true);
        const deleted = allDocuments.length;

        // Keep only users, remove all documents
        const newData = allData.filter(d => d.isUser);
        updateAllData(newData);

        setBulkDeleting(false);
        showMessage(`Deleted ${deleted} documents`, 'success');
    };

    const handleExportData = () => {
        const dataStr = JSON.stringify(allDocuments, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `documents-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        showMessage(`Exported ${allDocuments.length} documents`, 'success');
    };

    const handleBackup = () => {
        const backupData = {
            users: allUsers,
            documents: allDocuments,
            timestamp: new Date().toISOString()
        };
        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `full-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        showMessage('System backup completed', 'success');
    };

    const handleChangeCode = async (e) => {
        e.preventDefault();
        if (newCode.length !== 5 || !/^\d{5}$/.test(newCode)) {
            showMessage('Code must be exactly 5 digits', 'error');
            return;
        }
        if (window.elementSdk) {
            await window.elementSdk.setConfig({ admin_code: newCode });
            showMessage('Admin code changed successfully', 'success');
            setShowChangeCode(false);
            setNewCode('');
        }
    };

    return (
        <>
            {showChangeCode && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: `${config.font_size * 2}px` }} onClick={() => { setShowChangeCode(false); setNewCode(''); }}>
                    <div className="fade-in" style={{ background: config.surface_color, borderRadius: `${config.font_size}px`, padding: `${config.font_size * 3}px`, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '400px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ textAlign: 'center', marginBottom: `${config.font_size * 2}px` }}>
                            <div style={{ fontSize: `${config.font_size * 4}px`, color: config.secondary_action_color, marginBottom: `${config.font_size}px` }}>
                                <i className="fas fa-key"></i>
                            </div>
                            <h2 style={{ fontSize: `${config.font_size * 1.75}px`, fontWeight: 700, color: config.text_color, margin: 0 }}>
                                Change Admin Code
                            </h2>
                            <p style={{ fontSize: `${config.font_size}px`, color: config.text_color, opacity: 0.7, margin: `${config.font_size * 0.5}px 0 0 0` }}>
                                <i className="fas fa-shield-alt" style={{ marginRight: `${config.font_size * 0.5}px` }}></i>
                                Enter new 5-digit code
                            </p>
                        </div>

                        <form onSubmit={handleChangeCode}>
                            <input
                                type="password"
                                value={newCode}
                                onChange={(e) => setNewCode(e.target.value)}
                                maxLength="5"
                                placeholder="•••••"
                                autoFocus
                                style={{ width: '100%', padding: `${config.font_size * 1.25}px`, border: `2px solid ${config.text_color}22`, borderRadius: `${config.font_size * 0.5}px`, fontSize: `${config.font_size * 2}px`, textAlign: 'center', letterSpacing: '8px', fontWeight: 700, color: config.text_color, outline: 'none', marginBottom: `${config.font_size}px` }}
                            />

                            <div style={{ display: 'flex', gap: `${config.font_size * 0.75}px` }}>
                                <button type="button" onClick={() => { setShowChangeCode(false); setNewCode(''); }} style={{ flex: 1, padding: `${config.font_size}px`, border: `2px solid ${config.text_color}22`, borderRadius: `${config.font_size * 0.5}px`, fontSize: `${config.font_size}px`, fontWeight: 600, cursor: 'pointer', background: 'transparent', color: config.text_color }}>
                                    <i className="fas fa-times"></i> Cancel
                                </button>
                                <button type="submit" className="btn-primary" style={{ flex: 1, padding: `${config.font_size}px`, border: 'none', borderRadius: `${config.font_size * 0.5}px`, fontSize: `${config.font_size}px`, fontWeight: 600, cursor: 'pointer', background: config.secondary_action_color, color: '#ffffff', boxShadow: `0 4px 12px ${config.secondary_action_color}44` }}>
                                    <i className="fas fa-check"></i> Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="page-load" style={{ minHeight: '100%', padding: `${config.font_size * 2}px` }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <button onClick={onBack} style={{ marginBottom: `${config.font_size * 2}px`, padding: `${config.font_size * 0.75}px ${config.font_size * 1.5}px`, border: 'none', borderRadius: `${config.font_size * 0.5}px`, fontSize: `${config.font_size}px`, fontWeight: 600, cursor: 'pointer', background: config.text_color, color: config.surface_color }}>
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </button>

                    <div className="fade-in">
                        <div style={{ background: `linear-gradient(135deg, ${config.secondary_action_color} 0%, ${config.primary_action_color} 100%)`, borderRadius: `${config.font_size}px`, padding: `${config.font_size * 2.5}px`, marginBottom: `${config.font_size * 2}px`, color: '#ffffff', boxShadow: `0 8px 32px ${config.secondary_action_color}44` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: `${config.font_size * 1.5}px`, marginBottom: `${config.font_size * 1.5}px` }}>
                                <div style={{ fontSize: `${config.font_size * 3}px` }}>
                                    <i className="fas fa-user-shield"></i>
                                </div>
                                <div>
                                    <h2 style={{ fontSize: `${config.font_size * 2}px`, fontWeight: 800, margin: 0 }}>
                                        Admin Dashboard
                                    </h2>
                                    <p style={{ fontSize: `${config.font_size}px`, margin: 0, opacity: 0.9 }}>
                                        <i className="fas fa-cog" style={{ marginRight: `${config.font_size * 0.5}px` }}></i>
                                        System-wide management and analytics
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: `${config.font_size}px` }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: `${config.font_size * 0.5}px`, padding: `${config.font_size * 1.25}px`, textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                                    <div style={{ fontSize: `${config.font_size * 2.5}px`, fontWeight: 800 }}>
                                        <i className="fas fa-users" style={{ fontSize: `${config.font_size * 1.5}px`, marginRight: `${config.font_size * 0.5}px` }}></i>
                                        {allUsers.length}
                                    </div>
                                    <div style={{ fontSize: `${config.font_size * 0.875}px`, opacity: 0.9 }}>Total Users</div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: `${config.font_size * 0.5}px`, padding: `${config.font_size * 1.25}px`, textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                                    <div style={{ fontSize: `${config.font_size * 2.5}px`, fontWeight: 800 }}>
                                        <i className="fas fa-file" style={{ fontSize: `${config.font_size * 1.5}px`, marginRight: `${config.font_size * 0.5}px` }}></i>
                                        {allDocuments.length}
                                    </div>
                                    <div style={{ fontSize: `${config.font_size * 0.875}px`, opacity: 0.9 }}>Total Documents</div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: `${config.font_size * 0.5}px`, padding: `${config.font_size * 1.25}px`, textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                                    <div style={{ fontSize: `${config.font_size * 2.5}px`, fontWeight: 800 }}>
                                        <i className="fas fa-database" style={{ fontSize: `${config.font_size * 1.5}px`, marginRight: `${config.font_size * 0.5}px` }}></i>
                                        {formatFileSize(totalStorage)}
                                    </div>
                                    <div style={{ fontSize: `${config.font_size * 0.875}px`, opacity: 0.9 }}>Total Storage</div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: `${config.font_size * 0.5}px`, padding: `${config.font_size * 1.25}px`, textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                                    <div style={{ fontSize: `${config.font_size * 2.5}px`, fontWeight: 800 }}>
                                        <i className="fas fa-layer-group" style={{ fontSize: `${config.font_size * 1.5}px`, marginRight: `${config.font_size * 0.5}px` }}></i>
                                        {999 - allDocuments.length}
                                    </div>
                                    <div style={{ fontSize: `${config.font_size * 0.875}px`, opacity: 0.9 }}>Remaining Slots</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: config.surface_color, borderRadius: `${config.font_size}px`, padding: `${config.font_size * 2}px`, marginBottom: `${config.font_size * 2}px`, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `${config.font_size * 1.5}px`, flexWrap: 'wrap', gap: `${config.font_size}px` }}>
                                <h3 style={{ fontSize: `${config.font_size * 1.5}px`, fontWeight: 700, color: config.text_color, margin: 0 }}>
                                    <i className="fas fa-tools" style={{ color: config.primary_action_color, marginRight: `${config.font_size * 0.5}px` }}></i>
                                    Bulk Actions
                                </h3>
                                <button onClick={() => setShowChangeCode(true)} className="btn-primary" style={{ padding: `${config.font_size * 0.75}px ${config.font_size * 1.25}px`, border: 'none', borderRadius: `${config.font_size * 0.5}px`, fontSize: `${config.font_size * 0.875}px`, fontWeight: 600, cursor: 'pointer', background: config.secondary_action_color, color: '#ffffff' }}>
                                    <i className="fas fa-key"></i> Change Code
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: `${config.font_size}px` }}>
                                <button
                                    onClick={() => {
                                        if (confirmDelete === 'bulk-all') {
                                            handleBulkDeleteAllDocuments();
                                        } else {
                                            setConfirmDelete('bulk-all');
                                            setTimeout(() => setConfirmDelete(null), 3000);
                                        }
                                    }}
                                    disabled={bulkDeleting || allDocuments.length === 0}
                                    className="btn-primary"
                                    style={{ padding: `${config.font_size}px`, border: 'none', borderRadius: `${config.font_size * 0.5}px`, fontSize: `${config.font_size}px`, fontWeight: 600, cursor: (bulkDeleting || allDocuments.length === 0) ? 'not-allowed' : 'pointer', background: confirmDelete === 'bulk-all' ? '#ef4444' : '#f59e0b', color: '#ffffff', opacity: (bulkDeleting || allDocuments.length === 0) ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `${config.font_size * 0.5}px` }}
                                >
                                    {bulkDeleting ? <i className="fas fa-spinner spinner"></i> : <i className="fas fa-trash-alt"></i>}
                                    {bulkDeleting ? 'Deleting...' : (confirmDelete === 'bulk-all' ? 'Confirm Delete All Docs?' : 'Delete All Documents')}
                                </button>

                                <button
                                    onClick={handleExportData}
                                    disabled={allDocuments.length === 0}
                                    className="btn-primary"
                                    style={{ padding: `${config.font_size}px`, border: 'none', borderRadius: `${config.font_size * 0.5}px`, fontSize: `${config.font_size}px`, fontWeight: 600, cursor: allDocuments.length === 0 ? 'not-allowed' : 'pointer', background: config.primary_action_color, color: '#ffffff', opacity: allDocuments.length === 0 ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `${config.font_size * 0.5}px` }}
                                >
                                    <i className="fas fa-download"></i> Export All Data
                                </button>

                                <button
                                    onClick={handleBackup}
                                    className="btn-primary"
                                    style={{ padding: `${config.font_size}px`, border: 'none', borderRadius: `${config.font_size * 0.5}px`, fontSize: `${config.font_size}px`, fontWeight: 600, cursor: 'pointer', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `${config.font_size * 0.5}px` }}
                                >
                                    <i className="fas fa-save"></i> Backup System
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: `${config.font_size * 2}px` }}>
                            <div style={{ background: config.surface_color, borderRadius: `${config.font_size}px`, padding: `${config.font_size * 2}px`, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                                <h3 style={{ fontSize: `${config.font_size * 1.5}px`, fontWeight: 700, color: config.text_color, marginBottom: `${config.font_size * 1.5}px` }}>
                                    <i className="fas fa-users" style={{ color: config.primary_action_color, marginRight: `${config.font_size * 0.5}px` }}></i>
                                    All Users
                                </h3>

                                {allUsers.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: config.text_color, opacity: 0.6, padding: `${config.font_size * 2}px` }}>
                                        <i className="fas fa-info-circle" style={{ fontSize: `${config.font_size * 2}px`, display: 'block', marginBottom: `${config.font_size}px` }}></i>
                                        No users yet
                                    </p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: `${config.font_size}px`, maxHeight: '500px', overflowY: 'auto' }}>
                                        {allUsers.map(user => {
                                            const userDocs = allDocuments.filter(d => d.userId === user.id);
                                            const userStorage = userDocs.reduce((acc, doc) => acc + doc.size, 0);
                                            const isCurrentUser = currentUser && user.id === currentUser.id;

                                            return (
                                                <div key={user.id} className="document-card" style={{ background: isCurrentUser ? `${config.secondary_action_color}11` : config.background_color, borderRadius: `${config.font_size * 0.5}px`, padding: `${config.font_size * 1.25}px`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: isCurrentUser ? `2px solid ${config.secondary_action_color}` : '2px solid transparent' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: `${config.font_size}px` }}>
                                                        <div style={{ width: `${config.font_size * 3}px`, height: `${config.font_size * 3}px`, borderRadius: '50%', background: config.primary_action_color, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${config.font_size * 1.25}px`, fontWeight: 700 }}>
                                                            <i className="fas fa-user"></i>
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: `${config.font_size}px`, fontWeight: 700, color: config.text_color, display: 'flex', alignItems: 'center', gap: `${config.font_size * 0.5}px` }}>
                                                                {user.userEmail}
                                                                {isCurrentUser && (
                                                                    <span style={{ fontSize: `${config.font_size * 0.75}px`, background: config.secondary_action_color, color: '#ffffff', padding: `${config.font_size * 0.25}px ${config.font_size * 0.5}px`, borderRadius: `${config.font_size * 0.25}px`, fontWeight: 600 }}>
                                                                        <i className="fas fa-crown" style={{ marginRight: `${config.font_size * 0.25}px` }}></i>
                                                                        YOU
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div style={{ fontSize: `${config.font_size * 0.875}px`, color: config.text_color, opacity: 0.7 }}>
                                                                <i className="fas fa-file" style={{ marginRight: `${config.font_size * 0.25}px` }}></i>
                                                                {userDocs.length} documents
                                                                <i className="fas fa-database" style={{ marginLeft: `${config.font_size * 0.5}px`, marginRight: `${config.font_size * 0.25}px` }}></i>
                                                                {formatFileSize(userStorage)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div style={{ background: config.surface_color, borderRadius: `${config.font_size}px`, padding: `${config.font_size * 2}px`, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                                <h3 style={{ fontSize: `${config.font_size * 1.5}px`, fontWeight: 700, color: config.text_color, marginBottom: `${config.font_size * 1.5}px` }}>
                                    <i className="fas fa-file-alt" style={{ color: config.primary_action_color, marginRight: `${config.font_size * 0.5}px` }}></i>
                                    All Documents
                                </h3>

                                {allDocuments.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: config.text_color, opacity: 0.6, padding: `${config.font_size * 2}px` }}>
                                        <i className="fas fa-info-circle" style={{ fontSize: `${config.font_size * 2}px`, display: 'block', marginBottom: `${config.font_size}px` }}></i>
                                        No documents yet
                                    </p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: `${config.font_size}px`, maxHeight: '500px', overflowY: 'auto' }}>
                                        {allDocuments.map(doc => {
                                            const owner = allUsers.find(u => u.id === doc.userId);
                                            const ownerEmail = owner ? owner.userEmail : 'Unknown';
                                            const fileIcon = getFileIcon(doc.type);
                                            const fileColor = getFileColor(doc.type, config.primary_action_color);

                                            return (
                                                <div key={doc.id} className="document-card" style={{ background: config.background_color, borderRadius: `${config.font_size * 0.5}px`, padding: `${config.font_size * 1.25}px`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: `${config.font_size}px` }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: `${config.font_size}px`, flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontSize: `${config.font_size * 2}px`, color: fileColor }}>
                                                                <i className={fileIcon}></i>
                                                            </div>
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div style={{ fontSize: `${config.font_size}px`, fontWeight: 700, color: config.text_color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {doc.name}
                                                                </div>
                                                                <div style={{ fontSize: `${config.font_size * 0.75}px`, color: config.text_color, opacity: 0.7 }}>
                                                                    <i className="fas fa-user" style={{ marginRight: `${config.font_size * 0.25}px` }}></i>
                                                                    {ownerEmail}
                                                                    <span style={{ margin: `0 ${config.font_size * 0.25}px` }}>•</span>
                                                                    {formatFileSize(doc.size)}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => handleDeleteDocument(doc)}
                                                            style={{ padding: `${config.font_size * 0.5}px ${config.font_size * 0.75}px`, border: 'none', borderRadius: `${config.font_size * 0.375}px`, fontSize: `${config.font_size * 0.75}px`, fontWeight: 600, cursor: 'pointer', background: confirmDelete === doc.id ? '#dc2626' : '#ef4444', color: '#ffffff', whiteSpace: 'nowrap', minWidth: '60px' }}
                                                        >
                                                            <i className="fas fa-trash"></i> {confirmDelete === doc.id ? 'Yes?' : 'Del'}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;
