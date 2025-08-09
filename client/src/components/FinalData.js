import React from "react";

const get = (k, def = "") => localStorage.getItem(k) || def;

const FinalData = () => {
  const edgeCases = get("edgeCases");
  const bruteForce = get("bruteForce");
  const optimized = get("optimized");
  const userCode = get("userCode");
  const timeComplexity = get("timeComplexity");
  const spaceComplexity = get("spaceComplexity");

  return (
    <div style={{ padding: "32px", fontFamily: "Segoe UI, system-ui, sans-serif", maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 20px", color: "#111" }}></h2>

      {/* Summary chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <span style={{ padding: "6px 10px", borderRadius: 999, background: "#f5f7fb", border: "1px solid #e6e9f2", fontSize: 13 }}>
          Time Complexity: <b>{timeComplexity || "—"}</b>
        </span>
        <span style={{ padding: "6px 10px", borderRadius: 999, background: "#f5f7fb", border: "1px solid #e6e9f2", fontSize: 13 }}>
          Space Complexity: <b>{spaceComplexity || "—"}</b>
        </span>
      </div>

      {/* Sections */}
      <Section title="Edge Cases Considered">
        <TextBlock text={edgeCases} placeholder="No edge cases recorded." />
      </Section>

      <Section title="Brute Force Approach">
        <TextBlock text={bruteForce} placeholder="No brute force explanation recorded." />
      </Section>

      <Section title="Optimized Solution & Data Structures">
        <TextBlock text={optimized} placeholder="No optimized solution explanation recorded." />
      </Section>

      <Section title="Final Code">
        <CodeBlock code={userCode} placeholder="// No code submitted." />
      </Section>
    </div>
  );
};

const Section = ({ title, children }) => (
  <section style={{ marginBottom: 24 }}>
    <h4 style={{ margin: "0 0 10px", color: "#222" }}>{title}</h4>
    {children}
  </section>
);

const TextBlock = ({ text, placeholder }) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #e6e9f2",
      borderRadius: 8,
      padding: 14,
      color: "#333",
      lineHeight: 1.6,
      whiteSpace: "pre-wrap",
      minHeight: 80,
    }}
  >
    {text ? text : <span style={{ color: "#888" }}>{placeholder}</span>}
  </div>
);

const CodeBlock = ({ code, placeholder }) => (
  <pre
    style={{
      background: "#0b1020",
      color: "#e6e8ef",
      borderRadius: 8,
      padding: 14,
      overflowX: "auto",
      border: "1px solid #0e1530",
      minHeight: 120,
      margin: 0,
    }}
  >
    <code>{code || placeholder}</code>
  </pre>
);

export default FinalData;
