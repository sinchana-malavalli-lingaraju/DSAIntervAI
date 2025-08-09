import React, { useEffect, useRef, useState } from "react";
import Split from "react-split";
import { useNavigate } from "react-router-dom";
import { FiMic, FiSquare, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

const DURATIONS = [
  { label: "30 min", value: 30 * 60 },
  { label: "45 min", value: 45 * 60 },
  { label: "1 hour", value: 60 * 60 },
];

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

  // Mount: fetch question, check speech support
  useEffect(() => {
    const link = localStorage.getItem("leetcodeLink");
    if (link) {
      fetch(
        `http://localhost:3001/leetcode-data?url=${encodeURIComponent(link)}`
      )
        .then((r) => r.json())
        .then((data) => setQuestionData(data))
        .catch(() => setQuestionData(null));
    }

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setSpeechSupported(false);
    }
  }, []);

  // Timer tick only after a duration is selected
  useEffect(() => {
    if (!selectedDuration) return;
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
  }, [selectedDuration]);

  // Speech helpers
  const startListening = (setter) => {
    if (!speechSupported) return;
    stopListening();
    targetSetterRef.current = setter;

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
      for (let i = 0; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalAdd += t + " ";
        else interim += t;
      }
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

  // Step card (no animations)
  const StepCard = ({ title, children, hint, onNext, onBack, showMic, bindSetter }) => (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
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
    background: "#fff",
    cursor: onBack ? "pointer" : "not-allowed",
    opacity: onBack ? 1 : 0.6,
    display: "flex",
    alignItems: "center",
  }}
>
  <FiArrowLeft />
</button>
      <h3 style={{ margin: "0 0 10px", color: "#111" }}>{title}</h3>
      {hint && (
        <p style={{ margin: "0 0 14px", color: "#666", fontSize: 14 }}>{hint}</p>
      )}
      <div style={{ marginBottom: 12 }}>{children}</div>





      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
      {showMic && (
  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
    <button
      onClick={() => (isListening ? stopListening() : startListening(bindSetter))}
      style={{
        padding: "10px",
        borderRadius: 10,
        border: "none",
        background: isListening ? "#ff4d4f" : "#00c853",
        color: "#fff",
        cursor: "pointer",
        fontSize: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
      }}
    >
      {isListening ? <FiSquare /> : <FiMic />}
    </button>
    <span style={{ fontSize: 14, color: "#444", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
      {speechSupported ? (
        <>
          <FiCheckCircle color={isListening ? "#ff4d4f" : "#00c853"} />
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
  style={{
    padding: "4px 20px",  
    borderRadius: 10,      
    border: "none",
    background: "linear-gradient(to right, #007cf0, #00dfd8)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,      
    fontSize: "13px",     
  }}
>
  Continue
</button>
      </div>
    </div>
  );

  // Right panel per step (after timer)
  const renderRight = () => {
    switch (step) {
      case "edge":
        return (
          <StepCard
            title="Record Edge Cases"
            hint="Speak or type edge cases you’ll consider before coding."
            onNext={() => { stopListening(); setStep("brute"); }}
            showMic
            bindSetter={setEdgeCases}
          >
            <textarea
              value={edgeCases}
              onChange={(e) => setEdgeCases(e.target.value)}
              placeholder="e.g., empty input, duplicates, negative values, large inputs, single element…"
              style={{
                width: "100%",
                minHeight: 140,
                borderRadius: 8,
                border: "1px solid #ccc",
                padding: 10,
                fontFamily: "monospace",
                fontSize: 14,
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
          >
            <textarea
              value={bruteForce}
              onChange={(e) => setBruteForce(e.target.value)}
              placeholder="Describe the brute force logic step-by-step…"
              style={{
                width: "100%",
                minHeight: 140,
                borderRadius: 8,
                border: "1px solid #ccc",
                padding: 10,
                fontFamily: "monospace",
                fontSize: 14,
              }}
            />
          </StepCard>
        );
      case "optim":
        return (
          <StepCard
            title="Record Optimized Solution + Data Structure"
            hint="Explain your optimized idea, which DS/algorithm you’ll use, and why."
            onNext={() => { stopListening(); setStep("code"); }}
            onBack={() => { stopListening(); setStep("brute"); }}
            showMic
            bindSetter={setOptimized}
          >
            <textarea
              value={optimized}
              onChange={(e) => setOptimized(e.target.value)}
              placeholder="e.g., Use a hash map to reduce lookups to O(1). Choose a heap to track top-k…"
              style={{
                width: "100%",
                minHeight: 160,
                borderRadius: 8,
                border: "1px solid #ccc",
                padding: 10,
                fontFamily: "monospace",
                fontSize: 14,
              }}
            />
          </StepCard>
        );
      case "code":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
                 <h3 style={{ margin: "0 0 10px", color: "#111" }}>Code</h3>
              <div style={{ fontSize: 13, color: "#666" }}>
                You can now type your optimized solution. <span style={{ color: "#007cf0" }}>Tab</span> inserts spaces.
              </div>
              </div>
              <button
                onClick={() => setStep("complexity")}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: "linear-gradient(to right, #007cf0, #00dfd8)",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                onKeyDown={handleCodeKeyDown}
                placeholder="// Type your optimized code here…"
                style={{
                  width: "100%",
                  height: "60vh",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  padding: 10,
                  fontFamily: "monospace",
                  fontSize: 14,
                  whiteSpace: "pre-wrap",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setStep("optim")}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input
                type="text"
                value={timeComplexity}
                onChange={(e) => setTimeComplexity(e.target.value)}
                placeholder="Time Complexity (e.g., O(n log n))"
                style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
              />
              <input
                type="text"
                value={spaceComplexity}
                onChange={(e) => setSpaceComplexity(e.target.value)}
                placeholder="Space Complexity (e.g., O(1))"
                style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
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
        display: "grid",
        gridTemplateRows: "auto 1fr",
        overflow: "hidden",
        fontFamily: "Segoe UI, sans-serif",
        position: "relative",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <h1 style={{ margin: 0, fontSize: "22px" }}>
          <span style={{ fontWeight: 600 }}>DSA</span>
          <span style={{ background: "linear-gradient(90deg,#007cf0,#00dfd8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            IntervAI
          </span>
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
          <div style={{ padding: "4px 8px", borderRadius: 14, background: "#f5f7fb", border: "1px solid #e6e9f2" }}>
            {selectedDuration ? `⏱ ${fmt(remaining)} remaining` : "⏱ Select a timer to begin"}
          </div>
        </div>
      </div>

      {/* Content (dim & disable while timer overlay is up) */}
      <div style={{ minHeight: 0, position: "relative" }}>
        <div
          style={{
            padding: 20,
            overflow: "auto",
            background: "#fff",
            minHeight: 0,
            minWidth: 0,
            opacity: step === isTimerBlocking ? 0.3 : 1,            // fade effect
            filter: step === isTimerBlocking ? "blur(2px)" : "none", // slight blur
            pointerEvents: step === isTimerBlocking ? "none" : "auto", // disable interaction while faded
            transition: "opacity 0.3s ease, filter 0.3s ease",
          }}
        >
          <Split className="split-horizontal" style={{ height: "100%", display: "flex", minHeight: 0, minWidth: 0 }} gutterSize={8}>
            {/* Left: Question */}
            <div style={{ padding: 20, overflow: "auto", background: "#fff", minHeight: 0, minWidth: 0 }}>
              {questionData ? (
                <div dangerouslySetInnerHTML={{ __html: cleanedHTML }} />
              ) : (
                <p>Loading question…</p>
              )}
            </div>

            {/* Right: Guided panel */}
            <div style={{ padding: 20, background: "#f7f9fc", overflow: "auto", minHeight: 0, minWidth: 0 }}>
              {showGuide && (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #e6e9f2",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 14,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                  }}
                >
                  <b>How to use this page</b>
                  <ol style={{ margin: "8px 0 0 18px", color: "#555", fontSize: 14, lineHeight: 1.6 }}>
                    <li>Select a timer.</li>
                    <li>Record/Type edge cases, then brute force, then optimized + DS.</li>
                    <li>Write optimized code (Tab inserts spaces).</li>
                    <li>Submit → enter time/space complexity → Feedback.</li>
                  </ol>
                  <div style={{ textAlign: "right", marginTop: 8 }}>
                    <button onClick={dismissGuide} style={{ background: "none", border: "none", color: "#007cf0", cursor: "pointer", fontSize: 13 }}>
                      Got it
                    </button>
                  </div>
                </div>
              )}

              {renderRight()}
            </div>
          </Split>
        </div>

        {/* TIMER OVERLAY */}
        {isTimerBlocking && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(245, 247, 251, 0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              style={{
                width: "min(680px, 92vw)",
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 10px 36px rgba(0,0,0,0.12)",
                padding: 24,
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: 6 }}>Select Your Timer</h2>
              <p style={{ marginTop: 0, color: "#666" }}>
                Pick a duration that matches the company’s interview format. You’re in control.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "14px 0 8px" }}>
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDuration(d.value)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: selectedDuration === d.value ? "2px solid #00dfd8" : "1px solid #ccc",
                      background: "#fff",
                      cursor: "pointer",
                      fontWeight: selectedDuration === d.value ? 700 : 500,
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                <button
                  disabled
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    background: "#fff",
                    opacity: 0.6,
                    cursor: "not-allowed",
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => selectedDuration && setStep("edge")}
                  disabled={!selectedDuration}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: !selectedDuration
                      ? "linear-gradient(to right, #99bfe9, #a7efe9)"
                      : "linear-gradient(to right, #007cf0, #00dfd8)",
                    color: "#fff",
                    cursor: selectedDuration ? "pointer" : "not-allowed",
                    fontWeight: 600,
                  }}
                >
                  Continue
                </button>
              </div>

              {!selectedDuration ? (
                <p style={{ marginTop: 10, fontSize: 13, color: "#999" }}>
                  Please select a duration to continue.
                </p>
              ) : (
                <p style={{ marginTop: 10, fontSize: 13, color: "#333" }}>
                  Timer set to <b>{fmt(selectedDuration)}</b>. You can start speaking in the next step.
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
