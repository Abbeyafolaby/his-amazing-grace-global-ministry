export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const getFileIcon = (type) => {
  if (type.includes('pdf')) return 'fas fa-file-pdf';
  if (type.includes('word') || type.includes('document')) return 'fas fa-file-word';
  if (type.includes('sheet') || type.includes('excel')) return 'fas fa-file-excel';
  if (type.includes('image')) return 'fas fa-file-image';
  if (type.includes('video')) return 'fas fa-file-video';
  return 'fas fa-file';
};

export const getFileColor = (type, primary) => {
  if (type.includes('pdf')) return '#ef4444';
  if (type.includes('word') || type.includes('document')) return '#3b82f6';
  if (type.includes('sheet') || type.includes('excel')) return '#10b981';
  if (type.includes('image')) return '#8b5cf6';
  if (type.includes('video')) return '#ec4899';
  return primary;
};