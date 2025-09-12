# 🏏 NPL-Auction

A **real-time digital auction platform** for teams and players of the **Nepal Premier League (NPL)**.  
This project transforms the **traditional physical auction process** into a seamless, interactive, and transparent **digital experience** using **Node.js, Express, MongoDB, Socket.io, and React**.

---

## ✨ Why NPL-Auction?

The Nepal Premier League (NPL) traditionally hosts its player auctions in physical venues, requiring participants, teams, and organizers to be present. While exciting, this approach comes with limitations:

- Restricted access (only those physically present can participate).
- Delays in communication and bid confirmations.
- Manual record-keeping prone to human error.

**NPL-Auction brings this process online**, making it:

- 🔴 **Real-time** – Bids update instantly using WebSockets (Socket.io).
- 🌍 **Accessible** – Teams, admins, and fans can join from anywhere.
- 📊 **Transparent** – Every event is logged and broadcasted live.
- 🛠️ **Efficient** – Automated validation, logging, and file handling.

This is more than just software it’s a **digital transformation** of one of Nepal’s most exciting sporting events.

---

## 🚀 Features

- ⚡ **Real-time auction system** powered by Socket.io
- 🛡️ **Authentication & Role-Based Access** (Admin, Team, Viewer)
- 📂 **Secure file upload** with validation and compression (Multer + Sharp)
- 📝 **Persistent auction logs** for transparency and auditing
- 📡 **Event broadcasting** for live updates to teams and dashboards
- 🖥️ **Admin dashboard** (auction control, player management)
- 👥 **Team dashboard** (bidding, squad management)
- 📑 **RESTful API** for teams, players, and auction management
- 📖 **Swagger API documentation** at `/api-docs`
- 🐞 **Error logging & request tracing** with log files saved daily

---

## 🛠️ Tech Stack

**Backend**

- Node.js, Express
- MongoDB (Mongoose)
- Socket.io (real-time communication)
- Joi (validation)
- Multer + Sharp (file handling & compression)

**Frontend**

- React (with Hooks & Context)
- Ant Design (UI components)
- Socket.io-client (real-time updates)

**Other Tools**

- Morgan + custom loggers (logging)
- Swagger (API documentation)

---

## 📦 Getting Started

### 🔑 Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [MongoDB](https://www.mongodb.com/)
- npm

### ⚙️ Installation

Clone the repository:

```bash
git https://github.com/ghimirepraveen/NPL-Aution.git
cd NPL-Auction
```

Install dependencies:

```bash
npm install
```

Configure environment variables:

```bash
cp .env.example .env
```

Start the backend server:

```bash
npm run dev
```

## 📖 API Documentation

Swagger UI available at:

- http://localhost:5000/api-docs

## 📝 Logging

Logs stored in:

- /logs/YYYY/MM/DD.log
  Includes request tracing, errors.

## 📂 Project Structure

NPL-Aution/
├── server/
│ ├── config/ # Express, database, and other
│ ├── controllers/ # Route controllers (admin, team player, etc.)
│ ├── helpers/ # Utility/helper functions (e.g., uploadHelper.js)
│ ├── middlewares/ # Express middlewares (auth, guard, etc.)
│ ├── models/ # Mongoose models (playerModel.js, userModel.js, etc.)
│ ├── operations/ # Business logic modules (teamOps.js, playerOps.js, etc.)
│ ├── routes/ # Express route definitions
│ ├── services/ # External services (mailer, AWS, etc.)
│ ├── socket/ # Socket.io logic (auctionSocket.js)
│ └── validation/ # Joi schemas and validators
├── uploads/ # Uploaded files (images, docs, etc.)
├── logs/ # Log files (organized by year/month/day)
├── nginx/ # Nginx config files (if used)
├── docker-compose.yml # Docker Compose setup
├── dockerfile # Dockerfile for containerization
├── env.example # Example environment variables
├── package.json # Node.js dependencies and scripts
└── README.md # Project documentation

## 🌍 Vision

The NPL-Auction project is the first step in digitizing sports events in Nepal, creating a scalable model that can expand to other leagues, sports, and real-time marketplaces.

By combining real-time systems, secure APIs, and intuitive dashboards, this project sets the foundation for transparent, accessible, and modern sports management in Nepal.
