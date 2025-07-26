import React from 'react';
import { useNavigate } from 'react-router-dom';

function QuestionDisplay({ question }) {
  const navigate = useNavigate();

  const handleSolve = () => {
    localStorage.setItem('leetcodeLink', question.link);
    navigate('/solve');
  };

  if (!question) return null;

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>Here’s a random question for you</h2>
      <button className="card-button" onClick={handleSolve}>
        {question.title}
        <span>&rarr;</span>
      </button>
    </div>
  );
}

export default QuestionDisplay;
