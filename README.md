# TaskFlow — Project Management Tool

**TaskFlow** is a full-stack project management application designed to help users organize projects and manage tasks through a centralized workspace. It provides user authentication, project management, and task organization through a React-based interface connected to a Node.js REST API and PostgreSQL database.

## Live Demo

🌐 **Application:** https://code-alpha-weld.vercel.app/

⚙️ **Backend API:** https://taskflow-api-k5se.onrender.com

## Features

- **User Registration:** Create a user account.
- **User Authentication:** Secure login using JWT authentication.
- **Project Management:** Create and view projects.
- **Task Management:** Create and organize tasks within projects.
- **Project-Based Organization:** Retrieve tasks associated with specific projects.
- **Protected API Routes:** Authenticate requests using Bearer tokens.
- **Database Persistence:** Store application data in PostgreSQL.
- **REST API Architecture:** Separate frontend and backend responsibilities.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Fetch API

### Backend
- Node.js
- Express.js
- REST API
- JSON Web Tokens (JWT)

### Database and ORM
- PostgreSQL
- Prisma ORM

### Deployment
- Vercel — Frontend
- Render — Backend
- PostgreSQL — Database

## Project Structure

```text
CodeAlpha/
└── CodeAlpha-ProjectManagementTool/
    ├── client/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── context/
    │   │   └── services/
    │   └── package.json
    │
    └── server/
        ├── prisma/
        ├── src/
        │   ├── routes/
        │   ├── middleware/
        │   └── server.js
        └── package.json
```

## Getting Started

### Prerequisites

- Node.js and npm
- PostgreSQL database
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Elizabethdebebe1234/CodeAlpha.git
cd CodeAlpha/CodeAlpha-ProjectManagementTool
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
```

Generate the Prisma client and synchronize the database schema:

```bash
npx prisma generate
npx prisma db push
```

Start the backend:

```bash
npm start
```

### 3. Configure the frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local development URL shown by Vite, usually `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in a user |
| GET | `/api/projects` | Retrieve projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:projectId/tasks` | Retrieve tasks for a project |
| POST | `/api/projects/:projectId/tasks` | Create a task in a project |

Protected endpoints require a valid JWT Bearer token.

## Authentication and Data

- JWT is used to authenticate users.
- Protected requests include an authorization token.
- PostgreSQL stores application data.
- Prisma ORM manages database access and schema synchronization.
- Environment variables hold database credentials and authentication secrets.

## Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** PostgreSQL

## Future Improvements

- Task status and priority management.
- Task assignment and collaboration.
- Project progress tracking.
- Due dates and deadlines.
- Notifications and activity tracking.

## Developer

**Elizabeth Debebe**

- GitHub: [Elizabethdebebe1234](https://github.com/Elizabethdebebe1234)
- Repository: [CodeAlpha](https://github.com/Elizabethdebebe1234/CodeAlpha)

## Internship

Developed as part of the **CodeAlpha Full Stack Development Internship**.
