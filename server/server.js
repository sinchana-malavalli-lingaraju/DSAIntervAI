// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const cors = require("cors");

const app = express();
const PORT = 3001;

// ===== Basic middleware =====
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// For LeetCode GraphQL over HTTPS behind corp proxies if needed
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// ===== Company/Question data =====
const BASE_DIR = path.join(__dirname, "leetcode-company-wise-problems");

app.get("/companies", (req, res) => {
  fs.readdir(BASE_DIR, { withFileTypes: true }, (err, files) => {
    if (err) return res.status(500).send("Error reading companies");
    const companies = files
      .filter((f) => f.isDirectory() && !f.name.startsWith("."))
      .map((f) => f.name);
    res.json(companies);
  });
});

app.get("/question/:company", (req, res) => {
  const company = req.params.company;
  const csvPath = path.join(BASE_DIR, company, "5. All.csv");
  const results = [];

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      if (results.length === 0) {
        return res.json({ title: "No questions found", link: "#" });
      }
      const random = results[Math.floor(Math.random() * results.length)];
      res.json({ title: random["Problem"], link: random["Link"] });
    })
    .on("error", () => res.status(500).send("Error parsing CSV"));
});

// ===== LeetCode problem fetch =====
app.get("/leetcode-data", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing LeetCode URL");

  const slugMatch = url.match(/problems\/([^/]+)/);
  if (!slugMatch) return res.status(400).send("Invalid LeetCode URL format");

  const titleSlug = slugMatch[1];

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: `https://leetcode.com/problems/${titleSlug}/`,
      },
      body: JSON.stringify({
        query: `
          query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              title
              content
            }
          }`,
        variables: { titleSlug },
      }),
    });

    const json = await response.json();
    const question = json.data?.question;
    if (!question) return res.status(404).send("Question not found");

    res.json({ title: question.title, descriptionHTML: question.content });
  } catch (err) {
    console.error("❌ GraphQL fetch failed:", err.message);
    res.status(500).json({ error: "Failed to load LeetCode question" });
  }
});

// ===== Local LLM (Ollama) evaluation =====
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:8b";

app.post("/evaluate-submission-ollama", async (req, res) => {
  try {
    const {
      leetcodeLink = "",
      edgeCases = "",
      bruteForce = "",
      optimized = "",
      userCode = "",
      timeComplexity = "",
      spaceComplexity = "",
    } = req.body;

    const system = `
You are an expert DSA interviewer. Return ONLY valid JSON that matches this schema:
{
  "scores": [
    {"category":"Approach & Planning","score":0,"feedback":""},
    {"category":"Algorithm Design","score":0,"feedback":""},
    {"category":"Data Structures","score":0,"feedback":""},
    {"category":"Code Correctness","score":0,"feedback":""},
    {"category":"Code Structure","score":0,"feedback":""},
    {"category":"Time Complexity","score":0,"feedback":""},
    {"category":"Space Complexity","score":0,"feedback":""}
  ],
  "generalFeedback":""
}
Rules:
- Scores are integers 0..100.
- Be specific and constructive.
- If info is missing, penalize and say what to add next time.
- No extra keys, no prose outside JSON.
    `.trim();

    const user = `
PROBLEM URL: ${leetcodeLink || "N/A"}

SUBMISSION:
1) Edge Cases: ${edgeCases || "None"}
2) Brute Force: ${bruteForce || "None"}
3) Optimized Solution: ${optimized || "None"}
4) Final Code:
${userCode || "// None"}
5) Time Complexity: ${timeComplexity || "None"}
6) Space Complexity: ${spaceComplexity || "None"}

Return the JSON as per schema.
    `.trim();

    const resp = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: true,
        options: { temperature: 0.2 },
        format: "json", // ask for strict JSON
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!resp.ok || !resp.body) {
      throw new Error(`Ollama HTTP error ${resp.status}`);
    }

    // Reassemble streamed JSON
    let output = "";
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      for (const line of text.split("\n").filter(Boolean)) {
        try {
          const obj = JSON.parse(line);
          if (obj?.message?.content) output += obj.message.content;
        } catch {
          // ignore partial JSON lines while streaming
        }
      }
    }

    // Parse / salvage final JSON
    let evaluation;
    try {
      evaluation = JSON.parse(output);
    } catch {
      const first = output.indexOf("{");
      const last = output.lastIndexOf("}");
      if (first !== -1 && last !== -1) {
        evaluation = JSON.parse(output.slice(first, last + 1));
      } else {
        throw new Error("Model did not return valid JSON");
      }
    }

    if (!Array.isArray(evaluation?.scores) || evaluation.scores.length !== 7) {
      throw new Error("Invalid evaluation shape");
    }

    evaluation.timestamp = new Date().toISOString();
    evaluation.model = `${OLLAMA_MODEL} (ollama)`;

    res.json(evaluation);
  } catch (err) {
    console.error("Ollama evaluation error:", err.message);
    res.status(500).json({
      scores: [
        { category: "Approach & Planning", score: 60, feedback: "Automatic fallback. Provide clearer planning and tradeoffs." },
        { category: "Algorithm Design",   score: 60, feedback: "Fallback. Outline the algorithm step-by-step." },
        { category: "Data Structures",    score: 60, feedback: "Fallback. Justify each chosen structure with operations needed." },
        { category: "Code Correctness",   score: 60, feedback: "Fallback. Add tests and handle missing edge cases." },
        { category: "Code Structure",     score: 60, feedback: "Fallback. Refactor into functions and improve names." },
        { category: "Time Complexity",    score: 60, feedback: "Fallback. Provide tight bounds and reasoning." },
        { category: "Space Complexity",   score: 60, feedback: "Fallback. Account for aux structures/recursion." },
      ],
      generalFeedback: "Local LLM parsing failed. Ensure Ollama is running and try again.",
      timestamp: new Date().toISOString(),
      error: true,
    });
  }
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
