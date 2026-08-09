# College Management System Portal

A base MERN stack project (MongoDB, Express, React, Node.js) for a college management
system. Built as a starting point for student mini/major projects — three roles
(admin, faculty, student), JWT auth, and modules for students, faculty, courses,
attendance, results and notices.

This is intentionally kept simple so it's easy to read and extend. No UI library,
no state management overkill, just plain React + Context API and a REST API.

## What's included

- **Auth** — JWT based login/register, role based route protection (admin / faculty / student)
- **Students module** — CRUD, each student has a linked user account
- **Faculty module** — CRUD, each faculty has a linked user account
- **Courses module** — CRUD, filterable by department/semester
- **Attendance** — mark present/absent per course per day, quick percentage summary
- **Results** — marks entry with auto grade calculation
- **Notices** — post announcements targeted at everyone / students / faculty

## Tech stack

- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
- Frontend: React (Create React App), React Router, Axios, Context API

## Project structure

```
college-management-system/
├── backend/
│   ├── config/        # db connection
│   ├── models/        # mongoose schemas
│   ├── middleware/     # auth + role guard
│   ├── controllers/    # route handlers
│   ├── routes/         # express routers
│   └── server.js
└── frontend/
    └── src/
        ├── api/         # axios instance
        ├── context/     # auth context
        ├── components/  # navbar, sidebar, route guard
        └── pages/       # login, dashboard, students, faculty, etc
```

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in your own MONGO_URI and JWT_SECRET
npm run dev
```

Server runs on `http://localhost:5000` by default. Make sure MongoDB is running
locally, or point `MONGO_URI` to an Atlas cluster.

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000`. It talks to the backend at
`http://localhost:5000/api` by default — set `REACT_APP_API_URL` in a `.env`
file inside `frontend/` if your backend is elsewhere.

### 3. Create your first admin

There's no seed script here on purpose — hit the register endpoint once to
create an admin account:

```
POST /api/auth/register
{
  "name": "Admin",
  "email": "admin@college.com",
  "password": "admin123",
  "role": "admin"
}
```

After that, log in as admin from the UI and use the Students/Faculty pages to
create the rest of the accounts (they get user logins automatically).

## Notes for anyone extending this

- Attendance/Results forms currently take raw student/course IDs — in a real
  build you'd swap those for searchable dropdowns.
- No file uploads (profile pics, documents) yet — could be added with multer.
- No pagination on the tables — fine for a college's scale in a demo, but
  worth adding if you plan to load a lot of records.
- Password reset / email verification isn't implemented.

Feel free to fork this and build on top of it for your own project.

## License

MIT — use it however you like.
