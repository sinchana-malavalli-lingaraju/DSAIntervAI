import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      const response = await fetch('http://localhost:3001/evaluate-submission-ollama', {
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
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: 30 }}>
        <span style={{ fontWeight: 600 }}>DSA</span>
        <span style={{ background: "linear-gradient(90deg,#007cf0,#00dfd8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          IntervAI
        </span>
      </h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30, fontSize: 14 }}>
        <span>Time Complexity: <strong>{timeComplexity || '---'}</strong></span>
        <span>Space Complexity: <strong>{spaceComplexity || '---'}</strong></span>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3 style={{ color: '#555', marginBottom: 15 }}>Edge Cases Considered</h3>
        <div style={{ 
          background: '#f8f9fa', 
          padding: 20, 
          borderRadius: 8, 
          border: '1px solid #e9ecef',
          minHeight: 60,
          color: '#666'
        }}>
          {edgeCases || 'No edge cases recorded.'}
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3 style={{ color: '#555', marginBottom: 15 }}>Brute Force Approach</h3>
        <div style={{ 
          background: '#f8f9fa', 
          padding: 20, 
          borderRadius: 8, 
          border: '1px solid #e9ecef',
          minHeight: 60,
          color: '#666'
        }}>
          {bruteForce || 'No brute force explanation recorded.'}
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3 style={{ color: '#555', marginBottom: 15 }}>Optimized Solution & Data Structures</h3>
        <div style={{ 
          background: '#f8f9fa', 
          padding: 20, 
          borderRadius: 8, 
          border: '1px solid #e9ecef',
          minHeight: 60,
          color: '#666'
        }}>
          {optimized || 'No optimized solution explanation recorded.'}
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3 style={{ color: '#555', marginBottom: 15 }}>Final Code</h3>
        <div style={{ 
          background: '#1e1e1e', 
          color: '#d4d4d4',
          padding: 20, 
          borderRadius: 8,
          fontFamily: 'monospace',
          fontSize: 14,
          minHeight: 100,
          whiteSpace: 'pre-wrap'
        }}>
          {userCode || '// No code submitted.'}
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 15,
        marginTop: 40 
      }}>
        <button
          onClick={() => navigate('/solve')}
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            border: '1px solid #ddd',
            background: '#fff',
            color: '#555',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Back to Practice
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            padding: '12px 32px',
            borderRadius: 8,
            border: 'none',
            background: isSubmitting 
              ? 'linear-gradient(to right, #99bfe9, #a7efe9)' 
              : 'linear-gradient(to right, #007cf0, #00dfd8)',
            color: '#fff',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          {isSubmitting ? 'Evaluating...' : 'Submit for AI Analysis'}
        </button>
      </div>
    </div>
  );
}

export default FinalData;