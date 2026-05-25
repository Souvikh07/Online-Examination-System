# Online Examination System (MERN)

Stack: **MongoDB**, **Express**, **React** (Vite), **Node.js**, with **JWT** authentication.

## Folder layout

```
online-exam-system/
├── backend/          # Express API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── server.js
└── frontend/         # React SPA
    └── src/
        ├── api/
        ├── components/   # .jsx where JSX is used
        ├── context/
        ├── pages/
        ├── App.js        # re-exports App.jsx (entry compatibility)
        └── App.jsx
```

## Prerequisites

- Node.js 18+
- MongoDB running locally or a connection string (MongoDB Atlas)

## Backend setup

```bash
cd backend
npm install
```
Create an admin user:

```bash
npm run seed:admin
```

Default admin (if not overridden in `.env`): `admin@exam.local` / `admin123`.

Seed 5 published subject exams with MCQ questions (Mathematics, Science, English, History, Computer Science):

```bash
npm run seed:content
```

Start the API:

```bash
npm run dev
```

Server listens on `http://localhost:5000` by default.

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` to the backend.

## Features

- **Students**: sign up, log in, browse published exams, take timed MCQ exams, submit answers, view scores and review.
- **Admins**: log in, create/edit/delete exams, add MCQ questions with one correct option, publish exams for students.

## API overview

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Student registration |
| POST | `/api/auth/login` | Login (optional `role`: `student` or `admin`) |
| GET | `/api/exams` | List exams (students see published only) |
| POST | `/api/exams` | Create exam (admin) |
| GET | `/api/exams/:id` | Exam details |
| POST | `/api/exams/:id/start` | Start attempt (student) |
| GET/POST | `/api/exams/:examId/questions` | List / add questions |
| DELETE | `/api/questions/:questionId` | Delete question (admin) |
| POST | `/api/attempts/:attemptId/submit` | Submit answers |
| GET | `/api/attempts/mine` | Student’s completed attempts |
| GET | `/api/attempts/:attemptId/result` | Detailed result |

## Deploy (Vercel + Render + MongoDB Atlas)

### 1. Fix MongoDB Atlas (most common cause of Render crash)

If Render shows **"Exited with status 1"**, the backend failed to connect to MongoDB. The API calls `process.exit(1)` when `MONGO_URI` is missing or invalid.

1. Open [MongoDB Atlas](https://cloud.mongodb.com/) → your project → **Database**.
2. If the cluster says **Paused**, click **Resume** (free M0 clusters pause after inactivity).
3. **Database Access**: confirm the DB user exists and you know the password.
4. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`). Render has no fixed IP; without this, Atlas rejects connections.
5. **Connect** → Drivers → copy the connection string. Replace `<password>` with the real password (URL-encode characters like `@`, `#`, `%`).
6. Add a database name before the `?`, e.g. `...mongodb.net/online-exam?retryWrites=true&w=majority`.

### 2. Render (backend)

| Variable | Value |
|----------|--------|
| `MONGO_URI` | Atlas connection string (no placeholders) |
| `JWT_SECRET` | Long random secret |
| `CLIENT_URL` | Your Vercel URL, e.g. `https://your-app.vercel.app` |
| `PORT` | Leave unset — Render sets this automatically |

- **Root directory**: `backend` (if the repo root is the monorepo folder).
- **Build command**: `npm install`
- **Start command**: `npm start`

After deploy, open **Logs**. You should see `MongoDB connected: ...` then `Server running on port ...`. If not, the log hints (auth, IP whitelist, paused cluster) point to the fix.

### 3. Vercel (frontend)

| Variable | Value |
|----------|--------|
| `VITE_API_URL` | `https://your-render-service.onrender.com/api` |

Redeploy Vercel after changing env vars. Without `VITE_API_URL`, the browser calls `/api` on the Vercel domain (no backend there).

### 4. Smoke test

- `GET https://your-render-service.onrender.com/api/health` → `{"ok":true}`
- Log in from the Vercel site

### 5. Seed admin on Atlas (once)

From your machine with a valid `MONGO_URI` in `backend/.env`:

```bash
cd backend
npm run seed:admin
```
