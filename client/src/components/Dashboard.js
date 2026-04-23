import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiCalendar, FiTrendingUp, FiTarget } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '8px', transition: 'var(--transition-normal)' }}>
          Welcome to your Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', transition: 'var(--transition-normal)' }}>
          Track your progress and manage your practice sessions
        </p>
      </div>

      {/* User Info Card */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-secondary)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        boxShadow: '0 4px 12px var(--shadow-medium)',
        transition: 'var(--transition-normal)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: '600'
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 style={{
              margin: '0 0 4px 0',
              color: 'var(--text-primary)',
              fontSize: '24px',
              fontWeight: '600',
              transition: 'var(--transition-normal)'
            }}>
              {user?.name || 'User'}
            </h2>
            <p style={{
              margin: '0',
              color: 'var(--text-secondary)',
              fontSize: '16px',
              transition: 'var(--transition-normal)'
            }}>
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-secondary)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 2px 8px var(--shadow-light)',
          transition: 'var(--transition-normal)'
        }}>
          <FiTarget style={{
            fontSize: '32px',
            color: 'var(--accent-primary)',
            marginBottom: '12px'
          }} />
          <h3 style={{
            margin: '0 0 8px 0',
            color: 'var(--text-primary)',
            fontSize: '18px',
            fontWeight: '600',
            transition: 'var(--transition-normal)'
          }}>
            Practice Sessions
          </h3>
          <p style={{
            margin: '0',
            color: 'var(--text-secondary)',
            fontSize: '24px',
            fontWeight: '700',
            transition: 'var(--transition-normal)'
          }}>
            0
          </p>
        </div>

        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-secondary)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 2px 8px var(--shadow-light)',
          transition: 'var(--transition-normal)'
        }}>
          <FiTrendingUp style={{
            fontSize: '32px',
            color: 'var(--success)',
            marginBottom: '12px'
          }} />
          <h3 style={{
            margin: '0 0 8px 0',
            color: 'var(--text-primary)',
            fontSize: '18px',
            fontWeight: '600',
            transition: 'var(--transition-normal)'
          }}>
            Average Score
          </h3>
          <p style={{
            margin: '0',
            color: 'var(--text-secondary)',
            fontSize: '24px',
            fontWeight: '700',
            transition: 'var(--transition-normal)'
          }}>
            N/A
          </p>
        </div>

        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-secondary)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 2px 8px var(--shadow-light)',
          transition: 'var(--transition-normal)'
        }}>
          <FiCalendar style={{
            fontSize: '32px',
            color: 'var(--accent-secondary)',
            marginBottom: '12px'
          }} />
          <h3 style={{
            margin: '0 0 8px 0',
            color: 'var(--text-primary)',
            fontSize: '18px',
            fontWeight: '600',
            transition: 'var(--transition-normal)'
          }}>
            Days Active
          </h3>
          <p style={{
            margin: '0',
            color: 'var(--text-secondary)',
            fontSize: '24px',
            fontWeight: '700',
            transition: 'var(--transition-normal)'
          }}>
            1
          </p>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div style={{
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-secondary)',
        borderRadius: '16px',
        padding: '32px',
        textAlign: 'center',
        boxShadow: '0 4px 12px var(--shadow-medium)',
        transition: 'var(--transition-normal)'
      }}>
        <FiUser style={{
          fontSize: '48px',
          color: 'var(--text-muted)',
          marginBottom: '16px'
        }} />
        <h3 style={{
          margin: '0 0 12px 0',
          color: 'var(--text-primary)',
          fontSize: '20px',
          fontWeight: '600',
          transition: 'var(--transition-normal)'
        }}>
          Dashboard Features Coming Soon
        </h3>
        <p style={{
          margin: '0',
          color: 'var(--text-secondary)',
          fontSize: '16px',
          lineHeight: '1.5',
          transition: 'var(--transition-normal)'
        }}>
          We're working on adding detailed analytics, progress tracking, and personalized recommendations to help you improve your coding interview skills.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;



