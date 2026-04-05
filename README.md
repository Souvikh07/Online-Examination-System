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

Edit `.env`: set `MONGO_URI`, `JWT_SECRET`, and optionally `CLIENT_URL`.

Create an admin user:

```bash
npm run seed:admin
```

Default admin (if not overridden in `.env`): `admin@exam.local` / `admin123`.

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
