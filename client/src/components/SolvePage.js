// src/components/SolvePage.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Split from 'react-split';
import { useNavigate } from 'react-router-dom';

const INTERVIEW_DURATION = 45 * 60; // 45 minutes in seconds

function SolvePage() {
  const [questionData, setQuestionData] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [remainingTime, setRemainingTime] = useState(INTERVIEW_DURATION);
  const [showComplexityPrompt, setShowComplexityPrompt] = useState(false);
  const [timeComplexity, setTimeComplexity] = useState('');
  const [spaceComplexity, setSpaceComplexity] = useState('');
  const navigate = useNavigate();

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    startRecording();
    const link = localStorage.getItem('leetcodeLink');
    if (!link) return;
    fetch(`http://localhost:3001/leetcode-data?url=${encodeURIComponent(link)}`)
      .then(res => res.json())
      .then(data => setQuestionData(data))
      .catch(err => console.error(err));
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = async (e) => {
      if (e.data.size > 0) {
        await transcribeChunk(e.data);
      }
    };

    mediaRecorder.start();
    setInterval(() => {
    if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.requestData(); // manually request chunk
    }
}, 20000); // every 20 seconds instead of 5
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const transcribeChunk = async (chunk) => {
  const formData = new FormData();
  formData.append('file', chunk, 'chunk.webm');
  formData.append('model', 'whisper-1');

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const newText = response.data.text;
      setLiveTranscript(prev => prev + ' ' + newText);
      setExplanation(prev => prev + ' ' + newText);
      break;
    } catch (err) {
      if (attempt < 3 && err.response?.status === 429) {
        await new Promise(r => setTimeout(r, 2000 * attempt)); // exponential backoff
      } else {
        console.error('Live Whisper chunk failed:', err);
        break;
      }
    }
  }
};


  const stripFollowUp = (html) => {
    return html?.split(/<strong>Follow-up:/i)[0];
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const cleanedHTML = stripFollowUp(questionData?.descriptionHTML)?.replace(/<img[^>]*>/g, '');

  return (
    <div style={{ height: '100vh', width: '100vw', fontFamily: 'Segoe UI, sans-serif', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 24px', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <h1 style={{ margin: 0, fontSize: '25px' }}>
          <span style={{ fontWeight: 600 }}>DSA</span>
          <span style={{ background: 'linear-gradient(90deg,#007cf0,#00dfd8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IntervAI</span>
        </h1>
        <div style={{ fontSize: '14px', color: '#333', marginTop: '6px' }}>⏱ Time Left: {formatTime(remainingTime)}</div>
      </div>

      <Split className="split-horizontal" style={{ flex: 1, display: 'flex' }} gutterSize={8}>
        <div style={{ padding: '24px', overflowY: 'auto', background: '#fff' }}>
          {questionData ? (
            <div dangerouslySetInnerHTML={{ __html: cleanedHTML }} />
          ) : (
            <p>Loading question...</p>
          )}
        </div>

        <Split direction="vertical" sizes={[60, 40]} style={{ height: '100%', overflow: 'hidden', overflowX: 'visible' }} gutterSize={6}>
          <div style={{ padding: '5px', background: '#f8f9fc', overflowY: 'auto', overflowX: 'hidden' }}>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="Type your code here..."
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '4px',
                border: '1px solid #ccc',
                padding: '10px',
                fontSize: '15px',
                fontFamily: 'monospace',
                resize: 'none',
                backgroundColor: '#fff',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ padding: '5px', background: '#f0f4f8', overflowY: 'auto' }}>
            <textarea
              value={liveTranscript}
              readOnly
              placeholder="Live transcription in progress..."
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '4px',
                border: '1px solid #ccc',
                padding: '10px',
                fontSize: '15px',
                fontFamily: 'monospace',
                resize: 'none',
                backgroundColor: '#fff',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={() => setShowComplexityPrompt(true)}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                background: '#007cf0',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              Submit & Go to Feedback
            </button>

            {showComplexityPrompt && (
              <div style={{ marginTop: '12px' }}>
                <input
                  type="text"
                  placeholder="Time Complexity (e.g., O(n log n))"
                  value={timeComplexity}
                  onChange={(e) => setTimeComplexity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
                <input
                  type="text"
                  placeholder="Space Complexity (e.g., O(1))"
                  value={spaceComplexity}
                  onChange={(e) => setSpaceComplexity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
                <button
                  onClick={() => {
                    localStorage.setItem('userCode', userCode);
                    localStorage.setItem('explanation', explanation);
                    localStorage.setItem('timeComplexity', timeComplexity);
                    localStorage.setItem('spaceComplexity', spaceComplexity);
                    navigate('/feedback');
                  }}
                  style={{
                    padding: '10px 20px',
                    background: '#00dfd8',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}
                >
                  Finish & View Feedback
                </button>
              </div>
            )}
          </div>
        </Split>
      </Split>
    </div>
  );
}

export default SolvePage;
