# E-Commerce Platform with AI-Powered Suggestions

A base MERN stack e-commerce project (MongoDB, Express, React, Node.js) built
as a starting point for student mini/major projects. Has the usual e-commerce
pieces - products, cart, checkout, orders, reviews - plus a product
recommendation layer that's designed to be genuinely extendable rather than a
single hardcoded "suggested products" list.

## What's included

- **Auth** - JWT based login/register, customer and admin roles
- **Products** - CRUD (admin), search + filter + sort (public), tags and categories
- **Cart & Checkout** - add/update/remove items, place an order (no real payment
  gateway wired up - that's intentionally left as an extension point)
- **Orders** - order history for customers, status management for admins
- **Reviews & Ratings** - one review per user per product, auto-updates the
  product's average rating
- **AI-Powered Suggestions** - this is the part that makes this project different
  from a plain e-commerce clone:
  - `related products` - content based, matches by category + shared tags
  - `recommended for you` - personalized using purchase history and viewed
    categories, with an optional AI API call layered on top

### How the recommendation engine works

`backend/services/recommendationService.js` is the core of it. By default,
with no AI key configured, it runs entirely on rule based logic:
category matching, tag overlap, and popularity (views/ratings) as tiebreakers.
Good enough to demo out of the box.

If you set `AI_API_KEY` in `.env` (see `backend/services/aiService.js`), the
personalized recommendations first try asking an AI model (OpenAI-style chat
completion endpoint, easy to swap for another provider) for relevant product
keywords based on the user's interests, then searches the product catalog with
those. If the AI call fails or isn't configured, it silently falls back to the
rule based version - nothing breaks either way.

This split is deliberate: it means the project *works immediately* for anyone
cloning it, and the "AI-powered" part is a real, swappable layer rather than
a fake label on a basic query.

## Tech stack

- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
- Frontend: React (Create React App), React Router, Axios, Context API
- AI: pluggable - works with any OpenAI-compatible chat completion API

## Project structure

```
ecommerce-ai-platform/
├── backend/
│   ├── config/          # db connection
│   ├── models/          # User, Product, Category, Cart, Order, Review
│   ├── middleware/       # auth + role guard
│   ├── controllers/      # route handlers
│   ├── routes/           # express routers
│   ├── services/
│   │   ├── recommendationService.js   # rule based + AI hybrid recommender
│   │   └── aiService.js               # optional external AI API wrapper
│   └── server.js
└── frontend/
    └── src/
        ├── api/          # axios instance
        ├── context/      # auth + cart context
        ├── components/   # navbar, product card, product strip, route guard
        └── pages/        # home, products, product detail, cart, checkout, admin, etc
```

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Runs on `http://localhost:5000`. Make sure MongoDB is running locally or
point `MONGO_URI` at an Atlas cluster. Leave `AI_API_KEY` blank to use the
rule based recommender - it works fine without it.

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000`, talks to the backend at
`http://localhost:5000/api` by default (override with `REACT_APP_API_URL`
in a `.env` file inside `frontend/`).

### 3. Create your first admin + some data

Register normally through the UI, then in `POST /api/auth/register` send
`"role": "admin"` once to get an admin account (there's no seed script here
on purpose, so you get a feel for the data model). From the Admin dashboard
you can add categories, then products.

## Notes for anyone extending this

- No payment gateway - `orderController.js` marks orders as placed without
  charging anything. Stripe/Razorpay slot in naturally at the checkout step.
- Recommendation quality depends entirely on how much tag/category data your
  products have - the more consistent your tagging, the better it performs.
- No image upload - `imageUrl` is just a plain string field, swap in
  Cloudinary/S3 if you want actual uploads.
- No pagination on product listing yet - fine for a demo catalog, worth
  adding for anything bigger.
- Stock isn't decremented inside a transaction - acceptable for a base
  project, but worth fixing with a Mongo session if you go further with this.

Feel free to fork this and build on top of it for your own project.

## License

MIT - use it however you like.
