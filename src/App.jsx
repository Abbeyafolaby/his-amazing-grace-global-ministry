import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.jsx';
import AuthPage from './components/AuthPage.jsx';
import MainApp from './components/MainApp.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

const defaultConfig = {
  background_color: "#f8fafc",
  surface_color: "#ffffff",
  text_color: "#1e293b",
  primary_action_color: "#3b82f6",
  secondary_action_color: "#8b5cf6",
  font_family: "Plus Jakarta Sans",
  font_size: 16,
  portfolio_title: "His Amazing Grace Global Ministry",
  subtitle: "Organize and showcase your documents",
  signup_title: "Create Account",
  login_title: "Welcome Back",
  upload_button_text: "Upload Document",
  empty_state_message: "No documents yet. Upload your first file!",
  search_placeholder: "Search documents...",
  admin_code: "12345"
};

// Mock storage - replace with real backend/localStorage
const mockStorage = {
  users: [],
  documents: []
};

function App() {
  const [config] = useState(defaultConfig);
  const [allData, setAllData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('upload');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [message, setMessage] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const savedDocs = JSON.parse(localStorage.getItem('documents') || '[]');
    setAllData([...savedUsers, ...savedDocs]);

    setTimeout(() => {
      setIsInitializing(false);
    }, 1500);
  }, []);

  useEffect(() => {
    // Apply config styles
    document.body.style.background = config.background_color;
    document.body.style.fontFamily = `${config.font_family}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  }, [config]);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const updateAllData = (newData) => {
    setAllData(newData);
    const users = newData.filter(d => d.isUser);
    const docs = newData.filter(d => !d.isUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('documents', JSON.stringify(docs));
  };

  if (isInitializing) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '60px 40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <div style={{ fontSize: '72px', marginBottom: '30px' }}>
            <i className="fas fa-folder-open float" style={{ color: '#3b82f6' }}></i>
          </div>
          <h1 style={{ fontSize: '32px', color: '#1e293b', marginBottom: '20px', fontWeight: 800 }}>
            <i className="fas fa-file-alt" style={{ marginRight: '12px', color: '#3b82f6' }}></i>
            Document Portfolio
          </h1>
          <div style={{ fontSize: '48px', color: '#3b82f6', marginBottom: '20px' }}>
            <i className="fas fa-spinner spinner"></i>
          </div>
          <div className="loading-dots" style={{ fontSize: '32px', color: '#64748b', fontWeight: 700 }}>
            Loading<span>.</span><span>.</span><span>.</span>
          </div>
          <div style={{
            marginTop: '30px',
            height: '6px',
            background: '#e2e8f0',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div className="progress-bar" style={{
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              borderRadius: '10px'
            }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (showAdmin) {
    return (
      <AdminDashboard
        config={config}
        allData={allData}
        currentUser={currentUser}
        showMessage={showMessage}
        onBack={() => setShowAdmin(false)}
        updateAllData={updateAllData}
      />
    );
  }

  if (showLanding) {
    return (
      <LandingPage
        config={config}
        onGetStarted={() => { setShowLanding(false); setAuthMode('signup'); }}
        onSignIn={() => { setShowLanding(false); setAuthMode('login'); }}
        showAdminAuth={showAdminAuth}
        setShowAdminAuth={setShowAdminAuth}
        setShowAdmin={setShowAdmin}
      />
    );
  }

  if (!currentUser) {
    return (
      <AuthPage
        config={config}
        authMode={authMode}
        setAuthMode={setAuthMode}
        allData={allData}
        setCurrentUser={setCurrentUser}
        setShowLanding={setShowLanding}
        setActiveTab={setActiveTab}
        showMessage={showMessage}
        updateAllData={updateAllData}
      />
    );
  }

  return (
    <MainApp
      config={config}
      currentUser={currentUser}
      allData={allData}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      viewMode={viewMode}
      setViewMode={setViewMode}
      onLogout={() => {
        setCurrentUser(null);
        setShowLanding(true);
        setActiveTab('upload');
      }}
      message={message}
      showMessage={showMessage}
      updateAllData={updateAllData}
    />
  );
}

export default App;