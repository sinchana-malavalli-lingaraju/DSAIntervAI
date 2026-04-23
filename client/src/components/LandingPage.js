import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdMoreVert,
  MdHelpOutline,
  MdLightbulbOutline,
  MdFeedback,
  MdSettings,
  MdLightMode,
  MdDarkMode,
  MdDashboard,
  MdLogout
} from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import DarkModeToggle from './DarkModeToggle';

const LandingPage = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [appearanceDropdownOpen, setAppearanceDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const profileDropdownRef = useRef(null);
  const mainDropdownRef = useRef(null);
  const appearanceDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown and appearance dropdown
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
        setAppearanceDropdownOpen(false);
      }
      
      // Close main menu dropdown
      if (mainDropdownRef.current && !mainDropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStart = () => {
    if (isAuthenticated) {
    navigate('/select-company');
    } else {
      navigate('/login');
    }
  };


  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', color: 'var(--text-secondary)', transition: 'var(--transition-normal)' }}>
      {/* Top Navbar */}
      <header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 40px', boxShadow: '0 2px 8px var(--shadow-light)', position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 999, transition: 'var(--transition-normal)' }}>
        {/* Center - Logo */}
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>DSA<span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IntervAI</span></h1>
        
        {/* Right side - Profile Avatar and menu */}
        <div style={{ position: 'absolute', right: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Profile Avatar for authenticated users */}
          {isAuthenticated && (
            <div style={{ position: 'relative' }} ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
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
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </button>
              
              {/* Profile Dropdown */}
              {profileDropdownOpen && (
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
                      {user?.name || 'User'}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)'
                    }}>
                      {user?.email || 'user@example.com'}
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div style={{ padding: '8px' }}>
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setProfileDropdownOpen(false);
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
                        setProfileDropdownOpen(false);
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
          )}
          
          {/* Dark Mode Toggle for unauthenticated users */}
          {!isAuthenticated && <DarkModeToggle size={24} />}
          
          <div style={{ position: 'relative' }} ref={mainDropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              padding: '8px', 
              borderRadius: '8px', 
              color: 'var(--text-secondary)', 
              transition: 'var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <MdMoreVert size={28} />
          </button>
          {dropdownOpen && (
            <ul className="theme-dropdown" style={{ position: 'absolute', top: '40px', right: 0 }}>
                <li onClick={() => {
                  navigate('/faq');
                  setDropdownOpen(false);
                }} style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MdHelpOutline size={20} /> FAQ
              </li>
                <li onClick={() => {
                  navigate('/interview-tips');
                  setDropdownOpen(false);
                }} style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MdLightbulbOutline size={20} /> Interview Tips
              </li>
                <li onClick={() => {
                  navigate('/feedback');
                  setDropdownOpen(false);
                }} style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MdFeedback size={20} /> Send Feedback
              </li>
            </ul>
          )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
<section style={{ padding: '100px 20px 60px', textAlign: 'center' }}>
  <h1 style={{ fontSize: '38px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '50px', transition: 'var(--transition-normal)' }}>
    {isAuthenticated ? `Welcome back, ${user?.name}!` : 'Practice for your next DSA interview'}
  </h1>
  <p style={{ fontSize: '17px', color: 'var(--text-tertiary)', maxWidth: '540px', margin: '0 auto 20px', transition: 'var(--transition-normal)' }}>
    Think out loud. Write code. Get fast, smart AI-powered feedback.
  </p>
  <p style={{
    fontSize: '17px',
    fontWeight: 500,
    background: 'var(--accent-gradient)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    maxWidth: '500px',
    margin: '0 auto 50px'
  }}>
    Just like a real interview.
  </p>
  
  {isAuthenticated ? (
  <button
    onClick={handleStart}
    className="theme-button"
    style={{
      padding: '16px 36px',
      fontSize: '18px'
    }}
  >
    Start Practicing
  </button>
  ) : (
    <button
      onClick={() => navigate('/register')}
      className="theme-button"
      style={{
        padding: '16px 36px',
        fontSize: '18px'
      }}
    >
      Sign Up
    </button>
  )}
</section>

  <section style={{ padding: '80px 20px', backgroundColor: 'var(--bg-tertiary)', transition: 'var(--transition-normal)' }}>
  <h2 style={{
    textAlign: 'center',
    fontSize: '30px',
    marginBottom: '50px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    transition: 'var(--transition-normal)'
  }}>
    How it works
  </h2>

  <div style={{
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '40px'
  }}>
    {[
      {
       title: 'Select Company',
        desc: 'Choose the company you’re preparing for and get a curated question from LeetCode.',
        demo: 'Demo'
      },
      {
        title: 'Set your own timer',
        desc: 'Based on the company you’re prepping for, set the timer that best reflects your interview duration.',
        demo: 'Demo'
      },
      {
        title: 'Speak',
        desc: 'Explain your approach aloud: edge cases → brute force → optimized logic',
        demo: 'Demo'
      },
      {
        title: 'Code',
        desc: 'Write your solution in a plain text editor—just like an actual interview.',
        demo: 'Demo'
      },
      {
        title: 'Get AI Feedback',
        desc: 'Receive detailed AI feedback on logic, explanation clarity, and code.',
        demo: 'Demo'
      }
    ].map(({ title, desc, demo }, idx) => (
      <div
        key={idx}
        className="theme-card"
        style={{
          transform: 'translateY(20px)',
          opacity: 0,
          animation: `fadeInUp 0.6s ease ${idx * 0.2}s forwards`
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: 600, background: 'var(--accent-gradient)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent', marginBottom: '14px' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6', marginBottom: '16px', transition: 'var(--transition-normal)' }}>{desc}</p>
        <div style={{
          backgroundColor: 'var(--bg-quaternary)',
          borderRadius: '10px',
          padding: '14px',
          fontSize: '14px',
          color: 'var(--text-tertiary)',
          fontStyle: 'italic',
          minHeight: '350px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border-secondary)',
          transition: 'var(--transition-normal)'
        }}>
          {demo}
        </div>
      </div>
    ))}
  </div>

  {/* Animation keyframes */}
  <style>
    {`
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}
  </style>
</section>

      <footer style={{ marginTop: '20px', textAlign: 'center', padding: '20px', fontSize: '14px', color: 'var(--text-quaternary)', transition: 'var(--transition-normal)' }}>
        © {new Date().getFullYear()} DSAIntervAI.
      </footer>
    </div>
  );
};

export default LandingPage;
