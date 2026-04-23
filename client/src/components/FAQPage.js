import React, { useState } from 'react';
import { 
  MdExpandMore, 
  MdExpandLess, 
  MdHelp, 
  MdCode, 
  MdAccountCircle, 
  MdSettings,
  MdSecurity,
  MdSpeed,
  MdQuestionAnswer
} from 'react-icons/md';

const FAQPage = () => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const faqCategories = [
    {
      id: 'general',
      title: 'General Questions',
      icon: <MdHelp size={24} style={{ color: 'var(--accent-primary)' }} />,
      questions: [
        {
          id: 'what-is-dsaintervai',
          question: 'What is DSAIntervAI?',
          answer: 'DSAIntervAI is an AI-powered platform that helps you practice for technical interviews. It provides real-time feedback on your problem-solving approach, code quality, and communication skills, simulating a real interview environment.'
        },
        {
          id: 'how-it-works',
          question: 'How does DSAIntervAI work?',
          answer: 'DSAIntervAI uses advanced AI to evaluate your interview performance. You select a company, solve a coding problem while thinking out loud, and receive detailed feedback on your approach, code quality, time/space complexity, and overall performance.'
        },
        {
          id: 'free-or-paid',
          question: 'Is DSAIntervAI free to use?',
          answer: 'Yes! DSAIntervAI is currently free to use. We believe in making interview preparation accessible to everyone. In the future, we may introduce premium features, but the core functionality will remain free.'
        },
        {
          id: 'browser-support',
          question: 'Which browsers are supported?',
          answer: 'DSAIntervAI works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of Chrome or Firefox.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Features',
      icon: <MdCode size={24} style={{ color: 'var(--accent-primary)' }} />,
      questions: [
        {
          id: 'supported-languages',
          question: 'What programming languages are supported?',
          answer: 'Currently, DSAIntervAI supports JavaScript, Python, Java, C++, and C#. We\'re working on adding more languages based on user feedback. The AI can understand and evaluate code in any of these languages.'
        },
        {
          id: 'ai-evaluation',
          question: 'How does the AI evaluation work?',
          answer: 'Our AI analyzes your problem-solving approach, code quality, time/space complexity analysis, and communication skills. It provides detailed feedback on each aspect and gives you an overall score with specific areas for improvement.'
        },
        {
          id: 'voice-recording',
          question: 'How does the voice recording feature work?',
          answer: 'DSAIntervAI uses your browser\'s speech recognition API to capture your thoughts as you solve problems. This helps evaluate your communication skills and problem-solving process, just like in a real interview.'
        },
        {
          id: 'offline-mode',
          question: 'Can I use DSAIntervAI offline?',
          answer: 'No, DSAIntervAI requires an internet connection to function. The AI evaluation and company-specific questions are processed on our servers to provide you with the most accurate feedback.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Usage',
      icon: <MdAccountCircle size={24} style={{ color: 'var(--accent-primary)' }} />,
      questions: [
        {
          id: 'create-account',
          question: 'Do I need to create an account?',
          answer: 'While you can browse some features without an account, creating an account allows you to save your progress, track your improvement over time, and access personalized recommendations.'
        },
        {
          id: 'data-privacy',
          question: 'Is my data private and secure?',
          answer: 'Yes, we take your privacy seriously. Your code and interview sessions are encrypted and stored securely. We never share your personal data with third parties without your explicit consent.'
        },
        {
          id: 'progress-tracking',
          question: 'Can I track my progress over time?',
          answer: 'Yes! With an account, you can view your performance history, see improvement trends, and identify areas where you need more practice. This helps you focus your preparation efforts effectively.'
        },
        {
          id: 'multiple-sessions',
          question: 'Can I have multiple practice sessions?',
          answer: 'Absolutely! You can practice as many times as you want. Each session is independent, and you can try different companies and problems to get varied experience.'
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <MdSettings size={24} style={{ color: 'var(--accent-primary)' }} />,
      questions: [
        {
          id: 'voice-not-working',
          question: 'My voice recording isn\'t working. What should I do?',
          answer: 'First, make sure your browser has permission to access your microphone. Check your browser settings and allow microphone access for this site. If the issue persists, try refreshing the page or using a different browser.'
        },
        {
          id: 'slow-performance',
          question: 'The application is running slowly. How can I fix this?',
          answer: 'Try refreshing the page or clearing your browser cache. Close other tabs that might be using a lot of memory. If the problem continues, try using a different browser or check your internet connection.'
        },
        {
          id: 'evaluation-errors',
          question: 'I\'m getting evaluation errors. What does this mean?',
          answer: 'Evaluation errors usually occur when there\'s a temporary issue with our AI service. Try refreshing the page and submitting again. If the problem persists, please contact our support team.'
        },
        {
          id: 'dark-mode-issues',
          question: 'Dark mode isn\'t working properly. How do I fix it?',
          answer: 'Try refreshing the page or clearing your browser\'s local storage. The dark mode preference is saved locally, so clearing it will reset to the default theme. You can then toggle it again from the profile menu.'
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: <MdSecurity size={24} style={{ color: 'var(--accent-primary)' }} />,
      questions: [
        {
          id: 'data-storage',
          question: 'Where is my data stored?',
          answer: 'Your data is stored on secure, encrypted servers. We use industry-standard security practices to protect your information. Your code and interview sessions are only accessible to you and our AI evaluation system.'
        },
        {
          id: 'data-deletion',
          question: 'Can I delete my data?',
          answer: 'Yes, you have full control over your data. You can delete individual practice sessions or your entire account at any time. When you delete your account, all your data is permanently removed from our servers.'
        },
        {
          id: 'third-party-sharing',
          question: 'Do you share my data with third parties?',
          answer: 'No, we do not share your personal data with third parties. Your interview sessions and code are used solely for providing you with feedback and improving our AI system. We never sell or share your personal information.'
        }
      ]
    }
  ];

  return (
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '40px 20px',
      fontFamily: 'Segoe UI',
      color: 'var(--text-primary)',
      transition: 'var(--transition-normal)'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: '700', 
          marginBottom: '16px',
          color: 'var(--text-primary)',
          transition: 'var(--transition-normal)'
        }}>
          Frequently Asked Questions
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          transition: 'var(--transition-normal)'
        }}>
          Find answers to common questions about DSAIntervAI
        </p>
      </div>

      {/* FAQ Categories */}
      <div style={{ marginBottom: '40px' }}>
        {faqCategories.map((category) => (
          <div key={category.id} style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-secondary)',
            borderRadius: '16px',
            marginBottom: '24px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px var(--shadow-light)',
            transition: 'var(--transition-normal)'
          }}>
            {/* Category Header */}
            <div style={{
              padding: '24px',
              background: 'var(--bg-tertiary)',
              borderBottom: '1px solid var(--border-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              {category.icon}
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                margin: 0,
                color: 'var(--text-primary)',
                transition: 'var(--transition-normal)'
              }}>
                {category.title}
              </h2>
            </div>

            {/* Questions */}
            <div style={{ padding: '0' }}>
              {category.questions.map((item, index) => (
                <div key={item.id} style={{
                  borderBottom: index < category.questions.length - 1 ? '1px solid var(--border-primary)' : 'none'
                }}>
                  <button
                    onClick={() => toggleItem(item.id)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      transition: 'var(--transition-normal)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--hover-bg)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'none';
                    }}
                  >
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      margin: 0,
                      color: 'var(--text-primary)',
                      transition: 'var(--transition-normal)',
                      flex: 1,
                      paddingRight: '16px'
                    }}>
                      {item.question}
                    </h3>
                    {expandedItems[item.id] ? 
                      <MdExpandLess size={20} style={{ color: 'var(--text-secondary)' }} /> : 
                      <MdExpandMore size={20} style={{ color: 'var(--text-secondary)' }} />
                    }
                  </button>
                  
                  {expandedItems[item.id] && (
                    <div style={{
                      padding: '0 24px 20px',
                      background: 'var(--bg-primary)',
                      transition: 'var(--transition-normal)'
                    }}>
                      <p style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        margin: 0,
                        color: 'var(--text-secondary)',
                        transition: 'var(--transition-normal)'
                      }}>
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div style={{
        background: 'var(--accent-gradient)',
        borderRadius: '16px',
        padding: '32px',
        textAlign: 'center',
        color: 'white'
      }}>
        <MdQuestionAnswer size={48} style={{ marginBottom: '16px' }} />
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          Still Have Questions?
        </h2>
        <p style={{
          fontSize: '16px',
          marginBottom: '24px',
          opacity: 0.9
        }}>
          Can't find what you're looking for? We're here to help!
        </p>
        <button
          onClick={() => window.location.href = '/feedback'}
          style={{
            padding: '12px 24px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'var(--transition-normal)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default FAQPage;