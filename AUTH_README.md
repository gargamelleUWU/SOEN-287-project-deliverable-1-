# Authentication System Documentation

## Overview
This project now includes a comprehensive authentication system with role-based access control for **Admin** and **Student** accounts.

## Demo Accounts

### Admin Account
- **Email:** admin@concordia.ca
- **Password:** admin123

### Student Account
- **Email:** student@concordia.ca
- **Password:** student123

## Features

### 1. User Registration (Signup)
- Navigate to `/signup.html`
- Fill in:
  - Full name
  - Email
  - Account type (Student or Admin)
  - Password (minimum 8 characters)
  - Confirm password
- New accounts are saved to the server
- Auto-login after successful registration

### 2. User Login
- Navigate to `/login.html`
- Enter email and password
- Redirects based on role:
  - **Admin** → `/manage.html`
  - **Student** → `/index.html`

### 3. Role-Based Access Control

#### Student Features:
- Create new bookings
- View their booking dashboard
- Edit/cancel pending or active bookings
- View calendar and resources
- Bookings require admin approval (status: "Pending")

#### Admin Features:
- All student features PLUS:
- Access to admin pages:
  - **Booking Requests** (`/booking-request.html`) - Approve/reject pending bookings
  - **Statistics** (`/admin-statistics.html`) - View real-time booking analytics
  - **Availability** (`/admin-availability.html`) - Manage resource availability
  - **Manage** (`/manage.html`) - Admin dashboard
- View all bookings system-wide
- Approve or reject student booking requests

### 4. Booking Status Flow

1. **Pending** - Student creates booking → Waiting for admin approval (shown in orange)
2. **Active** - Admin approves booking → Booking is confirmed
3. **Rejected** - Admin rejects booking → Shown in past bookings
4. **Cancelled** - User cancels their own booking
5. **Completed** - Booking date has passed

### 5. Navigation Security
- Admin-only links are automatically hidden for students
- Attempting to access admin pages without admin role redirects to home
- Logout functionality available on all pages
- Profile page shows current user info and role

## Technical Implementation

### Frontend Files:
- `/public/js/auth.js` - Main authentication logic
- `/public/js/booking-requests.js` - Admin approval system
- `/public/signup.html` - Registration page
- `/public/login.html` - Login page
- `/public/profile.html` - User profile

### Backend API:
- `POST /api/signup` - Create new user account
- `POST /api/login` - Authenticate user
- `GET /api/users` - List all users (admin)
- `GET /api/bookings` - List bookings
- `PUT /api/bookings/:id` - Update booking status (approve/reject)

### Data Storage:
- Users stored in `server.js` (in-memory array)
- Current user stored in `localStorage`
- Bookings linked to user emails

## How to Test

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Test Student Flow:**
   - Login as student@concordia.ca / student123
   - Create a new booking (will be "Pending")
   - View in dashboard (shows "Pending Approval")
   - Notice admin links are hidden

3. **Test Admin Flow:**
   - Login as admin@concordia.ca / admin123
   - Go to Booking Requests
   - Approve or reject the student's booking
   - View statistics showing real booking counts
   - All admin pages accessible

4. **Test Registration:**
   - Create a new student account
   - Create a new admin account
   - Both should save and auto-login

## Security Notes
⚠️ **This is a demonstration system for educational purposes.**

In production, you should:
- Hash passwords (use bcrypt)
- Use proper session management (JWT tokens)
- Implement HTTPS
- Add CSRF protection
- Validate all inputs server-side
- Use a real database
- Add rate limiting
- Implement proper error handling

## Files Modified/Created

### New Files:
- `public/js/auth.js`
- `public/js/booking-requests.js`
- `AUTH_README.md`

### Modified Files:
- `server.js` - Added user storage and auth endpoints
- `public/signup.html` - Added role selection and form handling
- `public/login.html` - Added authentication form
- `public/profile.html` - Added user info display
- `public/booking-request.html` - Made dynamic with approve/reject
- `public/js/index.js` - Updated to handle Pending/Rejected statuses
- `public/js/admin-statistics.js` - Added pending/rejected counts
- `public/admin-statistics.html` - Added new status displays
- All pages now include `auth.js` for navigation security
