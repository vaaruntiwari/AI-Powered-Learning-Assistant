# 🚀 AI-Powered Learning Assistant

<div align="center">

### 🧠 Turn Any Learning Material into Interactive Study Sessions Using AI

Transform PDFs and text into **Flashcards**, **Quizzes**, and **Smart Study Guides** within seconds using **Google Gemini AI**.

---

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)]()
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)]()
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)]()
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4)]()
[![JWT](https://img.shields.io/badge/Auth-JWT-success)]()
[![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38BDF8)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)]()

</div>

---

# 📖 Overview

The **AI Learning Assistant** is a full-stack MERN application that helps learners convert lengthy documents into interactive learning resources powered by **Google Gemini AI**.

Instead of spending valuable time creating notes, flashcards, and quizzes manually, users simply upload their study material and let AI generate everything automatically.

The platform focuses on **active recall**, **self-testing**, and **faster knowledge retention** while providing a clean and responsive user experience.

---

# 🎯 Problem Statement

## ❌ The Problem

Students and self-learners spend a significant amount of time preparing study material before actual learning begins.

Typical workflow:

- 📄 Read a 40-page PDF
- ✍️ Create notes manually
- 📝 Write flashcards
- ❓ Think of practice questions
- 📚 Finally start studying

This repetitive preparation often consumes more time than learning itself and discourages consistent revision.

---

## 💡 Solution

This project eliminates manual preparation by leveraging **Generative AI**.

Users simply upload learning material, and the system automatically generates:

- 🧠 AI Flashcards
- ❓ Practice Quizzes
- 📚 Structured Study Guides
- 📄 Smart Summaries

This allows learners to spend their time **learning instead of preparing**.

---

# ✨ Live Demo

## 🌍 Try the Project

> Replace the placeholders below before publishing.

### 🔗 Live Application

```text
[ Live URL ]
```

### 📄 Sample Document

```text
[ Demo PDF / Notes ]
```

### 🎥 Demo Video

```text
[ Loom / YouTube Demo ]
```

### 🔑 Demo Credentials

| Email | Password |
|--------|----------|
| demo@example.com | Demo123 |

---

# ✨ Features

## 🤖 AI Features

- 🧠 AI-generated Flashcards
- ❓ Automatic Quiz Generation
- 📚 AI Study Guide Creation
- 📄 Intelligent Summarization
- ⚡ Fast document processing using Google Gemini

---

## 👤 User Features

- 🔐 JWT Authentication
- 👤 User Profile Management
- 🔑 Secure Password Hashing
- 📚 Personal Learning Dashboard
- 📊 Quiz Results & Scores
- 📱 Fully Responsive Design

---

## 🎨 UI Features

- ⚡ Modern React Interface
- 🎯 Responsive Tailwind CSS Design
- 🔔 Toast Notifications
- 🎴 Interactive Flashcard Experience
- 📈 Smooth User Experience

---

# 🏗️ System Architecture

```text
                 ┌────────────────────┐
                 │      React App     │
                 └─────────┬──────────┘
                           │
                    REST API (Axios)
                           │
                 ┌─────────▼──────────┐
                 │    Express Server   │
                 └─────────┬──────────┘
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
      JWT Auth      Google Gemini      MongoDB
      Middleware        AI API           Atlas
```

---

# 🛠 Tech Stack

## Frontend

- ⚛️ React (Vite)
- 🎨 Tailwind CSS
- 🔀 React Router
- 🔔 React Hot Toast
- 🎯 Lucide React

---

## Backend

- 🟢 Node.js
- 🚀 Express.js
- 🍃 MongoDB
- 📦 Mongoose
- 🔐 JWT Authentication
- 🔑 bcryptjs

---

## AI

- 🤖 Google Gemini API

---

## Deployment

- ▲ Vercel
- 🚀 Render
- ☁️ MongoDB Atlas

---

# 📂 Project Structure

```text
AI-Learning-Assistant
│
├── frontend
│   ├── components
│   ├── pages
│   ├── services
│   ├── context
│   ├── hooks
│   ├── assets
│   └── App.jsx
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
└── README.md
```

---

# 🔒 Security

✔ JWT Authentication

✔ Password Hashing using bcrypt

✔ Protected Routes

✔ Environment Variables

✔ Authentication Middleware

✔ Secure API Design

---

# ⚡ Engineering Decisions

This project was designed with scalability and maintainability in mind.

### Why React?

- Component reusability
- Better state management
- Fast UI rendering

### Why Express?

- Lightweight
- Easy REST API development
- Middleware ecosystem

### Why MongoDB?

- Flexible document storage
- Rapid development
- Natural fit for AI-generated content

### Why Google Gemini?

- Fast response generation
- Excellent reasoning capability
- Rich structured outputs

---

# 🚀 Future Improvements

- 📂 Multiple Document Upload
- 📑 PDF Parsing
- 📈 Learning Analytics Dashboard
- 🔥 Spaced Repetition Algorithm
- 📅 Revision Scheduler
- 🎙 Voice-based Learning
- 📱 Mobile Application
- 🤝 Collaborative Study Groups

---

# 🧪 Installation

```bash
# Clone Repository

git clone YOUR_REPOSITORY_URL

# Install Frontend

cd frontend
npm install

# Install Backend

cd ../backend
npm install

# Start Backend

npm run dev

# Start Frontend

npm run dev
```

---

# 🌱 Environment Variables

Backend

```env
PORT=

MONGO_URI=

JWT_SECRET=

GEMINI_API_KEY=
```

Frontend

```env
VITE_API_URL=
```

---

# 📸 Screenshots

Replace with your screenshots.

```
Home Page

Dashboard

Flashcards

Quiz

Study Guide

Profile
```

---

# 🎯 What This Project Demonstrates

This project showcases practical experience in:

- ✅ Full Stack MERN Development
- ✅ REST API Design
- ✅ AI Integration
- ✅ Authentication & Authorization
- ✅ Responsive UI Development
- ✅ Database Design
- ✅ Clean Project Architecture
- ✅ Secure Backend Development
- ✅ Component-Based Frontend Architecture
- ✅ Production Deployment

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the repository and submit a Pull Request.

---

# 👨‍💻 Author

**Varun Tiwari**

If you found this project useful, consider giving it a ⭐ on GitHub.