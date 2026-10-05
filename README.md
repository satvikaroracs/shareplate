# 🍽️ SharePlate — Food Donation & Waste Reduction Platform

A full-stack web application that connects **food donors** (students, hostels,
canteens) with **NGOs** to reduce food waste and fight hunger.

**SDG Mapping:** 🌍 SDG 2 (Zero Hunger) · SDG 12 (Responsible Consumption)

---

## ✨ Features

- User registration & login with **roles**: Donor and NGO
- Passwords hashed with **bcryptjs**, sessions secured with **JWT**
- Donors can **create, view, update status, and delete** donations (full CRUD)
- NGOs can **browse available donations** and **claim** them
- Donation lifecycle: `Available → Claimed → Picked Up`
- Responsive UI built with **Bootstrap 5**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Front-end | HTML5, CSS3, JavaScript, Bootstrap 5 |
| Back-end | Node.js, Express.js, RESTful API (JSON) |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcryptjs |

---

## 🚀 How to Run

### 1. Prerequisites
- [Node.js](https://nodejs.org) installed (v18+)
- MongoDB running locally **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud URI

### 2. Setup
```bash
cd shareplate
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# edit .env -> set your MONGO_URI and JWT_SECRET
```

### 4. Start the server
```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start        # plain node
```

### 5. Open in browser
```
http://localhost:3000
```

---

## 🔌 RESTful API Reference

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/auth/register` | public | Create donor/NGO account |
| POST | `/api/auth/login` | public | Login, returns JWT |
| GET  | `/api/auth/me` | any | Get logged-in profile |
| POST | `/api/donations` | donor | Create donation |
| GET  | `/api/donations` | any | Donor → own list, NGO → available list |
| PUT  | `/api/donations/:id/claim` | ngo | Claim a donation |
| PUT  | `/api/donations/:id/status` | donor | Mark as Picked Up |
| DELETE | `/api/donations/:id` | donor | Delete own donation |

---

## 🗂️ Project Structure

```
shareplate/
├── server.js            # Entry point: Express app + DB connection
├── package.json
├── .env.example
├── models/
│   ├── User.js          # Donor/NGO schema
│   └── Donation.js      # Donation schema (status lifecycle)
├── middleware/
│   └── auth.js          # JWT verification middleware
├── routes/
│   ├── auth.js          # /api/auth endpoints
│   └── donations.js     # /api/donations endpoints (CRUD)
└── public/              # Front-end (served as static files)
    ├── index.html       # Landing page (SDG mission)
    ├── login.html
    ├── register.html
    ├── donor.html       # Donor dashboard
    ├── ngo.html         # NGO dashboard
    ├── css/style.css
    └── js/api.js        # Fetch helper + auth guards
```

---

## 🧭 Demo Flow

1. Register two accounts — one **Donor**, one **NGO** (use two browsers/incognito).
2. As Donor: post a donation (e.g., "20 veg meals").
3. As NGO: see it under *Available Donations* → click **Claim**.
4. As Donor: see status change to *Claimed*, then click **✔ Picked Up**.

---

## 🌍 SDG Justification (for your report)

| SDG Target | How SharePlate contributes |
|---|---|
| **2.1** End hunger | Surplus food reaches people in need via NGOs |
| **12.3** Halve food waste by 2030 | Platform's core mission is waste reduction |
| **11.6** Reduce adverse environmental impact | Less food waste = less landfill methane |
