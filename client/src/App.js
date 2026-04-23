import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import {
  MdDashboard,
  MdLogout,
  MdSettings,
  MdLightMode,
  MdDarkMode
} from 'react-icons/md';
import LandingPage from './components/LandingPage';
import CompanySelector from './components/CompanySelector';
import SolvePage from './components/SolvePage';
import FinalData from './components/FinalData';
import ScoreCard from './components/ScoreCard';
import FAQPage from './components/FAQPage';
import InterviewTipsPage from './components/InterviewTipsPage';
import FeedbackPage from './components/FeedbackPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

// Header component with conditional rendering
function Header() {
  const location = useLocation();
  const hideOnSolvePage = location.pathname === '/' || location.pathname === '/solve';
  const hideOnAuthPages = location.pathname === '/login' || location.pathname === '/register';

  return !hideOnSolvePage && !hideOnAuthPages ? (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Left side - Logo */}
        <h1 className="logo" style={{ margin: 0 }}>
          DSA<span>IntervAI</span>
        </h1>
        
        {/* Right side - User Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <UserAvatar />
        </div>
      </div>
    </header>
  ) : null;
}

// Compact user avatar component for header
function UserAvatar() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [appearanceDropdownOpen, setAppearanceDropdownOpen] = useState(false);
  const avatarRef = useRef(null);
  const appearanceDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown and appearance dropdown
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setShowDropdown(false);
        setAppearanceDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div style={{ position: 'relative' }} ref={avatarRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'var(--accent-gradient)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: '600',
          transition: 'var(--transition-fast)',
          boxShadow: '0 2px 8px var(--shadow-light)'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        {user.name?.charAt(0)?.toUpperCase() || 'U'}
      </button>
      
      {/* Dropdown Menu */}
      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          marginTop: '8px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-secondary)',
          borderRadius: '12px',
          boxShadow: '0 8px 24px var(--shadow-heavy)',
          minWidth: '200px',
          zIndex: 1000,
          overflow: 'visible'
        }}>
          {/* User Info */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid var(--border-secondary)',
            background: 'var(--bg-tertiary)'
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '4px'
            }}>
              {user.name}
            </div>
            <div style={{
              fontSize: '14px',
              color: 'var(--text-secondary)'
            }}>
              {user.email}
            </div>
          </div>
          
          {/* Menu Items */}
          <div style={{ padding: '8px' }}>
            <button
              onClick={() => {
                navigate('/dashboard');
                setShowDropdown(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'var(--transition-fast)',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--hover-bg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
              }}
            >
              <MdDashboard size={16} style={{ color: 'var(--text-primary)' }} />
              Dashboard
            </button>
            
            {/* Appearance Dropdown */}
            <div style={{ position: 'relative' }} ref={appearanceDropdownRef}>
              <button
                onClick={() => setAppearanceDropdownOpen(!appearanceDropdownOpen)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'var(--transition-fast)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                }}
              >
                <MdSettings size={16} style={{ color: 'var(--text-primary)' }} />
                Appearance
                <span style={{ marginLeft: 'auto', fontSize: '12px' }}>
                  {appearanceDropdownOpen ? '▲' : '▼'}
                </span>
              </button>
              
              {/* Appearance Submenu */}
              {appearanceDropdownOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    marginTop: '4px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px var(--shadow-heavy)',
                    minWidth: '150px',
                    zIndex: 1001,
                    overflow: 'visible',
                    padding: '8px 0'
                  }}
                >
                  <button
                    onClick={() => {
                      if (isDarkMode) toggleTheme();
                      setAppearanceDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: !isDarkMode ? 'var(--hover-bg)' : 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderRadius: '0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'var(--transition-fast)',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--hover-bg)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = !isDarkMode ? 'var(--hover-bg)' : 'none';
                    }}
                  >
                    <MdLightMode size={16} style={{ color: 'var(--text-primary)' }} />
                    Light
                    {!isDarkMode && <span style={{ marginLeft: 'auto', color: 'var(--accent-primary)' }}>✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      if (!isDarkMode) toggleTheme();
                      setAppearanceDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: isDarkMode ? 'var(--hover-bg)' : 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderRadius: '0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'var(--transition-fast)',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--hover-bg)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = isDarkMode ? 'var(--hover-bg)' : 'none';
                    }}
                  >
                    <MdDarkMode size={16} style={{ color: 'var(--text-primary)' }} />
                    Dark
                    {isDarkMode && <span style={{ marginLeft: 'auto', color: 'var(--accent-primary)' }}>✓</span>}
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={() => {
                logout();
                setShowDropdown(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'var(--transition-fast)',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--error-bg)';
                e.target.style.color = 'var(--error)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = 'var(--text-primary)';
              }}
            >
              <MdLogout size={16} style={{ color: 'var(--text-primary)' }} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [, setQuestion] = useState(null);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/select-company"
              element={
                <ProtectedRoute>
                  <div className="container">
                    <h2>Which company do you want to practice for?</h2>
                    <CompanySelector setQuestion={setQuestion} />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/solve" 
              element={
                <ProtectedRoute>
                  <SolvePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/final-data" 
              element={
                <ProtectedRoute>
                  <FinalData />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/scorecard" 
              element={
                <ProtectedRoute>
                  <ScoreCard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/interview-tips" element={<InterviewTipsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;