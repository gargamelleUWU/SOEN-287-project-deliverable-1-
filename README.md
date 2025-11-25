# 🎓 Campus Resource Booking System

A full-stack web application for managing campus resource bookings with authentication, role-based access control, and real-time statistics.

## 🚀 Quick Start

### 1. Install Node.js
Download from: https://nodejs.org (if not already installed)

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Server

**macOS/Linux:**
```bash
./START-SERVER.sh
```

**Windows:**
```cmd
START-SERVER.bat
```

**Or manually:**
```bash
npm start
```

### 4. Open Browser
Go to: **http://localhost:3000**

## 👤 Demo Accounts

**Admin:**
- Email: `admin@concordia.ca`
- Password: `admin123`

**Student:**
- Email: `student@concordia.ca`
- Password: `student123`

## 📚 Documentation

- **[SETUP-INSTRUCTIONS.md](SETUP-INSTRUCTIONS.md)** - Complete setup guide for any computer
- **[COMPLETE_SYSTEM_GUIDE.md](COMPLETE_SYSTEM_GUIDE.md)** - Full feature documentation
- **[AUTH_README.md](AUTH_README.md)** - Authentication system details

## ✨ Features

### For Students:
- ✅ Create account and login
- ✅ Book resources (pending admin approval)
- ✅ View own bookings
- ✅ Edit/cancel bookings

### For Admins:
- ✅ All student features
- ✅ See ALL bookings from ALL users
- ✅ Approve/reject booking requests
- ✅ View real-time statistics and analytics

## 🛠️ Tech Stack

- **Backend:** Node.js + Express
- **Database:** JSON file-based storage
- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Auth:** Custom authentication system

## 📂 Project Structure

```
├── START-SERVER.sh         # Quick start (macOS/Linux)
├── START-SERVER.bat        # Quick start (Windows)
├── server.js              # Express server
├── database/              # Data storage
│   ├── users.json        # User accounts
│   └── bookings.json     # Bookings
└── public/               # Frontend files
    ├── *.html           # Pages
    ├── css/             # Styles
    ├── js/              # JavaScript
    └── assets/          # Images
```

## 🔧 Common Commands

```bash
npm install        # Install dependencies
npm start         # Start server
Ctrl + C          # Stop server
```

## ⚠️ Important

- Always access via **http://localhost:3000** (NOT file://)
- Server must be running before opening browser
- Check [SETUP-INSTRUCTIONS.md](SETUP-INSTRUCTIONS.md) for troubleshooting

## 🎯 Works On

✅ Windows
✅ macOS
✅ Linux

## 📝 License

Educational project for SOEN 287

---

**Need help?** See [SETUP-INSTRUCTIONS.md](SETUP-INSTRUCTIONS.md) for detailed instructions.
