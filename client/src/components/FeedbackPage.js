import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MdSend, MdCheckCircle, MdError } from 'react-icons/md';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const FeedbackPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
    rating: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          subject: '',
          message: '',
          rating: '',
          category: 'general'
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px',
      fontFamily: 'Segoe UI',
      color: 'var(--text-primary)',
      transition: 'var(--transition-normal)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          marginBottom: '16px',
          color: 'var(--text-primary)',
          transition: 'var(--transition-normal)'
        }}>
          Send Us Feedback
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'var(--text-secondary)',
          transition: 'var(--transition-normal)'
        }}>
          Help us improve DSAIntervAI by sharing your thoughts and suggestions
        </p>
      </div>

      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-secondary)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 8px 24px var(--shadow-medium)',
        transition: 'var(--transition-normal)'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                transition: 'var(--transition-normal)'
              }}>
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition-normal)',
                  boxSizing: 'border-box'
                }}
                placeholder="Your name"
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                transition: 'var(--transition-normal)'
              }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition-normal)',
                  boxSizing: 'border-box'
                }}
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                transition: 'var(--transition-normal)'
              }}>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition-normal)',
                  boxSizing: 'border-box'
                }}
              >
                <option value="general">General Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="ui">UI/UX Feedback</option>
                <option value="performance">Performance Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                transition: 'var(--transition-normal)'
              }}>
                Rating
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition-normal)',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select rating</option>
                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                <option value="4">⭐⭐⭐⭐ Good</option>
                <option value="3">⭐⭐⭐ Average</option>
                <option value="2">⭐⭐ Poor</option>
                <option value="1">⭐ Very Poor</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              transition: 'var(--transition-normal)'
            }}>
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid var(--border-primary)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                transition: 'var(--transition-normal)',
                boxSizing: 'border-box'
              }}
              placeholder="Brief description of your feedback"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              transition: 'var(--transition-normal)'
            }}>
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid var(--border-primary)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                transition: 'var(--transition-normal)',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              placeholder="Please provide detailed feedback about your experience with DSAIntervAI..."
            />
          </div>

          {submitStatus === 'success' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              borderRadius: '8px',
              marginBottom: '20px',
              color: 'var(--success)',
              fontSize: '14px'
            }}>
              <MdCheckCircle size={20} />
              Thank you for your feedback! We'll review it and get back to you soon.
            </div>
          )}

          {submitStatus === 'error' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'var(--error-bg)',
              border: '1px solid var(--error-border)',
              borderRadius: '8px',
              marginBottom: '20px',
              color: 'var(--error)',
              fontSize: '14px'
            }}>
              <MdError size={20} />
              Sorry, there was an error submitting your feedback. Please try again.
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: isSubmitting ? 'var(--text-muted)' : 'var(--accent-gradient)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'var(--transition-normal)',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Sending...
              </>
            ) : (
              <>
                <MdSend size={18} />
                Send Feedback
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;