# TourInsight Lanka 🇱🇰

A full-stack Smart Tourism Business Intelligence (BI) platform for Sri Lanka, built as a Management Information System (MIS) for the IT2212 course module.

---

## What It Does

The platform has two main views:

**Tourist Portal** — for visitors to Sri Lanka
- Browse and filter destination hotspots (search, sort, category filter)
- Generate personalised day-by-day itineraries via the AI Trip Planner
- Submit reviews with real-time sentiment analysis

**BI Dashboard** — for tourism administrators
- Live KPI cards: arrivals, hotel occupancy, revenue, satisfaction
- Monthly tourist arrivals chart with source-country breakdown
- Regional hotel occupancy seasonality charts
- Feedback sentiment analytics
- Demand forecasting with OLS regression + scenario modifiers (visa waiver, fuel tax, weather, promo)
- Management report export

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19 + Vite + Lucide Icons      |
| Backend   | Node.js + Express.js (ESM)          |
| Database  | MongoDB + Mongoose                  |
| Auth      | JWT + bcryptjs                      |
| Styling   | Custom CSS (glassmorphism dark theme)|

---

## Project Structure

```
tourinsight-lanka/
├── backend/
│   ├── models/
│   │   └── Schema.js        # Mongoose schemas: Destination, Feedback, Booking, Arrival, User
│   ├── server.js            # Express API + auth routes
│   ├── seed.js              # Database seeding script
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── DestinationExplorer.jsx
│   │   │   ├── TripPlanner.jsx
│   │   │   ├── FeedbackHub.jsx
│   │   │   ├── BIOverview.jsx
│   │   │   ├── TouristArrivals.jsx
│   │   │   ├── HotelOccupancy.jsx
│   │   │   ├── FeedbackAnalytics.jsx
│   │   │   ├── DemandForecast.jsx
│   │   │   ├── TeamCredits.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # JWT auth state (React Context)
│   │   ├── services/
│   │   │   └── api.js           # API client with offline fallback
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css            # Design system (CSS variables, glassmorphism)
│   └── package.json
└── package.json                 # Root runner (concurrently)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port 27017 *(optional — app works without it)*

### 1. Install dependencies

Run this once from the project root:

```bash
npm run install-all
```

### 2. Start the app

```bash
npm run dev
```

This starts both servers simultaneously:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5050`

### 3. Seed the database (optional)

Only needed if MongoDB is running and you want real data:

```bash
npm run seed
```

> **No MongoDB?** No problem. The app automatically falls back to a built-in high-fidelity dataset stored in localStorage. Everything works offline.

---

## Environment Variables

Located at `backend/.env`:

```env
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/tourinsight_lanka
JWT_SECRET=tourinsight_lanka_jwt_secret_2026
JWT_EXPIRES_IN=7d
```

---

## API Routes

### Auth
| Method | Route                  | Description                  | Auth Required |
|--------|------------------------|------------------------------|---------------|
| POST   | `/api/auth/register`   | Create a new account         | No            |
| POST   | `/api/auth/login`      | Log in, receive JWT token    | No            |
| GET    | `/api/auth/me`         | Validate token, get user     | Yes (Bearer)  |

### Data
| Method | Route                       | Description                    | Auth Required     |
|--------|-----------------------------|--------------------------------|-------------------|
| GET    | `/api/destinations`         | List all destinations          | No                |
| GET    | `/api/feedback`             | List all feedback              | No                |
| POST   | `/api/feedback`             | Submit new feedback            | No                |
| GET    | `/api/analytics/occupancy`  | Hotel occupancy data           | No                |
| GET    | `/api/analytics/arrivals`   | Monthly arrivals data          | No                |
| GET    | `/api/analytics/summary`    | KPI summary metrics            | Yes (Admin only)  |

---

## User Roles

| Role      | Access                                                  |
|-----------|---------------------------------------------------------|
| `tourist` | Tourist portal (explore, plan, feedback)               |
| `admin`   | All tourist features + full BI Dashboard access        |

To create an admin account, register normally then update the `role` field directly in MongoDB:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## Team

| Reg No.       | Name                      | Role                  |
|---------------|---------------------------|-----------------------|
| 2022/ICT/78   | U.G.H.S. Ranasingha       | Team Leader           |
| 2022/ICT/70   | W.A.U.D. Wijayakoon       | Database Engineer     |
| 2022/ICT/73   | A.A.Y.S. Gunarathne       | Front-End Developer   |
| 2022/ICT/81   | S.A. Dissanayake          | BI & Analytics Analyst|
| 2022/ICT/94   | M.H.M.M.N. Gunasekara     | System Architect      |

**Course:** Management Information System (IT2212)  
**Institution:** Department of Information Technology, Faculty of Technology  
**Submission:** July 2026
