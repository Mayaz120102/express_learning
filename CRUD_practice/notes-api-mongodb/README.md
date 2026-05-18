# 📝 Notes App (MERN Stack - Full Backend Focused Project)

A full-stack Notes application built while learning backend development deeply.  
This project focuses on authentication, API design, security, and real-world deployment challenges.

---

## 🚀 Live Demo

- 🌐 Frontend: https://notes-app-five-iota-40.vercel.app
- ⚙️ Backend API: https://notes-app-vv2s.onrender.com

---

## 📌 Project Overview

This project was developed as part of a backend learning journey, where the main goal was to understand how real-world applications handle:

- User authentication
- Secure API communication
- Token management
- Deployment issues and fixes

Instead of just building features, this project focuses on **understanding how things work internally**.

---

## 🧠 Learning Journey & Key Takeaways

While building this project, the following core backend concepts were learned and applied:

### 🔐 Authentication & Authorization

- JWT-based authentication system
- Access Token (short-lived)
- Refresh Token (long-lived)
- Token rotation for better security

### 🍪 Cookies & Security

- HttpOnly cookies implementation
- Cross-origin cookie issues in production
- Fix using:
  - `sameSite: "none"`
  - `secure: true`

### 🌐 CORS Handling

- Handling frontend (Vercel) and backend (Render) communication
- Allowing specific origins
- Using `credentials: true`

### 🛡️ Security Practices

- Password hashing with bcrypt
- Helmet for secure headers
- Rate limiting to prevent abuse

### 🗄️ Database

- MongoDB with Mongoose
- User and Notes schema design

### 🚀 Deployment Experience

- Backend deployed on Render
- Frontend deployed on Vercel
- Solved real-world issues like:
  - Login failing after deployment
  - Cookies not being set
  - CORS errors

---

## ⚙️ Tech Stack

### Backend (Main Focus)

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (Authentication)
- bcryptjs
- cookie-parser
- helmet
- express-rate-limit

### Frontend

- React.js
- Axios

---

## 🔐 Authentication Flow

1. User logs in or registers
2. Server generates:
   - Access Token (15 minutes)
   - Refresh Token (7 days)
3. Refresh token stored in **HttpOnly cookie**
4. Access token used for protected API requests
5. When expired:
   - Refresh token generates new access token

---

## 📁 Project Structure

```
root/
│
├── frontend/          # React frontend
│
├── controllers/       # Business logic
├── routes/            # API routes
├── models/            # Mongoose schemas
├── config/            # Database connection
├── middleware/        # Auth, error handling, rate limiting
│
├── server.js          # Entry point
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

### 👤 Auth Routes

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| POST   | /api/users/register | Register user        |
| POST   | /api/users/login    | Login user           |
| GET    | /api/users/refresh  | Refresh access token |
| POST   | /api/users/logout   | Logout user          |

---

### 📝 Notes Routes

| Method | Endpoint       | Description   |
| ------ | -------------- | ------------- |
| GET    | /api/notes     | Get all notes |
| POST   | /api/notes     | Create note   |
| PUT    | /api/notes/:id | Update note   |
| DELETE | /api/notes/:id | Delete note   |

---

## ⚠️ Challenges Faced & Solutions

### ❌ Problem: Login failed after deployment

**Cause:** Cookies blocked in cross-origin requests

### ✅ Solution:

```js
sameSite: "none",
secure: true
```

---

### ❌ Problem: CORS errors

**Solution:**

```js
credentials: true;
```

---

### ❌ Problem: Refresh token not working

**Solution:**

- Proper cookie configuration
- Matching frontend-backend domains

---

## 🧪 Running Locally

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd project-folder
```

---

### 2. Install Dependencies

```bash
npm install
cd frontend
npm install
```

---

### 3. Setup Environment Variables

Create `.env` in root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:3000
```

Frontend `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

### 4. Run Project

Backend:

```bash
npm run dev
```

Frontend:

```bash
cd frontend
npm start
```

---

## 🚀 Deployment

- Frontend → Vercel
- Backend → Render

Auto-deploy is enabled via GitHub integration.

---

## 📌 Future Improvements

- Role-based access control
- Notes sharing between users
- Pagination & search
- File/image upload
- UI enhancements

---

## 🙌 Author

**Abrar Mayaz**

---

## ⭐ Support

If this project helped you understand backend development, consider giving it a ⭐ on GitHub.
