# DSAIntervAI

A DSA interview preparation platform that simulates real coding interviews. Pick a company, get a LeetCode problem, think out loud, write your solution, and receive AI-powered feedback — just like a real interview.

**Live:** https://dsa-interv-ai.vercel.app

---

## Features

- **Company-specific questions** — filter LeetCode problems by company (Google, Amazon, Meta, etc.)
- **Guided interview flow** — structured steps: edge cases → brute force → optimised solution → code → complexity
- **Speech-to-text** — talk through your approach using your microphone
- **Timed sessions** — 30 min, 45 min, or 1 hour interview timer
- **AI feedback** — submit your solution for evaluation via local LLM (Ollama)
- **Authentication** — register and log in to track your sessions
- **Dark mode** — toggle between light and dark themes
- **Dashboard** — view your past interview sessions

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 7, react-select, react-split |
| Backend | Node.js, Express 5 |
| Auth | JWT (jsonwebtoken), bcryptjs |
| AI Evaluation | Ollama (local LLM — llama3.1:8b) |
| Data | CSV files (LeetCode company-wise problems) |
| Hosting | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
DSAIntervAI/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # All page components
│       ├── contexts/        # Auth & Theme context providers
│       └── App.js
├── server/
│   ├── server.js            # Express API
│   └── leetcode-company-wise-problems/  # CSV data per company
├── vercel.json              # Vercel deploy config
├── render.yaml              # Render deploy config
└── .gitignore
```

---

## Running Locally

### Prerequisites
- Node.js >= 18
- [Ollama](https://ollama.com) installed and running (for AI feedback)

### 1. Clone the repo
```bash
git clone https://github.com/sinchana-malavalli-lingaraju/DSAIntervAI.git
cd DSAIntervAI
```

### 2. Start the backend
```bash
cd server
cp .env.example .env      # edit .env with your values
npm install
npm run dev
```

### 3. Start the frontend
```bash
cd client
cp .env.example .env      # set REACT_APP_API_URL=http://localhost:3001
npm install
npm start
```

App runs at `http://localhost:3000`, API at `http://localhost:3001`.

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port the server listens on | `3001` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:3000` |
| `JWT_SECRET` | Secret key for JWT tokens | *(change in production)* |
| `OLLAMA_URL` | Ollama API base URL | `http://localhost:11434` |
| `OLLAMA_MODEL` | Ollama model to use | `llama3.1:8b` |

### Frontend (`client/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:3001` |

---

## Deployment

### Frontend → Vercel
1. Import repo on [vercel.com](https://vercel.com)
2. Vercel reads `vercel.json` automatically
3. Add env var: `REACT_APP_API_URL` = your Render backend URL

### Backend → Render
1. Import repo on [render.com](https://render.com)
2. Render reads `render.yaml` automatically (root dir: `server`)
3. Add env vars: `CLIENT_URL`, `JWT_SECRET`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/companies` | List all companies |
| `GET` | `/question/:company` | Get a random question for a company |
| `GET` | `/leetcode-data?url=` | Fetch problem description from LeetCode |
| `POST` | `/evaluate-submission-ollama` | AI evaluation of submission |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login |
| `GET` | `/api/auth/me` | Get current user |
| `POST` | `/api/feedback` | Submit feedback |

---

## License

MIT
