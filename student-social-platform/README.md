# Social Media Platform for Students

A base MERN stack project (MongoDB, Express, React, Node.js) for a
student-focused social network - think a stripped-down Twitter/Instagram
built specifically around college life. Built as a starting point for
student mini/major projects.

## What's included

- **Auth** - JWT based login/register (username + email + password)
- **Profiles** - bio, college, avatar (just an image URL, no upload pipeline),
  editable by the owner
- **Posts** - text posts with an optional image URL, delete your own
- **Feed** - shows posts from people you follow (falls back to a global feed
  if you're not following anyone yet, so new accounts aren't staring at an
  empty page)
- **Follow system** - follow/unfollow, follower/following counts on profile
- **Likes & Comments** - like toggle with live count, threaded comments per post
- **Notifications** - triggered on like, comment, and follow; unread badge in
  the navbar, polled every 30s (swap for websockets/SSE if you want it live)
- **Explore** - search users by name, username, or college

## Tech stack

- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
- Frontend: React (Create React App), React Router, Axios, Context API

## Project structure

```
student-social-platform/
├── backend/
│   ├── config/          # db connection
│   ├── models/          # User, Post, Comment, Notification
│   ├── middleware/       # auth + role guard
│   ├── controllers/      # route handlers + a shared notification helper
│   ├── routes/           # express routers
│   └── server.js
└── frontend/
    └── src/
        ├── api/          # axios instance
        ├── context/      # auth context
        ├── components/   # navbar, post card, route guard
        └── pages/        # login, feed, profile, post detail, explore, notifications
```

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Runs on `http://localhost:5000`. Make sure MongoDB is running locally, or
point `MONGO_URI` at an Atlas cluster.

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000`, talks to the backend at
`http://localhost:5000/api` by default (override with `REACT_APP_API_URL`
in a `.env` file inside `frontend/`).

### 3. Try it out

Register a couple of accounts (different browser tabs work fine), search
for each other on Explore, follow, post something, like/comment - the
notification badge should update within 30 seconds on the other account.

## Notes for anyone extending this

- No image upload - avatars and post images are plain URL fields, wire up
  Cloudinary/S3/multer if you want real uploads.
- Notifications are polled, not pushed - fine for a demo, worth swapping
  for Socket.IO or SSE if you want instant delivery.
- No direct messaging yet - a natural next feature to add on top of this.
- No pagination on feed/comments - okay at demo scale, add cursor based
  pagination before this goes anywhere near production data volumes.
- Content moderation is minimal - admins can delete any post/comment, but
  there's no reporting flow yet.

Feel free to fork this and build on top of it for your own project.

## License

MIT - use it however you like.
