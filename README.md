# CPF - MBA Career Assessment Platform

A comprehensive web application for career assessment and guidance, helping students discover their ideal career paths through personality and interest-based testing.

## 🌟 Features

- **Career Assessment Tests** - RIASEC and personality-based career assessments
- **User Authentication** - Secure login system for students and administrators
- **Admin Dashboard** - Comprehensive admin panel for managing students and viewing results
- **Results Export** - Export student results to Excel format
- **Bulk Upload** - Upload student data via Excel files
- **Real-time Notifications** - User-friendly notification system

## 🏗️ Project Structure

```
CPF/
├── backend/              # Node.js + Express backend
│   ├── server.js        # Main server file
│   ├── seedQuestions.js # Database seeder
│   └── package.json     # Backend dependencies
│
├── frontend/            # React frontend
│   ├── src/            # Source files
│   ├── public/         # Static files
│   └── package.json    # Frontend dependencies
│
├── render.yaml         # Render deployment configuration
├── RENDER_DEPLOYMENT_GUIDE.md  # Detailed deployment guide
├── QUICK_START.md     # Quick reference for deployment
└── .env.example       # Environment variables template
```

## 🚀 Deployment to Render

This project is configured for easy deployment to Render.

### Quick Start

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - See [`ENVIRONMENT_VARIABLES.md`](ENVIRONMENT_VARIABLES.md) for exact values to use
   - See [`QUICK_START.md`](QUICK_START.md) for quick steps
   - See [`RENDER_DEPLOYMENT_GUIDE.md`](RENDER_DEPLOYMENT_GUIDE.md) for detailed instructions

### Files for Deployment

- ✅ `render.yaml` - Automatic deployment configuration
- ✅ `.env.example` - Environment variables template
- ✅ `backend/.env` - Backend environment variables (ready to use)
- ✅ `frontend/.env` - Frontend environment variables (ready to use)
- ✅ `backend/.env.production` - Production environment variables
- ✅ `ENVIRONMENT_VARIABLES.md` - **Copy-paste guide for Render**
- ✅ `frontend/public/_redirects` - React Router configuration
- ✅ Updated code to use environment variables

## 💻 Local Development

### Prerequisites

- Node.js 14+ and npm
- MongoDB Atlas account (or local MongoDB)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd CPF
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Set up Frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Configure Environment Variables**
   - Backend and Frontend `.env` files are already created
   - For local development: Files are ready to use
   - For production: See [`ENVIRONMENT_VARIABLES.md`](ENVIRONMENT_VARIABLES.md)

5. **Run Backend**
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:5000
   ```

6. **Run Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm start
   # App opens at http://localhost:3000
   ```

### Seed Database

```bash
cd backend
npm run seed
```

## 🔧 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **File Processing**: Multer, XLSX

### Frontend
- **Framework**: React 18
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Testing**: Jest, React Testing Library

## 📊 Environment Variables
Local Development (Already Configured)

**Backend** (`backend/.env`):
```
MONGODB_URI=mongodb+srv://nisar:nisar%402004@cluster0.7q9px.mongodb.net/CPF?appName=Cluster0
JWT_SECRET=choosekonguengineeringcollegeforbestfuture
PORT=5000
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Production (Render)

See [`ENVIRONMENT_VARIABLES.md`](ENVIRONMENT_VARIABLES.md) for exact copy-paste values.CT_APP_API_URL=http://localhost:5000/api
```

## 🔐 Security

- Passwords hashed with bcryptjs
- JWT-based authentication
- CORS enabled
- Environment variables for sensitive data
- MongoDB authentication required

## 📝 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - Student registration

### User
- `GET /api/user/profile` - Get user profile
- `GET /api/user/:userId/results` - Get user test results

### Admin
- `GET /api/admin/students` - Get all students
- `POST /api/admin/upload` - Bulk upload students
- `GET /api/admin/export` - Export all results

### Tests
- `GET /api/tests` - Get available tests
- `POST /api/submit-test` - Submit test responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 Licensehelp:
- [`ENVIRONMENT_VARIABLES.md`](ENVIRONMENT_VARIABLES.md) - Copy-paste environment values
- [`QUICK_START.md`](QUICK_START.md) - Quick deployment steps
- [`RENDER_DEPLOYMENT_GUIDE.md`](RENDER_DEPLOYMENT_GUIDE.md) - Comprehensive guid

## 🆘 Support

For deployment issues, see:
- [`RENDER_DEPLOYMENT_GUIDE.md`](RENDER_DEPLOYMENT_GUIDE.md) - Comprehensive guide
- [`QUICK_START.md`](QUICK_START.md) - Quick reference

## 🎉 Credits

Developed for MBA career assessment and student guidance.

---

**Ready to deploy?** Check out [`QUICK_START.md`](QUICK_START.md) to get started! 🚀
