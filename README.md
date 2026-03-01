# ResumeMatch AI 🎯

**AI-powered ATS resume analyzer** — paste a job description, upload your resume, and get an instant match score, skill gaps, and actionable tips in seconds.

Built with **React + Vite**, **Tailwind CSS**, and **Google Gemini AI**. Deployed on **Vercel** (free, forever).

---

## ✨ Features

- 📄 Drag-and-drop PDF/DOCX upload with **client-side text extraction** (privacy first)
- 🧠 AI analysis powered by **Gemini 1.5 Flash** (fast & free)
- 📊 Animated ATS score gauge (0–100)
- ✅ Matched skills, ❌ missing skills, 💪 strengths
- 💡 4 actionable improvement suggestions
- 🔒 Resume text is **never stored** — fully stateless

---

## 🚀 Quick Deploy (5 minutes)

### Step 1: Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/resume-matcher.git
cd resume-matcher
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Get a free Gemini API key
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → Create API Key
3. Copy the key

### Step 4: Run locally (optional)
```bash
# Create a .env file
echo "GEMINI_API_KEY=your_key_here" > .env
npm run dev
# Opens at http://localhost:5173
```

### Step 5: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/resume-matcher.git
git push -u origin main
```

### Step 6: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **New Project** → Import your repo
3. In **Environment Variables**, add:
   - `GEMINI_API_KEY` = your key from Step 3
4. Click **Deploy** ✅

### Step 7: Done!
Your site is live at `https://your-project.vercel.app` — free forever on Vercel's hobby tier.

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| PDF Parsing | pdfjs-dist (client-side) |
| DOCX Parsing | mammoth (client-side) |
| Backend | Vercel Serverless Functions |
| AI Model | Google Gemini 1.5 Flash |
| Hosting | Vercel (free tier) |

---

## 📁 Project Structure

```
resume-matcher/
├── api/
│   └── analyze.js          ← Vercel serverless function (Gemini API)
├── src/
│   ├── App.jsx             ← Main app + state management
│   ├── main.jsx
│   ├── index.css           ← Tailwind + custom animations
│   └── components/
│       ├── Header.jsx
│       ├── JobDescriptionPanel.jsx
│       ├── ResumeUploadPanel.jsx
│       ├── AnalyzeButton.jsx
│       ├── LoadingSpinner.jsx
│       └── ResultsCard.jsx
├── .env.example
├── vercel.json
└── README.md
```

---

## 🔒 Privacy

- Resume text is extracted **entirely in the browser** — no binary files sent to server
- Only plain extracted text is sent to the serverless function
- No database, no user accounts, fully stateless

---

## 📄 License

MIT
