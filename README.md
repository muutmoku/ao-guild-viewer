# Albion Guild Info Viewer

This is a React + Material UI + Material React Table web application that allows users to search for guilds in Albion Online and view member information, including detailed gathering and fishing fame statistics.

## ✨ Features

- 🔍 Search Albion Online guilds by name
- 🌍 Select server region: EU / NA / Asia
- 📊 View guild info including alliance, fame, member count
- 👥 Display member list using `material-react-table`
- 📦 Data includes gathering stats (Fiber, Hide, Ore, Rock, Wood) and fishing fame
- 🌐 URL query params (`?guild=GuildName&server=ServerName`) support for shareable searches

## 🖼️ Demo Screenshot

![screenshot](./screenshot.png)

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Install

```bash
npm install
```

### Run locally

```bash
npm start
```

This will start the development server at `http://localhost:3000`

## 🧪 Run Tests

```bash
npm test
```

Includes basic UI and query param behavior tests using `@testing-library/react`.

## 🛠️ Tech Stack

- React + TypeScript
- Material UI
- Material React Table
- Testing Library + Jest

## 📦 Deployment

This app can be deployed to GitHub Pages or Vercel.
Supports URL query parameters for sharing searches:

```
https://yourdomain.com/?guild=Black%20Order&server=EU
```

## 📄 License

MIT

---

Made by [MuutMoku](https://twitch.tv/muutmoku)
