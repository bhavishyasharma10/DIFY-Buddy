# 🤖 DIFY Buddy – Your Personal Productivity Assistant

**"I'll do it for you, buddy."**

DIFY Buddy is an AI-powered daily assistant designed to help you journal, manage your to-dos, track reminders, and build positive habits — all in one clean, chat-first interface. It’s like having a thoughtful friend and productivity coach in your pocket. ✨

---

## ✨ Features

- 📝 **Smart Journal Parser** – Understands your journal entries and extracts:
  - To-Dos
  - Reminders
  - Affirmations
  - Highlights
  - Habit Suggestions

- ✅ **To-Do Management** – Create and manage to-dos locally (Firestore-based system)

- 🔔 **Reminders (in progress)** – Set future reminders from journal entries

- 🧠 **Habit Tracker (coming soon)** – AI-generated plans to build healthy habits

- 📅 **Google Calendar & Tasks Integration (coming soon)**

---

## 🛠️ Tech Stack

- **Frontend**: Next.js + TailwindCSS  
- **Backend**: Firebase (Auth, Firestore, Functions)  
- **AI**: Genkit agents + Gemini Pro  
- **Integrations**: Google Calendar API, Google Tasks API (in progress)

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/dify-buddy.git
cd dify-buddy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Firebase

- Add your Firebase project config to `.env.local`
- Set up Firestore, Firebase Auth, and Firebase Functions

### 4. Run locally

```bash
npm run dev
```

## 👮‍ Roadmap

- [x] Basic To-Do creation and storage
- [x] Intent Parser with Genkit
- [ ] Google Tasks integration (🔗 [issue #XX](link))
- [ ] Habit tracker dashboard
- [ ] Journal insights & mood tracking
- [ ] AI Agents marketplace & recommendations

---

## 🧠 Inspiration

DIFY Buddy was inspired by the idea of combining mental clarity and productivity. Journaling + smart actions = a better, calmer you.

It also comes from the dev’s personal wish for a helpful sidekick—think JARVIS or Alfred—someone smart, efficient, and always there. This is that vision, turned into something real and useful.

---

> Built with ❤️ to help you say “I’ll do it for you, buddy.”
