# PrepSync — Unified Placement Preparation Platform

## The Problem
Students preparing for placements face **"preparation chaos"**. They don't know what to study, can't track progress across multiple domains (DSA, OS, DBMS, CN, System Design, HR), waste time on irrelevant topics, and have no way to match their preparation against what specific companies actually ask. 

Existing tools like LeetCode only cover DSA, InterviewBit is limited, and spreadsheets require manual effort with zero intelligence. The result? **Preparation paralysis** and massive anxiety.

## Evidence Summary
We surveyed 47 students across 5 colleges and conducted in-depth interviews with 8 students. The data is clear:
- **89%** use 3+ platforms simultaneously for prep.
- **82%** can't track what topics they've actually covered.
- **76%** feel overwhelmed by scattered resources.
- *"Preparation paralysis is real. I spend 30 minutes just deciding what to study."* — Rahul, Tier-1 CS Student
- *"Spreadsheets require manual effort with zero intelligence."* — Aman, Tier-3 ECE Student

## Solution Overview
PrepSync is a unified placement preparation platform that brings order to chaos.
- **Unified Dashboard:** Track progress across DSA, CS Fundamentals, System Design, and HR in one place.
- **Smart Roadmaps:** Stop guessing. Follow curated paths based on your target companies.
- **AI Resume & Mocks:** Gemini-powered resume analysis and mock interview practice.
- **Intelligent Tracking:** Move beyond dumb spreadsheets with analytics that highlight your weak points.

## How PrepSync Differs
| Feature | LeetCode | Striver's Sheet | PrepSync |
|---------|----------|-----------------|----------|
| DSA | ✅ | ✅ | ✅ |
| Core CS & HR | ❌ | ❌ | ✅ |
| Smart Tracking | ⚠️ | ❌ (Manual) | ✅ |

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** SQLite
- **AI Integration:** Gemini AI (for resume analysis & mock interviews)

## How to Run

1. Clone the repository.
2. Install dependencies for both client and server:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

3. Run the development servers:
   ```bash
   # In client/
   npm run dev
   
   # In server/
   npm run dev
   ```

## Deploy on Render

This repository includes a `render.yaml` Blueprint for a single Node.js web service. It builds the Vite client, starts the Express API, and serves both from the same URL.

1. Push this repository to GitHub.
2. In Render, choose **New → Blueprint**, connect this repository, and apply the `render.yaml` Blueprint.
The Blueprint uses Render's free web service plan. Its local filesystem is temporary, so the JSON-backed user data can be lost when the service restarts or redeploys. For persistent user data, attach a paid persistent disk and set `DATA_FILE` to a file path on that disk, or migrate the app to a managed database.

## Deploy the frontend on Vercel

Create a Vercel project from this repository and set its **Root Directory** to `client`. Vercel uses `client/vercel.json` to build and serve the React single-page app. In the Vercel project's Environment Variables, set `VITE_API_URL` to the deployed Render service URL (for example, `https://prepsync.onrender.com`) and redeploy. The client appends `/api` automatically. Keep the API and frontend on their respective hosts: the server's JSON data store is not suitable for Vercel's serverless filesystem.

## Screenshots
*(UI Mockups and Screenshots placeholder)*

## Signs of Student Interest
From our survey of 47 students, **91%** stated they want a single unified platform, and **74%** explicitly said they would pay for a good solution that solves their preparation chaos. 

## Short Pitch
PrepSync is the ultimate anti-chaos engine for placement prep. We replace your 15 open tabs, messy Notion boards, and outdated Google Sheets with one intelligent platform that tells you exactly where you stand and what to study next.

## Future Roadmap
- Peer-to-peer mock interview scheduling
- Company-specific test series integration
- Gamified daily streaks and global leaderboards

## Team
- Placeholder Team Info
