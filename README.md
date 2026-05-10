# 🎓 CollegeFinder: Premium College Discovery Platform

A production-grade MERN stack application designed to help students discover, compare, and make informed decisions about their higher education journey.

## 🎯 Project Overview

CollegeFinder is a high-performance discovery platform inspired by industry leaders like Careers360 and Collegedunia. It features a sleek, premium UI with a deep focus on user experience and data-driven insights.

## 🚀 Key Features

### 1. 🔍 Intelligent Search & Discovery
- **Advanced Filtering**: Filter by Location, State, Fees, and Courses.
- **Real-time Search**: Fast, responsive search across names, cities, and categories.
- **Pagination**: Optimized for large datasets using MongoDB pagination.

### 2. 🏫 Detailed Institutional Profiles
- **Rich Media**: High-quality campus images and logos.
- **Deep Insights**: Sections for Fees, Course Specializations, Placement Stats, and NIRF Rankings.
- **Dynamic Reviews**: Student review system with automated rating recalculation.

### 3. ⚖️ Decision Support Tools
- **College Comparison**: Compare up to 3 colleges side-by-side on metrics like fees, placements, and ratings.
- **Admission Predictor**: Rule-based tool to predict admission chances based on entrance exam ranks (JEE, NEET, CAT, etc.).

### 4. 💬 Community Engagement
- **Q&A Forum**: Discussion board for student queries.
- **AI-Powered Answers**: Integrated with **Google Gemini AI** to provide instant, helpful responses to new questions.

### 5. 🔐 User Accounts & Persistence
- **Secure Auth**: JWT-based authentication with role-based access control (Student/Admin).
- **Saved Items**: Personalized dashboard for saved colleges and comparisons.
- **Admin Dashboard**: Full CRUD capabilities for managing college listings and reviews.

## 🛠️ Technology Stack

- **Frontend**: React.js, Tailwind CSS (v4), Framer Motion, Lucide Icons, React Router 7.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas (Mongoose ODM).
- **AI Integration**: Google Generative AI (Gemini Flash).
- **State Management**: React Context API (Auth, Compare).

## 📂 Project Structure

```text
CollegeFinder/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── index.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── api.js
│   │   └── App.jsx
│
├── Screenshots/
│   └── (14 Project Screenshots)
│
└── README.md
```

## ⚙️ Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GOOGLE_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

## 📦 Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone <your-github-repo-url>
```

### 2️⃣ Install Dependencies
**Backend**
```bash
cd backend
npm install
```

**Frontend**
```bash
cd frontend
npm install
```

### 3️⃣ Seed Database
```bash
cd backend
node scripts/seed.js
```

### 4️⃣ Run Project
**Start Backend**
```bash
cd backend
npm run dev
```

**Start Frontend**
```bash
cd frontend
npm run dev
```

## 🔗 API Endpoints

### Colleges
- `GET /api/colleges` - Get all colleges (with pagination & filters)
- `GET /api/colleges/:id` - Get college details
- `GET /api/colleges/filters` - Get dynamic filter values

### Compare & Predict
- `GET /api/colleges/compare?ids=...` - Compare colleges
- `GET /api/colleges/predict?exam=...&rank=...` - Admission predictor

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Q&A & Reviews
- `GET /api/questions` - Get community questions
- `POST /api/questions` - Ask a question
- `POST /api/colleges/:id/reviews` - Post a review

## 🔍 Search & Filter Example
`GET /api/colleges?search=iit&state=Delhi&course=BTech`

## 🚢 Deployment

### Frontend Deployment
Deploy frontend on: **Vercel**

### Backend Deployment
Deploy backend on: **Render**

### Database
Use: **MongoDB Atlas**

## 📸 Screenshots

### 🖥️ Desktop Discovery & Search
![Home Page](Screenshots/Screenshot%202026-05-10%20093321.png)
![College Discovery](Screenshots/Screenshot%202026-05-10%20093346.png)

### 🏫 Institutional Details
![College Profile](Screenshots/Screenshot%202026-05-10%20101906.png)
![Cutoffs & Placements](Screenshots/Screenshot%202026-05-10%20101932.png)

### ⚖️ Comparison & Tools
![Comparison Tool](Screenshots/Screenshot%202026-05-10%20103453.png)
![Admission Predictor](Screenshots/Screenshot%202026-05-10%20093638.png)

### 💬 Community & Accounts
![Q&A Forum](Screenshots/Screenshot%202026-05-10%20093719.png)
![User Login](Screenshots/Screenshot%202026-05-10%20093733.png)
![Saved Collection](Screenshots/Screenshot%202026-05-10%20093411.png)

### ⚙️ Admin Dashboard
![Admin Overview](Screenshots/Screenshot%202026-05-10%20093904.png)
![College Management](Screenshots/Screenshot%202026-05-10%20093932.png)

## 👨‍💻 Author
**Developed by Bansal Sangani**
GitHub: [Bansal Sangani](https://github.com/bansalsangani)

## 📄 License
This project is built for internship assignment and educational purposes.
