const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

const BASE_DIR = path.join(__dirname, 'leetcode-company-wise-problems');

app.get('/companies', (req, res) => {
  fs.readdir(BASE_DIR, { withFileTypes: true }, (err, files) => {
    if (err) return res.status(500).send('Error reading companies');

    const companies = files
      .filter(f => f.isDirectory() && !f.name.startsWith('.'))  // 🚫 skip .git and hidden folders
      .map(f => f.name)

    res.json(companies);
  });
});


app.get('/question/:company', (req, res) => {
  const company = req.params.company;
  const csvPath = path.join(BASE_DIR, company, '5. All.csv');

  const results = [];

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      if (results.length === 0) return res.json({ title: 'No questions found', link: '#' });

      const random = results[Math.floor(Math.random() * results.length)];
      res.json({ title: random['Problem'], link: random['Link'] });
    })
    .on('error', () => res.status(500).send('Error parsing CSV'));
});


app.get('/leetcode-data', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing LeetCode URL');

  // 🛠 fixed regex to support trailing or no trailing slash
  const slugMatch = url.match(/problems\/([^\/]+)/);
  if (!slugMatch) return res.status(400).send('Invalid LeetCode URL format');

  const titleSlug = slugMatch[1];

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': `https://leetcode.com/problems/${titleSlug}/`,
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

    const json = await response.json(); // ✅ this is now valid inside async function

    const question = json.data?.question;
    if (!question) return res.status(404).send('Question not found');

    res.json({
      title: question.title,
      descriptionHTML: question.content
    });
  } catch (err) {
    console.error('❌ GraphQL fetch failed:', err.message);
    res.status(500).json({ error: 'Failed to load LeetCode question' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
