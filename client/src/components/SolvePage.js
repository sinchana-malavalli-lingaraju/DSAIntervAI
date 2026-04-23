import React, { useEffect, useRef, useState } from "react";
import Split from "react-split";
import { useNavigate } from "react-router-dom";
import { FiMic, FiSquare, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import DarkModeToggle from "./DarkModeToggle";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const DURATIONS = [
  { label: "30 min", value: 30 * 60 },
  { label: "45 min", value: 45 * 60 },
  { label: "1 hour", value: 60 * 60 },
];

// Move StepCard component outside to prevent re-creation on every render
const StepCard = ({ title, children, hint, onNext, onBack, showMic, bindSetter, isListening, speechSupported, onMicClick }) => (
  <div
    className="theme-card"
    style={{
      width: "100%",
      boxSizing: "border-box",
    }}
  >
    <button
      onClick={onBack}
      disabled={!onBack}
      style={{
        margin: "0 0 15px",
        border: "none",
        background: "none",
        cursor: onBack ? "pointer" : "not-allowed",
        opacity: onBack ? 1 : 0.6,
        display: "flex",
        alignItems: "center",
        color: "var(--text-secondary)",
        transition: "var(--transition-fast)",
      }}
    >
      <FiArrowLeft />
    </button>
    <h3 style={{ margin: "0 0 10px", color: "var(--text-primary)", transition: "var(--transition-normal)" }}>{title}</h3>
    {hint && (
      <p style={{ margin: "0 0 14px", color: "var(--text-tertiary)", fontSize: 14, transition: "var(--transition-normal)" }}>{hint}</p>
    )}
    <div style={{ marginBottom: 12 }}>{children}</div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
      {showMic && (
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
          <button
            onClick={onMicClick}
            style={{
              padding: "10px",
              borderRadius: 10,
              border: "none",
              background: isListening ? "var(--error)" : "var(--accent-primary)",
              color: "#fff",
              cursor: "pointer",
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px var(--shadow-medium)",
              transition: "var(--transition-fast)"
            }}
          >
            {isListening ? <FiSquare /> : <FiMic />}
          </button>
          <span style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 500, display: "flex", alignItems: "center", gap: 6, transition: "var(--transition-normal)" }}>
            {speechSupported ? (
              <>
                <FiCheckCircle color={isListening ? "var(--error)" : "var(--accent-primary)"} />
                {isListening ? "Listening…" : "Mic ready"}
              </>
            ) : (
              "Speech not supported, please type instead"
            )}
          </span>
        </div>
      )}
      <button
        onClick={onNext}
        className="theme-button"
        style={{
          padding: "8px 24px",
          fontSize: "15px",
          fontWeight: "600",
        }}
      >
        Continue
      </button>
    </div>
  </div>
);

function SolvePage() {
  const navigate = useNavigate();
  // Question + layout
  const [questionData, setQuestionData] = useState(null);
  const [showGuide, setShowGuide] = useState(
    () => sessionStorage.getItem("hideSolveGuide") !== "1"
  );
  // Flow state
  const [step, setStep] = useState("timer"); // "timer" | "edge" | "brute" | "optim" | "code" | "complexity"
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false); // NEW: Control when timer actually starts
  const [remaining, setRemaining] = useState(0);
  // Voice/text inputs per step
  const [edgeCases, setEdgeCases] = useState("");
  const [bruteForce, setBruteForce] = useState("");
  const [optimized, setOptimized] = useState("");
  // Code + complexity
  const [userCode, setUserCode] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("");
  const [spaceComplexity, setSpaceComplexity] = useState("");
  // Speech recognition
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const interimRef = useRef("");
  const targetSetterRef = useRef(null);
  const lastResultIndexRef = useRef(0); // Track last processed result index
  
  // Mount: fetch question, check speech support
  useEffect(() => {
    const link = localStorage.getItem("leetcodeLink");
    if (link) {
      fetch(
        `${API_URL}/leetcode-data?url=${encodeURIComponent(link)}`
      )
        .then((r) => r.json())
        .then((data) => setQuestionData(data))
        .catch(() => setQuestionData(null));
    }
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setSpeechSupported(false);
    }
  }, []);
  
  // Timer tick only after Continue is pressed
  useEffect(() => {
    if (!timerStarted || !selectedDuration) return;
    
    // Initialize remaining time when timer starts
    setRemaining(selectedDuration);
    
    const t = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          stopListening();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerStarted, selectedDuration]);
  
  // Speech helpers
  const startListening = (setter) => {
    if (!speechSupported) return;
    stopListening();
    targetSetterRef.current = setter;
    lastResultIndexRef.current = 0; // Reset the result index tracker
    
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    
    recognition.onstart = () => setIsListening(true);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      let interim = "";
      let finalAdd = "";
      
      // Only process NEW results since the last processed index
      for (let i = lastResultIndexRef.current; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalAdd += transcript + " ";
          lastResultIndexRef.current = i + 1; // Update the last processed index
        } else {
          interim += transcript;
        }
      }
      
      // Add final results to the text field
      if (finalAdd && targetSetterRef.current) {
        targetSetterRef.current((prev) => (prev ? prev + " " : "") + finalAdd.trim());
      }
      
      interimRef.current = interim;
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    lastResultIndexRef.current = 0; // Reset the index when stopping
  };
  
  // Format time
  const fmt = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };
  
  // Clean question HTML (remove images & follow-ups)
  const stripFollowUp = (html) => html?.split(/<strong>Follow-up:/i)[0];
  const cleanedHTML = stripFollowUp(questionData?.descriptionHTML)?.replace(
    /<img[^>]*>/g,
    ""
  );
  
  // Textarea Tab support
  const handleCodeKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.target;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const toInsert = "  ";
      const next = userCode.slice(0, start) + toInsert + userCode.slice(end);
      setUserCode(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + toInsert.length;
      });
    }
  };
  
  const dismissGuide = () => {
    sessionStorage.setItem("hideSolveGuide", "1");
    setShowGuide(false);
  };
  
  // Right panel per step (after timer)
  const renderRight = () => {
    switch (step) {
      case "edge":
        return (
          <StepCard
            title="Record Edge Cases"
            hint="Speak or type edge cases you'll consider before coding."
            onNext={() => { stopListening(); setStep("brute"); }}
            showMic
            bindSetter={setEdgeCases}
            isListening={isListening}
            speechSupported={speechSupported}
            onMicClick={() => (isListening ? stopListening() : startListening(setEdgeCases))}
          >
            <textarea
              value={edgeCases}
              onChange={(e) => setEdgeCases(e.target.value)}
              placeholder="e.g., empty input, duplicates, negative values, large inputs, single element…"
              className="theme-textarea"
              style={{
                width: "100%",
                minHeight: 140,
              }}
            />
          </StepCard>
        );
      case "brute":
        return (
          <StepCard
            title="Record Brute Force Approach"
            hint="Explain a straightforward solution first."
            onNext={() => { stopListening(); setStep("optim"); }}
            onBack={() => { stopListening(); setStep("edge"); }}
            showMic
            bindSetter={setBruteForce}
            isListening={isListening}
            speechSupported={speechSupported}
            onMicClick={() => (isListening ? stopListening() : startListening(setBruteForce))}
          >
            <textarea
              value={bruteForce}
              onChange={(e) => setBruteForce(e.target.value)}
              placeholder="Describe the brute force logic step-by-step…"
              className="theme-textarea"
              style={{
                width: "100%",
                minHeight: 140,
              }}
            />
          </StepCard>
        );
      case "optim":
        return (
          <StepCard
            title="Record Optimized Solution + Data Structure"
            hint="Explain your optimized idea, which DS/algorithm you'll use, and why."
            onNext={() => { stopListening(); setStep("code"); }}
            onBack={() => { stopListening(); setStep("brute"); }}
            showMic
            bindSetter={setOptimized}
            isListening={isListening}
            speechSupported={speechSupported}
            onMicClick={() => (isListening ? stopListening() : startListening(setOptimized))}
          >
            <textarea
              value={optimized}
              onChange={(e) => setOptimized(e.target.value)}
              placeholder="e.g., Use a hash map to reduce lookups to O(1). Choose a heap to track top-k…"
              className="theme-textarea"
              style={{
                width: "100%",
                minHeight: 160,
              }}
            />
          </StepCard>
        );
      case "code":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <h3 style={{ margin: "0 0 10px", color: "var(--text-primary)", transition: "var(--transition-normal)" }}>Code</h3>
                <div style={{ fontSize: 13, color: "var(--text-tertiary)", transition: "var(--transition-normal)" }}>
                  You can now type your optimized solution. <span style={{ color: "var(--accent-primary)" }}>Tab</span> inserts spaces.
                </div>
              </div>
              <button
                onClick={() => setStep("complexity")}
                className="theme-button"
                style={{
                  padding: "8px 14px",
                }}
              >
                Submit
              </button>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                onKeyDown={handleCodeKeyDown}
                placeholder="// Type your optimized code here…"
                className="theme-textarea"
                style={{
                  width: "100%",
                  flex: 1,
                  whiteSpace: "pre-wrap",
                  boxSizing: "border-box",
                  resize: "none",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
              <button
                onClick={() => setStep("optim")}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border-tertiary)",
                  background: "var(--bg-secondary)",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  transition: "var(--transition-fast)",
                }}
              >
                Back
              </button>
            </div>
          </div>
        );
      case "complexity":
        return (
          <StepCard
            title="Add Complexity"
            hint="Enter your final complexity before submitting."
            onNext={() => {
              localStorage.setItem("edgeCases", edgeCases);
              localStorage.setItem("bruteForce", bruteForce);
              localStorage.setItem("optimized", optimized);
              localStorage.setItem("userCode", userCode);
              localStorage.setItem("timeComplexity", timeComplexity);
              localStorage.setItem("spaceComplexity", spaceComplexity);
              navigate("/final-data");
            }}
            onBack={() => setStep("code")}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: "400px", margin: "0 0 24px 0" }}>
              <input
                type="text"
                value={timeComplexity}
                onChange={(e) => setTimeComplexity(e.target.value)}
                placeholder="Time Complexity (e.g., O(n log n))"
                className="theme-input"
                style={{ fontSize: "14px", padding: "8px 12px" }}
              />
              <input
                type="text"
                value={spaceComplexity}
                onChange={(e) => setSpaceComplexity(e.target.value)}
                placeholder="Space Complexity (e.g., O(1))"
                className="theme-input"
                style={{ fontSize: "14px", padding: "8px 12px" }}
              />
            </div>
          </StepCard>
        );
      default:
        return null;
    }
  };
  
  const isTimerBlocking = step === "timer";
  
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "Segoe UI, sans-serif",
        position: "relative",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-secondary)",
        transition: "var(--transition-normal)",
      }}
    >
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "12px 24px", 
        background: "var(--bg-secondary)", 
        boxShadow: "0 1px 4px var(--shadow-light)",
        flexShrink: 0,
        transition: "var(--transition-normal)"
      }}>
        <h1 style={{ margin: 0, fontSize: "22px", color: "var(--text-primary)", transition: "var(--transition-normal)" }}>
          <span style={{ fontWeight: 600 }}>DSA</span>
          <span style={{ background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            IntervAI
          </span>
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13 }}>
          <DarkModeToggle size={20} />
          <div style={{ 
            padding: "6px 12px", 
            borderRadius: 14, 
            background: "var(--bg-tertiary)", 
            border: "1px solid var(--border-secondary)", 
            color: "var(--text-secondary)", 
            transition: "var(--transition-normal)",
            whiteSpace: "nowrap",
            minWidth: "fit-content"
          }}>
            {timerStarted ? `⏱ ${fmt(remaining)} remaining` : "⏱ Select a timer to begin"}
          </div>
        </div>
      </div>
      
      {/* Content (dim & disable while timer overlay is up) */}
      <div style={{ 
        flex: 1, 
        position: "relative", 
        display: "flex", 
        flexDirection: "column",
        minHeight: 0 
      }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            opacity: isTimerBlocking ? 0.3 : 1,            // fade effect
            filter: isTimerBlocking ? "blur(2px)" : "none", // slight blur
            pointerEvents: isTimerBlocking ? "none" : "auto", // disable interaction while faded
            transition: "opacity 0.3s ease, filter 0.3s ease",
            minHeight: 0,
          }}
        >
          <Split 
            className="split-horizontal" 
            style={{ 
              height: "100%", 
              display: "flex",
              flex: 1,
              minHeight: 0 
            }} 
            gutterSize={8}
            sizes={[50, 50]}
          >
            {/* Left: Question */}
            <div style={{ 
              padding: 20, 
              overflow: "auto", 
              background: "var(--bg-secondary)",
              height: "100%",
              boxSizing: "border-box",
              color: "var(--text-secondary)",
              transition: "var(--transition-normal)"
            }}>
              {questionData ? (
                <div dangerouslySetInnerHTML={{ __html: cleanedHTML }} />
              ) : (
                <p>Loading question…</p>
              )}
            </div>
            
            {/* Right: Guided panel */}
            <div style={{ 
              padding: 20, 
              background: "var(--bg-quaternary)", 
              overflow: "auto",
              height: "100%",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              transition: "var(--transition-normal)"
            }}>
              {showGuide && (
                <div
                  className="theme-card"
                  style={{
                    marginBottom: 14,
                    flexShrink: 0
                  }}
                >
                  <b style={{ color: "var(--text-primary)", transition: "var(--transition-normal)" }}>How to use this page</b>
                  <ol style={{ margin: "8px 0 0 18px", color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, transition: "var(--transition-normal)" }}>
                    <li>Select a timer.</li>
                    <li>Record/Type edge cases, then brute force, then optimized + DS.</li>
                    <li>Write optimized code (Tab inserts spaces).</li>
                    <li>Submit → enter time/space complexity → Feedback.</li>
                  </ol>
                  <div style={{ textAlign: "right", marginTop: 8 }}>
                    <button onClick={dismissGuide} style={{ background: "none", border: "none", color: "var(--accent-primary)", cursor: "pointer", fontSize: 13, transition: "var(--transition-fast)" }}>
                      Got it
                    </button>
                  </div>
                </div>
              )}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                {renderRight()}
              </div>
            </div>
          </Split>
        </div>
        
        {/* TIMER OVERLAY */}
        {isTimerBlocking && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--bg-overlay)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              transition: "var(--transition-normal)"
            }}
          >
            <div
              className="theme-card"
              style={{
                width: "min(680px, 92vw)",
                boxShadow: "0 10px 36px var(--shadow-heavy)",
                padding: 24,
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: 6, color: "var(--text-primary)", transition: "var(--transition-normal)" }}>Select Your Timer</h2>
              <p style={{ marginTop: 0, color: "var(--text-tertiary)", transition: "var(--transition-normal)" }}>
                Pick a duration that matches the company's interview format. You're in control.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "14px 0 8px" }}>
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDuration(d.value)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: selectedDuration === d.value ? "2px solid var(--accent-secondary)" : "1px solid var(--border-primary)",
                      background: "var(--bg-secondary)",
                      cursor: "pointer",
                      fontWeight: selectedDuration === d.value ? 700 : 500,
                      color: "var(--text-secondary)",
                      transition: "var(--transition-fast)",
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                <button
                  onClick={() => navigate("/select-company")}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid var(--border-tertiary)",
                    background: "var(--bg-secondary)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: "var(--text-secondary)",
                    transition: "var(--transition-fast)",
                  }}
                >
                  <FiArrowLeft size={14} />
                  Back
                </button>
                <button
                  onClick={() => {
                    if (selectedDuration) {
                      console.log("Continue clicked - starting timer");
                      setTimerStarted(true);
                      setStep("edge");
                    }
                  }}
                  disabled={!selectedDuration}
                  className="theme-button"
                  style={{
                    padding: "10px 16px",
                    opacity: !selectedDuration ? 0.6 : 1,
                    cursor: selectedDuration ? "pointer" : "not-allowed",
                  }}
                >
                  Continue
                </button>
              </div>
              {!selectedDuration ? (
                <p style={{ marginTop: 10, fontSize: 13, color: "var(--text-muted)", transition: "var(--transition-normal)" }}>
                  Please select a duration to continue.
                </p>
              ) : (
                <p style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)", transition: "var(--transition-normal)" }}>
                  Timer set to <b>{fmt(selectedDuration)}</b>. Timer will start when you press Continue.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SolvePage;
