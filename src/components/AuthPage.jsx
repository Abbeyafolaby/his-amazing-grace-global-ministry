import { useState } from 'react';
import { authAPI } from '../utils/api.js';

function AuthPage({ config, authMode, setAuthMode, setCurrentUser, setShowLanding, setActiveTab, showMessage }) {
  const { surface_color, text_color, primary_action_color, font_size, signup_title, login_title } = config;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);

    try {
      if (authMode === 'signup') {
        const { data } = await authAPI.register(email, password);

        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data._id,
          email: data.email,
          username: data.username,
          isAdmin: data.isAdmin
        }));

        setCurrentUser({
          id: data._id,
          email: data.email,
          username: data.username,
          isAdmin: data.isAdmin
        });
        setShowLanding(false);
        setActiveTab('upload');
        showMessage(`Welcome ${email}!`, 'success');
      } else {
        const { data } = await authAPI.login(email, password);

        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data._id,
          email: data.email,
          username: data.username,
          isAdmin: data.isAdmin
        }));

        setCurrentUser({
          id: data._id,
          email: data.email,
          username: data.username,
          isAdmin: data.isAdmin
        });
        setShowLanding(false);
        setActiveTab('upload');
        showMessage(`Welcome back ${email}!`, 'success');
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'An error occurred';
      showMessage(errorMessage, 'error');
    }
  };

  return (
    <div className="page-load" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: `${font_size * 2}px` }}>
      <div style={{ position: 'relative', zIndex: 1, background: surface_color, borderRadius: `${font_size}px`, padding: `${font_size * 3}px`, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', maxWidth: '450px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: `${font_size * 2}px` }}>
          <div className={loading ? 'spinner' : ''} style={{ fontSize: `${font_size * 4}px`, marginBottom: `${font_size}px`, color: primary_action_color }}>
            <i className={loading ? 'fas fa-spinner' : 'fas fa-folder-open'}></i>
          </div>
          <h1 style={{ fontSize: `${font_size * 2}px`, fontWeight: 700, color: text_color, margin: `0 0 ${font_size * 0.5}px 0` }}>
            {authMode === 'signup' ? (
              <><i className="fas fa-user-plus" style={{ marginRight: `${font_size * 0.5}px` }}></i>{signup_title}</>
            ) : (
              <><i className="fas fa-sign-in-alt" style={{ marginRight: `${font_size * 0.5}px` }}></i>{login_title}</>
            )}
          </h1>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: `${font_size * 1.25}px` }}>
          <div>
            <label htmlFor="auth-email" style={{ display: 'block', fontSize: `${font_size * 0.875}px`, fontWeight: 600, color: text_color, marginBottom: `${font_size * 0.5}px` }}>
              <i className="fas fa-envelope" style={{ marginRight: `${font_size * 0.5}px`, color: primary_action_color }}></i>
              Email
            </label>
            <input
              type="email"
              id="auth-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="you@example.com"
              style={{ width: '100%', padding: `${font_size * 0.875}px`, border: `2px solid ${text_color}11`, borderRadius: `${font_size * 0.5}px`, fontSize: `${font_size}px`, color: text_color, outline: 'none', opacity: loading ? 0.6 : 1 }}
            />
          </div>
          <div>
            <label htmlFor="auth-password" style={{ display: 'block', fontSize: `${font_size * 0.875}px`, fontWeight: 600, color: text_color, marginBottom: `${font_size * 0.5}px` }}>
              <i className="fas fa-lock" style={{ marginRight: `${font_size * 0.5}px`, color: primary_action_color }}></i>
              Password
            </label>
            <input
              type="password"
              id="auth-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="••••••••"
              style={{ width: '100%', padding: `${font_size * 0.875}px`, border: `2px solid ${text_color}11`, borderRadius: `${font_size * 0.5}px`, fontSize: `${font_size}px`, color: text_color, outline: 'none', opacity: loading ? 0.6 : 1 }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: `${font_size}px`, border: 'none', borderRadius: `${font_size * 0.5}px`, fontSize: `${font_size * 1.125}px`, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', background: primary_action_color, color: '#ffffff', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Processing...' : (authMode === 'signup' ? 'Create Account' : 'Sign In')}
          </button>
        </form>
        <div style={{ marginTop: `${font_size * 2}px`, textAlign: 'center' }}>
          <button
            onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
            disabled={loading}
            style={{ border: 'none', background: 'transparent', color: primary_action_color, fontSize: `${font_size}px`, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', textDecoration: 'underline', opacity: loading ? 0.5 : 1 }}
          >
            {authMode === 'signup' ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
          </button>
        </div>
        <div style={{ marginTop: `${font_size}px`, textAlign: 'center' }}>
          <button
            onClick={() => setShowLanding(true)}
            disabled={loading}
            style={{ border: 'none', background: 'transparent', color: text_color, opacity: loading ? 0.3 : 0.6, fontSize: `${font_size * 0.875}px`, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            <i className="fas fa-arrow-left"></i> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;