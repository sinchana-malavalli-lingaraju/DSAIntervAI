// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// In-memory user storage (in production, use a database)
const users = [];

// ===== Basic middleware =====
const allowedOrigins = [CLIENT_URL, "http://localhost:3000", "http://127.0.0.1:3000"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Authentication Middleware =====
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ===== Authentication Routes =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(user);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = users.find(user => user.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ===== Health check =====
app.get("/health", (req, res) => res.json({ status: "ok" }));

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
        { category: "Approach & Planning", score: 0, feedback: "Automatic fallback. Provide clearer planning and tradeoffs." },
        { category: "Algorithm Design",   score: 0, feedback: "Fallback. Outline the algorithm step-by-step." },
        { category: "Data Structures",    score: 0, feedback: "Fallback. Justify each chosen structure with operations needed." },
        { category: "Code Correctness",   score: 0, feedback: "Fallback. Add tests and handle missing edge cases." },
        { category: "Code Structure",     score: 0, feedback: "Fallback. Refactor into functions and improve names." },
        { category: "Time Complexity",    score: 0, feedback: "Fallback. Provide tight bounds and reasoning." },
        { category: "Space Complexity",   score: 0, feedback: "Fallback. Account for aux structures/recursion." },
      ],
      generalFeedback: "Local LLM parsing failed. Ensure Ollama is running and try again.",
      timestamp: new Date().toISOString(),
      error: true,
    });
  }
});

// ===== Feedback Route =====
app.post('/api/feedback', (req, res) => {
  try {
    const { name, email, subject, message, rating, category } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required' });
    }

    // Create feedback object
    const feedback = {
      id: Date.now(),
      name,
      email,
      subject,
      message,
      rating: rating || 'Not provided',
      category: category || 'general',
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    // Log feedback to console (in production, you'd save to database and send email)
    console.log('\n📧 NEW FEEDBACK RECEIVED:');
    console.log('=====================================');
    console.log(`Name: ${feedback.name}`);
    console.log(`Email: ${feedback.email}`);
    console.log(`Subject: ${feedback.subject}`);
    console.log(`Category: ${feedback.category}`);
    console.log(`Rating: ${feedback.rating}`);
    console.log(`Message: ${feedback.message}`);
    console.log(`Timestamp: ${feedback.timestamp}`);
    console.log('=====================================\n');

    // In a real application, you would:
    // 1. Save feedback to database
    // 2. Send email notification to admin
    // 3. Send confirmation email to user
    // 4. Maybe integrate with a ticketing system

    // For now, we'll just simulate sending to a dummy email
    console.log(`📬 Feedback would be sent to: admin@dsaintervai.com`);
    console.log(`📬 Confirmation would be sent to: ${feedback.email}`);

    res.status(200).json({ 
      message: 'Feedback submitted successfully',
      feedbackId: feedback.id
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ===== Start server =====
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));
