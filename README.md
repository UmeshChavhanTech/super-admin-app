# Super Admin App

A full-stack application with React frontend and Node.js/Express backend with SQLite database.

## 🌐 Live Deployments

- **Frontend**: https://super-admin-app-vmgy.vercel.app
- **Backend**: https://super-admin-app-3.onrender.com
- **Backend Health Check**: https://super-admin-app-3.onrender.com/health

## 🚀 Features

- User authentication and authorization
- Role-based access control
- Admin dashboard
- User management
- Audit logging
- Responsive design

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios for API calls
- CSS3

### Backend
- Node.js
- Express.js
- Sequelize ORM
- SQLite (development) / PostgreSQL (production)
- JWT authentication
- CORS enabled

## 📦 Project Structure
super-admin-app/
├── backend/
│ ├── src/
│ │ ├── models/ # Database models
│ │ ├── routes/ # API routes
│ │ ├── app.js # Express app setup
│ │ └── seed.js # Database seeder
│ ├── package.json
│ └── server.js # Server entry point
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── services/ # API services
│ │ └── App.js # Main App component
│ ├── package.json
│ └── package-lock.json
└── README.md

text

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/UmeshChavhanTech/super-admin-app.git
   cd super-admin-app
Backend Setup

bash
cd backend
npm install
Set up environment variables

bash
# Create .env file in backend directory
cp .env.example .env
Edit .env with:

env
NODE_ENV=development
PORT=5000
DB_STORAGE=database.sqlite
JWT_SECRET=your-super-secret-jwt-token
FRONTEND_URL=http://localhost:3000
Initialize database

bash
npm run seed
Start backend server

bash
npm run dev
Frontend Setup

bash
cd ../frontend
npm install
Start frontend development server

bash
npm start
Access the application

Frontend: http://localhost:3000

Backend API: http://localhost:5000

🔐 Default Admin Account
After running the seed script:

Email: superadmin@example.com

Password: Test1234!

🌍 API Endpoints
Authentication
POST /api/v1/auth/login - User login

POST /api/v1/auth/register - User registration

GET /api/v1/auth/me - Get current user

Admin Routes
GET /api/v1/superadmin/users - Get all users

POST /api/v1/superadmin/users - Create new user

PUT /api/v1/superadmin/users/:id - Update user

DELETE /api/v1/superadmin/users/:id - Delete user

Utility
GET /api/v1/health - Health check

GET /api/v1/test - Test endpoint

🚀 Deployment
Backend Deployment (Render)
Connect GitHub repo to Render

Set root directory to backend

Add environment variables in Render dashboard

Automatic deploys from main branch

Frontend Deployment (Vercel)
Connect GitHub repo to Vercel

Set build command: cd frontend && npm install && npm run build

Set output directory: frontend/build

Add environment variable: REACT_APP_API_URL=https://your-backend-url.onrender.com

Environment Variables for Production
Backend (Render):

env
NODE_ENV=production
PORT=10000
JWT_SECRET=your-production-jwt-secret
DATABASE_URL=your-render-postgres-url
FRONTEND_URL=https://your-frontend-url.vercel.app
Frontend (Vercel):

env
REACT_APP_API_URL=https://super-admin-app-3.onrender.com
🔍 Troubleshooting
Common Issues
Backend connection failed

Check if backend is running on Render

Verify REACT_APP_API_URL environment variable

CORS errors

Ensure FRONTEND_URL is set in backend environment variables

Check CORS configuration in backend

Database issues

For production, use PostgreSQL instead of SQLite

Run seed script to initialize data

Login not working

Verify backend endpoints are accessible

Check browser console for error messages

Debug Steps
Test backend directly:

bash
curl https://super-admin-app-3.onrender.com/health
Check environment variables:

javascript
console.log("API URL:", process.env.REACT_APP_API_URL);
Verify API endpoints:

Health: https://super-admin-app-3.onrender.com/health

Login: https://super-admin-app-3.onrender.com/api/v1/auth/login
