import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdMoreVert,
  MdHelpOutline,
  MdLightbulbOutline,
  MdFeedback
} from 'react-icons/md';

const LandingPage = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleStart = () => {
    navigate('/select-company');
  };

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#fff', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 40px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'sticky', top: 0, background: '#fff', zIndex: 999 }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', margin: 0 }}>DSA<span style={{ background: 'linear-gradient(90deg,#007cf0,#00dfd8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IntervAI</span></h1>
        <div style={{ position: 'absolute', right: '40px' }}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <MdMoreVert size={28} color="#444" />
          </button>
          {dropdownOpen && (
            <ul style={{ position: 'absolute', top: '40px', right: 0, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px', listStyle: 'none', padding: '8px 0', margin: 0, minWidth: '180px' }}>
              <li onClick={() => navigate('/faq')} style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MdHelpOutline size={20} /> FAQ
              </li>
              <li onClick={() => navigate('/interview-tips')} style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MdLightbulbOutline size={20} /> Interview Tips
              </li>
              <li onClick={() => navigate('/feedback')} style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MdFeedback size={20} /> Send Feedback
              </li>
            </ul>
          )}
        </div>
      </header>

      {/* Hero Section */}
<section style={{ padding: '100px 20px 60px', textAlign: 'center' }}>
  <h1 style={{ fontSize: '38px', fontWeight: 700, color: '#111', marginBottom: '50px' }}>
    Practice for your next DSA interview
  </h1>
  <p style={{ fontSize: '17px', color: '#666', maxWidth: '540px', margin: '0 auto 20px' }}>
    Think out loud. Write code. Get fast, smart AI-powered feedback.
  </p>
  <p style={{
    fontSize: '17px',
    fontWeight: 500,
    background: 'linear-gradient(to right, #007cf0, #00dfd8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    maxWidth: '500px',
    margin: '0 auto 50px'
  }}>
    Just like a real interview.
  </p>
  <button
    onClick={handleStart}
    style={{
      padding: '16px 36px',
      fontSize: '18px',
      background: 'linear-gradient(to right, #007cf0, #00dfd8)',
      border: 'none',
      borderRadius: '10px',
      color: '#fff',
      fontWeight: '600',
      cursor: 'pointer'
    }}
  >
    Start Practicing
  </button>
</section>

  <section style={{ padding: '80px 20px', backgroundColor: '#f9fafb' }}>
  <h2 style={{
    textAlign: 'center',
    fontSize: '30px',
    marginBottom: '50px',
    fontWeight: 700,
    color: '#111'
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
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '30px 20px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          transform: 'translateY(20px)',
          opacity: 0,
          animation: `fadeInUp 0.6s ease ${idx * 0.2}s forwards`
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: 600, background: 'linear-gradient(to right, #007cf0, #00dfd8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent', marginBottom: '14px' }}>{title}</h3>
        <p style={{ color: '#444', fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>{desc}</p>
        <div style={{
          backgroundColor: '#dededeff',
          borderRadius: '10px',
          padding: '14px',
          fontSize: '14px',
          color: '#333',
          fontStyle: 'italic',
          minHeight: '350px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
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

      <footer style={{ marginTop: '20px', textAlign: 'center', padding: '20px', fontSize: '14px', color: '#888' }}>
        © {new Date().getFullYear()} DSAIntervAI.
      </footer>
    </div>
  );
};

export default LandingPage;
