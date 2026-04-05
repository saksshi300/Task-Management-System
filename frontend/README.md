✅ TaskFlow
A full-stack task management app built with Next.js, Node.js, TypeScript, and SQLite.

Tech Stack

Frontend — Next.js + TypeScript + Bootstrap
Backend — Node.js + Express + TypeScript
Database — SQLite with Prisma ORM
Auth — JWT (Access + Refresh Tokens) + bcrypt

How to Run
Step 1 — Backend (Terminal 1)
cd taskflow/backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
Runs at: http://localhost:5000

Step 2 — Frontend (Terminal 2)
cd taskflow/frontend
npm install
npm run dev
Runs at: http://localhost:3000

Features

Register, Login, Logout
Create, Edit, Delete tasks
Filter by status and priority
Search tasks by title
Pagination
Toast notifications

Folder Structure
taskflow/
├── backend/
│ ├── prisma/ → Database schema
│ └── src/
│ ├── controllers/ → Business logic
│ ├── middleware/ → JWT auth check
│ ├── routes/ → API endpoints
│ ├── utils/ → JWT & response helpers
│ └── index.ts → Server entry point
│
└── frontend/
└── src/
├── app/ → Pages (login, register, dashboard)
├── components/ → UI components
├── hooks/ → useAuth, useTasks
└── lib/ → API calls
