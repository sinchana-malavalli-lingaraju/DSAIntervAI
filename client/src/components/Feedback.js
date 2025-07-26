import React from 'react';

const Feedback = () => {
  const userCode = localStorage.getItem('userCode');
  const explanation = localStorage.getItem('explanation');
  const timeComplexity = localStorage.getItem('timeComplexity');
  const spaceComplexity = localStorage.getItem('spaceComplexity');

  return (
    <div style={{ padding: '32px', fontFamily: 'Segoe UI' }}>
      <h2>📝 Interview Feedback</h2>
      <h4>Your Code:</h4>
      <pre style={{ background: '#f4f4f4', padding: '16px' }}>{userCode}</pre>
      
      <h4>Your Explanation:</h4>
      <p>{explanation}</p>

      <h4>⏱ Time Complexity:</h4>
      <p>{timeComplexity}</p>

      <h4>💾 Space Complexity:</h4>
      <p>{spaceComplexity}</p>
    </div>
  );
};

export default Feedback;
