const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const cors = require("cors");

const app = express();
const PORT = 3001;

// CORS middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Additional CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fix SSL certificate issues for LeetCode API calls
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const BASE_DIR = path.join(__dirname, "leetcode-company-wise-problems");

// Get list of companies
app.get("/companies", (req, res) => {
  fs.readdir(BASE_DIR, { withFileTypes: true }, (err, files) => {
    if (err) return res.status(500).send("Error reading companies");

    const companies = files
      .filter((f) => f.isDirectory() && !f.name.startsWith("."))
      .map((f) => f.name);

    res.json(companies);
  });
});

// Get random question for a company
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

// Fetch LeetCode question data
app.get("/leetcode-data", async (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).send("Missing LeetCode URL");

  const slugMatch = url.match(/problems\/([^\/]+)/);
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

    res.json({
      title: question.title,
      descriptionHTML: question.content,
    });
  } catch (err) {
    console.error("❌ GraphQL fetch failed:", err.message);
    res.status(500).json({ error: "Failed to load LeetCode question" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});