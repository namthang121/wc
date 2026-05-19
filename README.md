# ⚽ World Cup 2026 App

A modern mobile application for FIFA World Cup 2026 — live scores, predictions, standings, and AI match insights.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native (Expo ~51), TypeScript |
| State | Redux Toolkit + React Query v5 |
| Realtime | Socket.IO client |
| Storage | react-native-mmkv |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| Cache | Redis (ioredis) |
| Realtime | Socket.IO server |
| Auth | JWT (access + refresh) |
| Notifications | Firebase Admin SDK (FCM) |
| AI Engine | Elo + Poisson distribution |

---

## Project Structure

```
wcjs/
├── backend/          # Node.js Express API
│   └── src/
│       ├── config/   # DB, Redis, Firebase, Socket
│       ├── controllers/
│       ├── middleware/
│       ├── models/   # Mongoose schemas
│       ├── routes/
│       ├── services/
│       ├── socket/
│       └── utils/
└── mobile/           # React Native (Expo)
    └── src/
        ├── api/      # Axios API clients
        ├── components/
        ├── hooks/
        ├── navigation/
        ├── screens/
        ├── store/    # Redux + slices
        ├── theme/
        ├── types/
        └── utils/
```

---

## Setup

### Prerequisites

- Node.js >= 18
- MongoDB instance (local or Atlas)
- Redis instance (local or cloud)
- Firebase project (for push notifications)
- Expo CLI: `npm install -g expo-cli`

### Backend

```bash
cd backend
cp .env.example .env
# Fill in .env values
npm install
npm run dev        # ts-node-dev with watch
npm run build      # Compile TypeScript
npm start          # Run compiled JS
```

**Backend `.env` keys:**

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wcjs
JWT_SECRET=your_super_secret
JWT_REFRESH_SECRET=your_refresh_secret
REDIS_URL=redis://localhost:6379
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
CORS_ORIGIN=http://localhost:19000
```

### Mobile

```bash
cd mobile
cp .env.example .env
# Set EXPO_PUBLIC_API_URL to your backend URL
npm install
npx expo start          # Start dev server
npx expo run:android    # Build for Android
```

**Mobile `.env` keys:**

```
EXPO_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh tokens |
| GET | `/api/v1/matches/live` | Live matches |
| GET | `/api/v1/matches/scheduled` | Scheduled matches |
| GET | `/api/v1/matches/:id` | Match details |
| GET | `/api/v1/matches/:id/ai-prediction` | AI prediction |
| GET | `/api/v1/standings` | All group standings |
| POST | `/api/v1/predictions` | Submit prediction |
| GET | `/api/v1/predictions/my` | My predictions |
| GET | `/api/v1/predictions/leaderboard` | Leaderboard |
| GET | `/api/v1/news` | News feed |
| GET | `/api/v1/teams` | All teams |

Admin routes (require `role: admin`):
- `POST /api/v1/admin/teams`
- `POST /api/v1/matches` (create match)
- `PUT /api/v1/matches/:id/live` (update score/timeline)
- `GET /api/v1/admin/dashboard`

---

## Socket Events

| Event | Direction | Description |
|---|---|---|
| `join_match` | Client → Server | Subscribe to match room |
| `leave_match` | Client → Server | Unsubscribe from match |
| `score_update` | Server → Client | Score changed |
| `timeline_event` | Server → Client | Goal / card / substitution |
| `status_update` | Server → Client | Match status changed |
| `standings_update` | Server → Client | Group table updated |
| `notification` | Server → Client | User notification |

---

## Features

- ⚡ **Live Scores** — realtime via Socket.IO, 20s polling fallback
- 📊 **Statistics** — possession, shots, passes, corners, fouls
- 📅 **Timeline** — goals, cards, substitutions, VAR decisions
- 🏆 **Standings** — all 12 groups with form indicators
- 🎯 **Predictions** — predict scores, earn 3pts exact / 1pt correct result
- 🤖 **AI Engine** — Poisson-based win probability + expected goals
- 🔔 **Push Notifications** — match start, goals, red cards, final whistle
- 📰 **News Feed** — paginated football news
- 🌙 **Dark Neon UI** — glassmorphism cards, neon green/blue accents
- 📱 **Offline Cache** — MMKV-based TTL cache for key data

---

## Build for Google Play

```bash
cd mobile
npx eas build --platform android --profile production
```

Configure `eas.json` with your keystore and credentials before building.

---

## License

MIT
