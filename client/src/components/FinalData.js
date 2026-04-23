import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function FinalData() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get all the data from localStorage
  const edgeCases = localStorage.getItem('edgeCases') || '';
  const bruteForce = localStorage.getItem('bruteForce') || '';
  const optimized = localStorage.getItem('optimized') || '';
  const userCode = localStorage.getItem('userCode') || '';
  const timeComplexity = localStorage.getItem('timeComplexity') || '';
  const spaceComplexity = localStorage.getItem('spaceComplexity') || '';
  const leetcodeLink = localStorage.getItem('leetcodeLink') || '';

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare data for AI evaluation
      const submissionData = {
        leetcodeLink,
        edgeCases,
        bruteForce,
        optimized,
        userCode,
        timeComplexity,
        spaceComplexity,
        timestamp: new Date().toISOString()
      };

      // Send to AI evaluation endpoint
      const response = await fetch(`${API_URL}/evaluate-submission-ollama`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate submission');
      }

      const evaluation = await response.json();
      
      // Store evaluation results and navigate to scorecard
      localStorage.setItem('evaluationResults', JSON.stringify(evaluation));
      navigate('/scorecard');
      
    } catch (error) {
      console.error('Error submitting for evaluation:', error);
      alert('Failed to submit for evaluation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30, fontSize: 14, color: 'var(--text-secondary)', transition: 'var(--transition-normal)' }}>
        <span>Time Complexity: <strong>{timeComplexity || '---'}</strong></span>
        <span>Space Complexity: <strong>{spaceComplexity || '---'}</strong></span>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: 15, transition: 'var(--transition-normal)' }}>Edge Cases Considered</h3>
        <div className="theme-card" style={{ 
          minHeight: 60,
          color: 'var(--text-secondary)',
          transition: 'var(--transition-normal)'
        }}>
          {edgeCases || 'No edge cases recorded.'}
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: 15, transition: 'var(--transition-normal)' }}>Brute Force Approach</h3>
        <div className="theme-card" style={{ 
          minHeight: 60,
          color: 'var(--text-secondary)',
          transition: 'var(--transition-normal)'
        }}>
          {bruteForce || 'No brute force explanation recorded.'}
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: 15, transition: 'var(--transition-normal)' }}>Optimized Solution & Data Structures</h3>
        <div className="theme-card" style={{ 
          minHeight: 60,
          color: 'var(--text-secondary)',
          transition: 'var(--transition-normal)'
        }}>
          {optimized || 'No optimized solution explanation recorded.'}
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: 15, transition: 'var(--transition-normal)' }}>Final Code</h3>
        <div className="theme-card" style={{ 
          fontFamily: 'monospace',
          fontSize: 14,
          minHeight: 100,
          whiteSpace: 'pre-wrap',
          color: 'var(--text-secondary)',
          transition: 'var(--transition-normal)'
        }}>
          {userCode || '// No code submitted.'}
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 15,
        marginTop: 40,
        marginBottom: 40
      }}>
        <button
          onClick={() => navigate('/solve')}
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            border: '1px solid var(--border-tertiary)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'var(--transition-fast)',
          }}
        >
          Back to Practice
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="theme-button"
          style={{
            padding: '12px 32px',
            fontSize: 16,
            opacity: isSubmitting ? 0.6 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Evaluating...' : 'Get Feedback'}
        </button>
      </div>
    </div>
  );
}

export default FinalData;