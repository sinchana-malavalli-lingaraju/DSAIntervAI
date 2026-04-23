import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiHome, FiRefreshCw } from 'react-icons/fi';

function ScoreCard() {
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get evaluation results from localStorage
    const evaluationData = localStorage.getItem('evaluationResults');
    if (evaluationData) {
      setEvaluation(JSON.parse(evaluationData));
    } else {
      // Redirect back if no evaluation data found
      navigate('/final-data');
    }
    setLoading(false);
  }, [navigate]);

  const getScoreIcon = (score) => {
    if (score >= 80) return <FiCheckCircle color="#00c853" size={20} />;
    if (score >= 60) return <FiAlertTriangle color="#ff9800" size={20} />;
    return <FiXCircle color="#f44336" size={20} />;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#00c853';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  const getGradeText = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Needs Improvement';
    return 'Poor';
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: 50 }}>
        <div style={{ fontSize: 16, color: '#666' }}>Loading evaluation results...</div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: 50 }}>
        <div style={{ fontSize: 16, color: '#666' }}>No evaluation data found.</div>
        <button 
          onClick={() => navigate('/final-data')}
          style={{
            marginTop: 20,
            padding: '10px 20px',
            background: '#007cf0',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const overallScore = Math.round(evaluation.scores.reduce((sum, item) => sum + item.score, 0) / evaluation.scores.length);

  return (
    <div className="container" style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ color: 'white', fontWeight: 700, marginBottom: 0 }}>Report</h1>
      </div>

      {/* Overall Score */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: 30,
        borderRadius: 15,
        textAlign: 'center',
        marginBottom: 30,
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 10 }}>
          {overallScore}%
        </div>
        <div style={{ fontSize: 20, opacity: 0.9 }}>
          Overall Score - {getGradeText(overallScore)}
        </div>
      </div>

      {/* Detailed Scores */}
      <div style={{ marginBottom: 30 }}>
        <h3 style={{ marginBottom: 20, color: 'var(--text-primary)', transition: 'var(--transition-normal)' }}>Detailed Analysis</h3>
        {evaluation.scores.map((item, index) => (
          <div key={index} style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-secondary)',
            borderRadius: 10,
            padding: 20,
            marginBottom: 15,
            boxShadow: '0 2px 8px var(--shadow-light)',
            transition: 'var(--transition-normal)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 10 
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 10,
                fontWeight: 600,
                fontSize: 16,
                color: 'var(--text-primary)',
                transition: 'var(--transition-normal)'
              }}>
                {getScoreIcon(item.score)}
                {item.category}
              </div>
              <div style={{ 
                fontSize: 18, 
                fontWeight: 'bold',
                color: getScoreColor(item.score)
              }}>
                {item.score}%
              </div>
            </div>
            <div style={{ 
              color: 'var(--text-secondary)', 
              lineHeight: 1.5,
              fontSize: 14,
              transition: 'var(--transition-normal)'
            }}>
              {item.feedback}
            </div>
          </div>
        ))}
      </div>

      {/* AI General Feedback */}
      {evaluation.generalFeedback && (
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ marginBottom: 15, color: 'var(--text-primary)', transition: 'var(--transition-normal)' }}>Overall Feedback</h3>
          <div style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-secondary)',
            borderRadius: 10,
            padding: 20,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            transition: 'var(--transition-normal)'
          }}>
            {evaluation.generalFeedback}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 15,
        marginTop: 40,
        marginBottom: 40
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            border: '1px solid var(--border-tertiary)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'var(--transition-fast)'
          }}
        >
          <FiHome size={16} />
          Home
        </button>
        
        <button
          onClick={() => navigate('/select-company')}
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--accent-gradient)',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'var(--transition-fast)'
          }}
        >
          <FiRefreshCw size={16} />
          Practice Again
        </button>
      </div>
    </div>
  );
}

export default ScoreCard;