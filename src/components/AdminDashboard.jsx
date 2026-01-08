import React, { useState, useEffect } from 'react';
import { adminAPI, documentAPI } from '../utils/api.js';

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

function AdminDashboard({ config, currentUser, showMessage, onBack }) {
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalUsers: 0, totalDocuments: 0, totalStorage: 0 });
    const [allUsers, setAllUsers] = useState([]);
    const [allDocuments, setAllDocuments] = useState([]);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, docsRes] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getUsers(),
                documentAPI.getAll()
            ]);

            setStats(statsRes.data);
            setAllUsers(usersRes.data);
            setAllDocuments(docsRes.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            showMessage('Failed to load admin data. Please ensure you have admin privileges.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDocument = async (doc) => {
        if (confirmDelete !== doc._id) {
            setConfirmDelete(doc._id);
            setTimeout(() => setConfirmDelete(null), 3000);
            return;
        }

        try {
            await adminAPI.deleteDocument(doc._id);
            setConfirmDelete(null);
            showMessage(`Deleted document: ${doc.title}`, 'success');
            fetchAdminData();
        } catch (error) {
            console.error('Delete error:', error);
            showMessage('Failed to delete document', 'error');
            setConfirmDelete(null);
        }
    };

    const handleBulkDeleteAllDocuments = async () => {
        setBulkDeleting(true);

        try {
            const result = await adminAPI.deleteAllDocuments();
            showMessage(`Deleted ${result.data.deletedCount} documents`, 'success');
            fetchAdminData();
        } catch (error) {
            console.error('Bulk delete error:', error);
            showMessage('Failed to delete all documents', 'error');
        } finally {
            setBulkDeleting(false);
        }
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

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div style={{ textAlign: 'center', color: '#ffffff' }}>
                    <i className="fas fa-spinner spinner" style={{ fontSize: `${config.font_size * 4}px`, marginBottom: `${config.font_size}px` }}></i>
                    <p style={{ fontSize: `${config.font_size * 1.5}px`, fontWeight: 600 }}>Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
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
                                    {stats.totalUsers}
                                </div>
                                <div style={{ fontSize: `${config.font_size * 0.875}px`, opacity: 0.9 }}>Total Users</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: `${config.font_size * 0.5}px`, padding: `${config.font_size * 1.25}px`, textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                                <div style={{ fontSize: `${config.font_size * 2.5}px`, fontWeight: 800 }}>
                                    <i className="fas fa-file" style={{ fontSize: `${config.font_size * 1.5}px`, marginRight: `${config.font_size * 0.5}px` }}></i>
                                    {stats.totalDocuments}
                                </div>
                                <div style={{ fontSize: `${config.font_size * 0.875}px`, opacity: 0.9 }}>Total Documents</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: `${config.font_size * 0.5}px`, padding: `${config.font_size * 1.25}px`, textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                                <div style={{ fontSize: `${config.font_size * 2.5}px`, fontWeight: 800 }}>
                                    <i className="fas fa-database" style={{ fontSize: `${config.font_size * 1.5}px`, marginRight: `${config.font_size * 0.5}px` }}></i>
                                    {formatFileSize(stats.totalStorage)}
                                </div>
                                <div style={{ fontSize: `${config.font_size * 0.875}px`, opacity: 0.9 }}>Total Storage</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: `${config.font_size * 0.5}px`, padding: `${config.font_size * 1.25}px`, textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                                <div style={{ fontSize: `${config.font_size * 2.5}px`, fontWeight: 800 }}>
                                    <i className="fas fa-layer-group" style={{ fontSize: `${config.font_size * 1.5}px`, marginRight: `${config.font_size * 0.5}px` }}></i>
                                    {999 - stats.totalDocuments}
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
                                        const isCurrentUser = currentUser && user._id === currentUser.id;

                                        return (
                                            <div key={user._id} className="document-card" style={{ background: isCurrentUser ? `${config.secondary_action_color}11` : config.background_color, borderRadius: `${config.font_size * 0.5}px`, padding: `${config.font_size * 1.25}px`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: isCurrentUser ? `2px solid ${config.secondary_action_color}` : '2px solid transparent' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: `${config.font_size}px` }}>
                                                    <div style={{ width: `${config.font_size * 3}px`, height: `${config.font_size * 3}px`, borderRadius: '50%', background: config.primary_action_color, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${config.font_size * 1.25}px`, fontWeight: 700 }}>
                                                        <i className="fas fa-user"></i>
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: `${config.font_size}px`, fontWeight: 700, color: config.text_color, display: 'flex', alignItems: 'center', gap: `${config.font_size * 0.5}px` }}>
                                                            {user.email}
                                                            {isCurrentUser && (
                                                                <span style={{ fontSize: `${config.font_size * 0.75}px`, background: config.secondary_action_color, color: '#ffffff', padding: `${config.font_size * 0.25}px ${config.font_size * 0.5}px`, borderRadius: `${config.font_size * 0.25}px`, fontWeight: 600 }}>
                                                                    <i className="fas fa-crown" style={{ marginRight: `${config.font_size * 0.25}px` }}></i>
                                                                    YOU
                                                                </span>
                                                            )}
                                                            {user.isAdmin && (
                                                                <span style={{ fontSize: `${config.font_size * 0.75}px`, background: '#ef4444', color: '#ffffff', padding: `${config.font_size * 0.25}px ${config.font_size * 0.5}px`, borderRadius: `${config.font_size * 0.25}px`, fontWeight: 600 }}>
                                                                    <i className="fas fa-shield-alt" style={{ marginRight: `${config.font_size * 0.25}px` }}></i>
                                                                    ADMIN
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div style={{ fontSize: `${config.font_size * 0.875}px`, color: config.text_color, opacity: 0.7 }}>
                                                            <i className="fas fa-file" style={{ marginRight: `${config.font_size * 0.25}px` }}></i>
                                                            {user.documentCount || 0} documents
                                                            <i className="fas fa-database" style={{ marginLeft: `${config.font_size * 0.5}px`, marginRight: `${config.font_size * 0.25}px` }}></i>
                                                            {formatFileSize(user.storage || 0)}
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
                                        const ownerEmail = doc.uploadedBy?.email || 'Unknown';
                                        const fileIcon = getFileIcon(doc.fileType);
                                        const fileColor = getFileColor(doc.fileType, config.primary_action_color);

                                        return (
                                            <div key={doc._id} className="document-card" style={{ background: config.background_color, borderRadius: `${config.font_size * 0.5}px`, padding: `${config.font_size * 1.25}px`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: `${config.font_size}px` }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: `${config.font_size}px`, flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: `${config.font_size * 2}px`, color: fileColor }}>
                                                            <i className={fileIcon}></i>
                                                        </div>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontSize: `${config.font_size}px`, fontWeight: 700, color: config.text_color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {doc.title}
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
                                                        style={{ padding: `${config.font_size * 0.5}px ${config.font_size * 0.75}px`, border: 'none', borderRadius: `${config.font_size * 0.375}px`, fontSize: `${config.font_size * 0.75}px`, fontWeight: 600, cursor: 'pointer', background: confirmDelete === doc._id ? '#dc2626' : '#ef4444', color: '#ffffff', whiteSpace: 'nowrap', minWidth: '60px' }}
                                                    >
                                                        <i className="fas fa-trash"></i> {confirmDelete === doc._id ? 'Yes?' : 'Del'}
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
    );
}

export default AdminDashboard;
