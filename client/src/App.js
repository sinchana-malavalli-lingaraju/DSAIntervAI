import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import CompanySelector from './components/CompanySelector';
import SolvePage from './components/SolvePage';
import FinalData from './components/FinalData';
import FAQPage from './components/FAQPage';
import InterviewTipsPage from './components/InterviewTipsPage';
import FeedbackPage from './components/FeedbackPage';
import './index.css';

// Header component with conditional rendering
function Header() {
  const location = useLocation();
  const hideOnSolvePage = location.pathname === '/' || location.pathname === '/solve';

  return !hideOnSolvePage ? (
    <header className="header">
      <h1 className="logo">
        DSA<span>IntervAI</span>
      </h1>
    </header>
  ) : null;
}

function App() {
  const [question, setQuestion] = useState(null);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/select-company"
          element={
            <div className="container">
              <h2>Which company do you want to practice for?</h2>
              <CompanySelector setQuestion={setQuestion} />
            </div>
          }
        />
        <Route path="/solve" element={<SolvePage />} />
        <Route path="/final-data" element={<FinalData />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/interview-tips" element={<InterviewTipsPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </Router>
  );
}

export default App;