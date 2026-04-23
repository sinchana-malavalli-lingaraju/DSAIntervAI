# Authentication Integration

## Overview
The DSA IntervAI application now includes a complete authentication system with login and registration functionality.

## Features

### 🔐 Authentication Features
- **User Registration**: Create new accounts with name, email, and password
- **User Login**: Secure login with email and password
- **JWT Tokens**: Secure token-based authentication
- **Route Protection**: Protected routes require authentication
- **User Session**: Persistent login state across browser sessions
- **Password Security**: Bcrypt hashing for secure password storage

### 🎨 UI Components
- **Login Page**: Clean, modern login interface with dark mode support
- **Register Page**: User-friendly registration form with validation
- **User Menu**: Header dropdown with user info and logout
- **Protected Routes**: Automatic redirection to login for unauthenticated users
- **Loading States**: Smooth loading indicators during authentication

### 🛡️ Security Features
- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: 7-day expiration with secure signing
- **Input Validation**: Client and server-side validation
- **Error Handling**: Secure error messages without information leakage
- **CORS Configuration**: Proper cross-origin resource sharing

## How It Works

### 1. User Registration
- Users can register with name, email, and password
- Password must be at least 6 characters long
- Email must be unique
- Password is hashed using bcrypt before storage

### 2. User Login
- Users login with email and password
- Server validates credentials and returns JWT token
- Token is stored in localStorage for persistence
- Token is automatically included in API requests

### 3. Route Protection
- Protected routes check authentication status
- Unauthenticated users are redirected to login
- Login page remembers intended destination
- Automatic redirect after successful login

### 4. User Experience
- **Landing Page**: Shows different content for authenticated vs unauthenticated users
- **Header**: Displays user avatar and name when logged in
- **Navigation**: Seamless flow between authenticated and public pages
- **Dark Mode**: All auth components support theme switching

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info (protected)

### Request/Response Examples

#### Register
```javascript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Login
```javascript
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## File Structure

### Frontend Components
- `client/src/contexts/AuthContext.js` - Authentication context and state management
- `client/src/components/Login.js` - Login page component
- `client/src/components/Register.js` - Registration page component
- `client/src/components/ProtectedRoute.js` - Route protection wrapper
- `client/src/components/Auth.css` - Authentication component styles

### Backend Implementation
- `server/server.js` - Authentication routes and middleware
- JWT secret configuration
- In-memory user storage (can be replaced with database)

## Usage

### For Users
1. **First Time**: Click "Sign Up" on landing page to create account
2. **Returning**: Click "Start Practicing" to login
3. **Navigation**: Use header user menu to logout
4. **Protected Features**: All practice features require authentication

### For Developers
1. **Adding Protected Routes**: Wrap components with `<ProtectedRoute>`
2. **Accessing User Data**: Use `useAuth()` hook in components
3. **API Calls**: Tokens are automatically included in axios requests
4. **Styling**: Use CSS variables for theme consistency

## Security Notes

- **Production**: Change JWT_SECRET in server configuration
- **Database**: Replace in-memory storage with proper database
- **HTTPS**: Use HTTPS in production for secure token transmission
- **Validation**: Add email validation and stronger password requirements
- **Rate Limiting**: Consider adding rate limiting for auth endpoints

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social login (Google, GitHub)
- [ ] User profiles and settings
- [ ] Session management
- [ ] Two-factor authentication
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Admin panel for user management



