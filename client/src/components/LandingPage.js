// src/components/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/select-company');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: '#f5f9fc'
    }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '12px' }}>
        Welcome to <span style={{ color: '#00dfd8' }}>DSAIntervAI</span>
      </h1>
      <p style={{ maxWidth: '700px', textAlign: 'center', fontSize: '18px', color: '#555' }}>
        This tool helps you practice real-world coding interviews. <br />
        You'll receive a random question, and you'll be expected to:
        <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '20px auto', lineHeight: '1.6' }}>
          <li>Explain your thought process verbally (we'll record it)</li>
          <li>Write code in the editor</li>
          <li>Timer will track your interview duration</li>
          <li>AI will analyze both your code and explanation</li>
        </ul>
      </p>

      <button
        onClick={handleStart}
        style={{
          marginTop: '20px',
          padding: '14px 28px',
          fontSize: '16px',
          background: 'linear-gradient(to right, #007cf0, #00dfd8)',
          border: 'none',
          color: 'white',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        Start Practicing
      </button>
    </div>
  );
};

export default LandingPage;
