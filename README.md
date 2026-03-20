# Revision Flow

A web application that helps students remember what they learn using spaced repetition. Users can create learning notes, and the system automatically schedules revisions and sends email reminders to review the concepts.

**Goal:** Help students learn better, revise smarter, and never forget important concepts.

---

## 📚 Project Motivation

Many students forget what they learn because they do not revise at the right time.

**Revision Flow** solves this problem by using a **spaced repetition system**, where revisions are scheduled at scientifically proven intervals:

- **Day 3**
- **Day 7**
- **Day 14**
- **Day 28**

This helps students move knowledge from **short-term memory** to **long-term memory**.

---

## ✨ Features

### 1. **Create Learning Notes**
Users can create notes for the concepts they want to remember.

### 2. **Smart Revision Reminder**
The system automatically schedules revisions and sends email reminders.

### 3. **Spaced Repetition System**
Notes are revised at the following intervals:
- 3 days
- 7 days
- 14 days
- 28 days

### 4. **Revision Cards**
Students can revise concepts using flashcard-style revision cards.

### 5. **Mock Tests**
AI generates mock tests from the notes to test understanding.

### 6. **Folder Management**
Users can organize notes into folders.

### 7. **Free Tier Limit**
Free users can create only two folders.

### 8. **Student Package**
Students can access premium features for free for 3–6 months after identity verification.

### 9. **Payment System**
Premium upgrades are handled using Stripe payment gateway.

---

## 🛠️ Tech Stack

This project is built using the **MERN architecture** with **PostgreSQL**.

### **Frontend**
- React
- Tailwind CSS
- React Router

### **Backend**
- Node.js
- Express.js

### **Database**
- PostgreSQL

### **AI Integration**
- Gemini LLM (for generating mock tests)

### **Payment Gateway**
- Stripe

### **Email Service**
- Nodemailer / Email API

---

## 🏗️ System Architecture

The project follows a modern full-stack architecture:

```
Client (React)
      |
      |
API Requests
      |
      v
Node.js + Express Backend
      |
      |
Business Logic (Controllers & Services)
      |
      v
PostgreSQL Database
```

AI services are used to generate mock tests from user notes.


## 🔄 User Workflow

Typical user flow:

1. User signs up
2. User creates a folder
3. User creates a learning note
4. System schedules revision automatically
5. Email reminder is sent
6. User revises using flashcards
7. User takes mock tests
8. User tracks learning progress

---

---

## 🔮 Future Improvements

Planned features for future development:

- [ ] Mobile application
- [ ] Advanced learning analytics
- [ ] AI generated summaries
- [ ] Smart revision difficulty tracking
- [ ] Offline revision mode

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Developed by:**
- **Keshav**