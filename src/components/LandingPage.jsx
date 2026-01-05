import { useState } from 'react';
import logo from '../assets/logo.PNG';

function LandingPage({ config, onGetStarted, onSignIn, showAdminAuth, setShowAdminAuth, setShowAdmin }) {
  const { surface_color, text_color, primary_action_color, font_size, portfolio_title, subtitle } = config;
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState('');

  const handleAdminAccess = (e) => {
    e.preventDefault();
    if (codeInput === config.admin_code) {
      setShowAdmin(true);
      setShowAdminAuth(false);
      setCodeInput('');
      setError('');
    } else {
      setError('Invalid admin code');
      setCodeInput('');
    }
  };

  return (
    <>
      {showAdminAuth && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: `${font_size * 2}px`
          }}
          onClick={() => {
            setShowAdminAuth(false);
            setCodeInput('');
            setError('');
          }}
        >
          <div
            className="fade-in"
            style={{
              background: surface_color,
              borderRadius: `${font_size}px`,
              padding: `${font_size * 3}px`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              maxWidth: '400px',
              width: '100%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: `${font_size * 2}px` }}>
              <div style={{ fontSize: `${font_size * 4}px`, color: config.secondary_action_color, marginBottom: `${font_size}px` }}>
                <i className="fas fa-user-shield"></i>
              </div>
              <h2 style={{ fontSize: `${font_size * 1.75}px`, fontWeight: 700, color: text_color, margin: 0 }}>
                Admin Access
              </h2>
              <p style={{ fontSize: `${font_size}px`, color: text_color, opacity: 0.7, margin: `${font_size * 0.5}px 0 0 0` }}>
                <i className="fas fa-lock" style={{ marginRight: `${font_size * 0.5}px` }}></i>
                Enter 5-digit code
              </p>
            </div>
            <form onSubmit={handleAdminAccess}>
              <input
                type="password"
                value={codeInput}
                onChange={(e) => { setCodeInput(e.target.value); setError(''); }}
                maxLength="5"
                placeholder="•••••"
                autoFocus
                style={{
                  width: '100%',
                  padding: `${font_size * 1.25}px`,
                  border: `2px solid ${error ? '#ef4444' : text_color + '22'}`,
                  borderRadius: `${font_size * 0.5}px`,
                  fontSize: `${font_size * 2}px`,
                  textAlign: 'center',
                  letterSpacing: '8px',
                  fontWeight: 700,
                  color: text_color,
                  outline: 'none',
                  marginBottom: `${font_size}px`
                }}
              />
              {error && (
                <div style={{
                  padding: `${font_size * 0.75}px`,
                  background: '#fee2e2',
                  color: '#991b1b',
                  borderRadius: `${font_size * 0.5}px`,
                  marginBottom: `${font_size}px`,
                  fontSize: `${font_size * 0.875}px`,
                  fontWeight: 600,
                  textAlign: 'center'
                }}>
                  <i className="fas fa-exclamation-triangle"></i> {error}
                </div>
              )}
              <div style={{ display: 'flex', gap: `${font_size * 0.75}px` }}>
                <button
                  type="button"
                  onClick={() => { setShowAdminAuth(false); setCodeInput(''); setError(''); }}
                  style={{
                    flex: 1,
                    padding: `${font_size}px`,
                    border: `2px solid ${text_color}22`,
                    borderRadius: `${font_size * 0.5}px`,
                    fontSize: `${font_size}px`,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: 'transparent',
                    color: text_color
                  }}
                >
                  <i className="fas fa-times"></i> Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: `${font_size}px`,
                    border: 'none',
                    borderRadius: `${font_size * 0.5}px`,
                    fontSize: `${font_size}px`,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: config.secondary_action_color,
                    color: '#ffffff',
                    boxShadow: `0 4px 12px ${config.secondary_action_color}44`
                  }}
                >
                  <i className="fas fa-check"></i> Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="page-load" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <section style={{
          position: 'relative',
          padding: `${font_size * 5}px ${font_size * 2}px`,
          overflow: 'hidden',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div
            className="pulse-bg"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
              background: primary_action_color,
              borderRadius: '50%',
              filter: 'blur(120px)',
              zIndex: 0
            }}
          ></div>
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', textAlign: 'center' }}>
            <div className="float" style={{ marginBottom: `${font_size * 2}px`, display: 'flex', justifyContent: 'center' }}>
              <img
                src={logo}
                alt="His Amazing Grace Logo"
                style={{
                  width: `${font_size * 8}px`,
                  height: `${font_size * 8}px`,
                  objectFit: 'contain',
                  borderRadius: '50%',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }}
              />
            </div>
            <h1
              className="fade-in"
              style={{
                fontSize: `${font_size * 3.5}px`,
                fontWeight: 800,
                color: text_color,
                margin: `0 0 ${font_size * 1.5}px 0`,
                lineHeight: 1.2
              }}
            >
              {portfolio_title}
            </h1>
            <p
              className="fade-in"
              style={{
                fontSize: `${font_size * 1.25}px`,
                color: text_color,
                opacity: 0.8,
                margin: `0 0 ${font_size * 2.5}px 0`,
                lineHeight: 1.6
              }}
            >
              <i className="fas fa-check-circle" style={{ color: primary_action_color, marginRight: `${font_size * 0.5}px` }}></i>
              {subtitle} - Upload, organize, and find your files in seconds.
            </p>
            <div style={{ display: 'flex', gap: `${font_size}px`, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={onGetStarted}
                className="btn-primary"
                style={{
                  padding: `${font_size * 1.125}px ${font_size * 2.25}px`,
                  border: 'none',
                  borderRadius: `${font_size * 0.75}px`,
                  fontSize: `${font_size * 1.25}px`,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: primary_action_color,
                  color: '#ffffff',
                  boxShadow: `0 8px 24px ${primary_action_color}66`
                }}
              >
                <i className="fas fa-rocket" style={{ marginRight: `${font_size * 0.5}px` }}></i>
                Get Started
                <i className="fas fa-arrow-right" style={{ marginLeft: `${font_size * 0.5}px` }}></i>
              </button>
              <button
                onClick={onSignIn}
                style={{
                  padding: `${font_size * 1.125}px ${font_size * 2.25}px`,
                  border: `2px solid ${text_color}33`,
                  borderRadius: `${font_size * 0.75}px`,
                  fontSize: `${font_size * 1.25}px`,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: 'transparent',
                  color: text_color,
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-sign-in-alt" style={{ marginRight: `${font_size * 0.5}px` }}></i> Sign In
              </button>
            </div>
          </div>
        </section>

        <section style={{ padding: `${font_size * 5}px ${font_size * 2}px`, background: surface_color }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: `${font_size * 3}px`,
              fontWeight: 800,
              color: text_color,
              textAlign: 'center',
              marginBottom: `${font_size * 4}px`
            }}>
              <i className="fas fa-star" style={{ color: primary_action_color, marginRight: `${font_size * 0.5}px` }}></i>
              Why Choose Document Portfolio?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: `${font_size * 2}px` }}>
              <div
                className="document-card"
                style={{
                  background: config.background_color,
                  borderRadius: `${font_size}px`,
                  padding: `${font_size * 2}px`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: `${font_size * 3.5}px`, color: primary_action_color, marginBottom: `${font_size}px` }}>
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <h3 style={{ fontSize: `${font_size * 1.5}px`, fontWeight: 700, color: text_color, marginBottom: `${font_size * 0.75}px` }}>
                  Easy Upload
                </h3>
                <p style={{ fontSize: `${font_size}px`, color: text_color, opacity: 0.7, lineHeight: 1.6, margin: 0 }}>
                  Drag and drop your files or click to browse. Upload multiple documents at once.
                </p>
              </div>
              <div
                className="document-card"
                style={{
                  background: config.background_color,
                  borderRadius: `${font_size}px`,
                  padding: `${font_size * 2}px`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: `${font_size * 3.5}px`, color: config.secondary_action_color, marginBottom: `${font_size}px` }}>
                  <i className="fas fa-search"></i>
                </div>
                <h3 style={{ fontSize: `${font_size * 1.5}px`, fontWeight: 700, color: text_color, marginBottom: `${font_size * 0.75}px` }}>
                  Smart Search
                </h3>
                <p style={{ fontSize: `${font_size}px`, color: text_color, opacity: 0.7, lineHeight: 1.6, margin: 0 }}>
                  Find your documents instantly with powerful search and filtering options.
                </p>
              </div>
              <div
                className="document-card"
                style={{
                  background: config.background_color,
                  borderRadius: `${font_size}px`,
                  padding: `${font_size * 2}px`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: `${font_size * 3.5}px`, color: '#10b981', marginBottom: `${font_size}px` }}>
                  <i className="fas fa-users"></i>
                </div>
                <h3 style={{ fontSize: `${font_size * 1.5}px`, fontWeight: 700, color: text_color, marginBottom: `${font_size * 0.75}px` }}>
                  Share & Collaborate
                </h3>
                <p style={{ fontSize: `${font_size}px`, color: text_color, opacity: 0.7, lineHeight: 1.6, margin: 0 }}>
                  View documents from other users and collaborate seamlessly.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer style={{ padding: `${font_size * 2}px`, textAlign: 'center', background: text_color, color: surface_color }}>
          <div style={{ marginBottom: `${font_size * 1.5}px` }}>
            <button
              onClick={() => setShowAdminAuth(true)}
              className="btn-primary"
              style={{
                padding: `${font_size * 0.875}px ${font_size * 1.75}px`,
                border: 'none',
                borderRadius: `${font_size * 0.75}px`,
                fontSize: `${font_size}px`,
                fontWeight: 600,
                cursor: 'pointer',
                background: config.secondary_action_color,
                color: '#ffffff',
                boxShadow: `0 6px 20px ${config.secondary_action_color}66`
              }}
            >
              <i className="fas fa-user-shield" style={{ marginRight: `${font_size * 0.5}px` }}></i> Admin Dashboard
            </button>
          </div>
          <p style={{ fontSize: `${font_size}px`, margin: 0, opacity: 0.8 }}>
            <i className="fas fa-copyright" style={{ marginRight: `${font_size * 0.25}px` }}></i>
            2026 Document Portfolio. Built with <i className="fas fa-heart" style={{ color: '#ef4444' }}></i>
          </p>
        </footer>
      </div>
    </>
  );
}

export default LandingPage;