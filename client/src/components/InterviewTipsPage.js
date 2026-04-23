import React, { useState } from 'react';
import { 
  MdLightbulb, 
  MdCode, 
  MdTimer, 
  MdPsychology, 
  MdQuestionAnswer,
  MdCheckCircle,
  MdWarning,
  MdExpandMore,
  MdExpandLess
} from 'react-icons/md';

const InterviewTipsPage = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const tipSections = [
    {
      id: 'preparation',
      title: 'Pre-Interview Preparation',
      icon: <MdLightbulb size={24} style={{ color: 'var(--accent-primary)' }} />,
      tips: [
        {
          title: 'Research the Company',
          content: 'Understand the company\'s mission, values, products, and recent news. This shows genuine interest and helps you tailor your responses.',
          type: 'success'
        },
        {
          title: 'Practice Common Questions',
          content: 'Prepare for behavioral questions using the STAR method (Situation, Task, Action, Result). Practice explaining your projects and achievements.',
          type: 'success'
        },
        {
          title: 'Review Job Description',
          content: 'Analyze the job requirements and prepare examples that demonstrate your relevant skills and experience.',
          type: 'success'
        },
        {
          title: 'Prepare Questions to Ask',
          content: 'Have 3-5 thoughtful questions ready about the role, team, company culture, or growth opportunities.',
          type: 'success'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Interview Tips',
      icon: <MdCode size={24} style={{ color: 'var(--accent-primary)' }} />,
      tips: [
        {
          title: 'Think Out Loud',
          content: 'Always verbalize your thought process. Explain your approach, assumptions, and reasoning as you solve problems.',
          type: 'success'
        },
        {
          title: 'Start with Brute Force',
          content: 'Begin with a simple solution, then optimize. This shows systematic thinking and problem-solving skills.',
          type: 'success'
        },
        {
          title: 'Ask Clarifying Questions',
          content: 'Don\'t assume requirements. Ask about input constraints, edge cases, and expected output format.',
          type: 'success'
        },
        {
          title: 'Test Your Solution',
          content: 'Walk through your code with example inputs. Check for edge cases and potential bugs.',
          type: 'success'
        },
        {
          title: 'Discuss Time/Space Complexity',
          content: 'Always analyze and communicate the Big O complexity of your solution. Be prepared to optimize if asked.',
          type: 'success'
        }
      ]
    },
    {
      id: 'timing',
      title: 'Time Management',
      icon: <MdTimer size={24} style={{ color: 'var(--accent-primary)' }} />,
      tips: [
        {
          title: 'Allocate Time Wisely',
          content: 'Spend 5-10 minutes understanding the problem, 20-30 minutes coding, and 5-10 minutes testing and discussing.',
          type: 'success'
        },
        {
          title: 'Don\'t Get Stuck',
          content: 'If you\'re stuck for more than 5 minutes, ask for hints. It\'s better to get help than to waste time.',
          type: 'warning'
        },
        {
          title: 'Prioritize Working Solution',
          content: 'A working solution is better than a perfect but incomplete one. Get something running first, then optimize.',
          type: 'success'
        }
      ]
    },
    {
      id: 'communication',
      title: 'Communication Skills',
      icon: <MdPsychology size={24} style={{ color: 'var(--accent-primary)' }} />,
      tips: [
        {
          title: 'Be Clear and Concise',
          content: 'Explain your thoughts clearly without rambling. Use simple language and avoid unnecessary jargon.',
          type: 'success'
        },
        {
          title: 'Listen Actively',
          content: 'Pay attention to interviewer feedback and hints. They\'re trying to guide you toward the solution.',
          type: 'success'
        },
        {
          title: 'Stay Positive',
          content: 'Maintain a positive attitude even when facing difficult problems. Show enthusiasm and curiosity.',
          type: 'success'
        },
        {
          title: 'Admit When You Don\'t Know',
          content: 'It\'s okay to say "I don\'t know" and explain how you would find out. Honesty is valued over bluffing.',
          type: 'warning'
        }
      ]
    },
    {
      id: 'behavioral',
      title: 'Behavioral Questions',
      icon: <MdQuestionAnswer size={24} style={{ color: 'var(--accent-primary)' }} />,
      tips: [
        {
          title: 'Use the STAR Method',
          content: 'Structure your answers: Situation (context), Task (your responsibility), Action (what you did), Result (outcome).',
          type: 'success'
        },
        {
          title: 'Prepare Specific Examples',
          content: 'Have concrete examples ready for common themes: leadership, teamwork, problem-solving, failure, and success.',
          type: 'success'
        },
        {
          title: 'Quantify Your Impact',
          content: 'Use numbers and metrics when possible. "Improved performance by 30%" is more impactful than "improved performance."',
          type: 'success'
        },
        {
          title: 'Be Honest About Failures',
          content: 'When discussing failures, focus on what you learned and how you grew from the experience.',
          type: 'success'
        }
      ]
    }
  ];

  const commonQuestions = [
    {
      category: 'Technical',
      questions: [
        "Explain your approach to solving this problem.",
        "What's the time and space complexity of your solution?",
        "How would you optimize this further?",
        "What edge cases should we consider?",
        "How would you test this code?"
      ]
    },
    {
      category: 'Behavioral',
      questions: [
        "Tell me about a challenging project you worked on.",
        "Describe a time when you had to learn something new quickly.",
        "How do you handle disagreements with team members?",
        "Tell me about a time you failed and what you learned.",
        "Why do you want to work at this company?"
      ]
    },
    {
      category: 'System Design',
      questions: [
        "How would you design a URL shortener?",
        "Design a chat application like WhatsApp.",
        "How would you scale a social media platform?",
        "Design a recommendation system.",
        "How would you handle high traffic on your website?"
      ]
    }
  ];

  return (
    <div style={{ 
      maxWidth: '1200px', 
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
          Interview Success Guide
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          transition: 'var(--transition-normal)'
        }}>
          Master your technical interviews with proven strategies, tips, and common questions
        </p>
      </div>

      {/* Tips Sections */}
      <div style={{ marginBottom: '50px' }}>
        {tipSections.map((section) => (
          <div key={section.id} style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-secondary)',
            borderRadius: '16px',
            marginBottom: '24px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px var(--shadow-light)',
            transition: 'var(--transition-normal)'
          }}>
            <button
              onClick={() => toggleSection(section.id)}
              style={{
                width: '100%',
                padding: '24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left',
                transition: 'var(--transition-normal)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {section.icon}
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  margin: 0,
                  color: 'var(--text-primary)',
                  transition: 'var(--transition-normal)'
                }}>
                  {section.title}
                </h2>
              </div>
              {expandedSections[section.id] ? 
                <MdExpandLess size={24} style={{ color: 'var(--text-secondary)' }} /> : 
                <MdExpandMore size={24} style={{ color: 'var(--text-secondary)' }} />
              }
            </button>
            
            {expandedSections[section.id] && (
              <div style={{ padding: '0 24px 24px' }}>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {section.tips.map((tip, index) => (
                    <div key={index} style={{
                      padding: '20px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '12px',
                      transition: 'var(--transition-normal)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ marginTop: '2px' }}>
                          {tip.type === 'success' ? (
                            <MdCheckCircle size={20} style={{ color: 'var(--success)' }} />
                          ) : (
                            <MdWarning size={20} style={{ color: 'var(--warning)' }} />
                          )}
                        </div>
                        <div>
                          <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            margin: '0 0 8px 0',
                            color: 'var(--text-primary)',
                            transition: 'var(--transition-normal)'
                          }}>
                            {tip.title}
                          </h3>
                          <p style={{
                            fontSize: '14px',
                            lineHeight: '1.6',
                            margin: 0,
                            color: 'var(--text-secondary)',
                            transition: 'var(--transition-normal)'
                          }}>
                            {tip.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Practice Section */}
      <div style={{
        background: 'var(--accent-gradient)',
        borderRadius: '16px',
        padding: '32px',
        textAlign: 'center',
        marginTop: '40px',
        color: 'white'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          Ready to Practice?
        </h2>
        <p style={{
          fontSize: '16px',
          marginBottom: '24px',
          opacity: 0.9
        }}>
          Apply these tips in a real interview simulation with DSAIntervAI
        </p>
        <button
          onClick={() => window.location.href = '/select-company'}
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
          Start Practicing Now
        </button>
      </div>
    </div>
  );
};

export default InterviewTipsPage;