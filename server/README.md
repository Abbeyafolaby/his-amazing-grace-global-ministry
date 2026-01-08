# His Amazing Grace Global Ministry - Server

Backend API server for the document management system built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or later)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

   Then update the `.env` file with your configuration:
   
   - **For local MongoDB:**
     ```
     MONGO_URI=mongodb://localhost:27017/his-amazing-grace
     ```
   
   - **For MongoDB Atlas (cloud):**
     ```
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/his-amazing-grace?retryWrites=true&w=majority
     ```
   
   - **JWT Secret:** Change to a strong random string:
     ```
     JWT_SECRET=your_super_secret_jwt_key_min_32_chars
     ```

3. **Start the Server**
   
   For development (with auto-restart):
   ```bash
   npm run dev
   ```
   
   For production:
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Documents (Protected)
- `POST /api/documents/upload` - Upload a new document
- `GET /api/documents` - Get all documents (shared view)
- `GET /api/documents/my` - Get current user's documents
- `PUT /api/documents/:id/star` - Toggle star on a document

### Admin (Protected - Admin Only)
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/documents/:id` - Delete a specific document
- `DELETE /api/admin/documents` - Delete all documents

## Setting Admin Users

By default, all registered users have `isAdmin: false`. To grant admin privileges:

1. Connect to your MongoDB database
2. Update a user document:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { isAdmin: true } }
   )
   ```

## Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js            # User schema
│   └── Document.js        # Document schema
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── documents.js       # Document routes
│   └── admin.js           # Admin routes
├── middleware/
│   ├── auth.js            # JWT verification
│   └── admin.js           # Admin authorization
├── index.js               # Server entry point
├── .env                   # Environment variables (gitignored)
├── .env.example           # Environment template
└── package.json
```

## Security Notes

- Passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 30 days
- All protected routes require valid JWT token
- Admin routes check for `isAdmin: true` flag
- File size limit: 50MB for Base64 uploads

## Troubleshooting

**Cannot connect to MongoDB:**
- Ensure MongoDB is running locally OR
- Check your MongoDB Atlas connection string
- Verify network access settings in MongoDB Atlas

**401 Unauthorized errors:**
- Check that JWT token is being sent in Authorization header
- Verify token hasn't expired

**403 Forbidden (Admin routes):**
- Ensure user has `isAdmin: true` in database
