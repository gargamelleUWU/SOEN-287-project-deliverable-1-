# 🚀 Setup Instructions - Run on ANY Computer

## ✨ Quick Overview
This is a **Campus Resource Booking System** with authentication, role-based access control, and real-time statistics. It works on **ANY computer** with Node.js installed!

---

## 📋 Prerequisites

### You MUST have Node.js installed

**Check if you have it:**
```bash
node --version
npm --version
```

If you see version numbers, you're good! If not, install Node.js:

### Installing Node.js

#### 🍎 macOS:
```bash
# Option 1: Using Homebrew (recommended)
brew install node

# Option 2: Download installer
# Go to https://nodejs.org and download the macOS installer
```

#### 🪟 Windows:
1. Go to https://nodejs.org
2. Download the **LTS version** (e.g., 20.x.x)
3. Run the installer
4. Follow the setup wizard (use default settings)
5. Restart your computer

#### 🐧 Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install nodejs npm
```

---

## 🎯 Step-by-Step Setup (Works on ANY Computer!)

### Step 1: Get the Project Files

**Option A: Download ZIP**
1. Download the project as a ZIP file
2. Extract it to any folder (e.g., `Desktop/booking-system`)

**Option B: Clone from Git** (if using Git)
```bash
git clone <repository-url>
cd <project-folder>
```

### Step 2: Open Terminal/Command Prompt

**macOS/Linux:**
- Open Terminal app
- Navigate to project folder:
  ```bash
  cd /path/to/SOEN-287-project-deliverable-1-
  ```

**Windows:**
- Open Command Prompt or PowerShell
- Navigate to project folder:
  ```cmd
  cd C:\path\to\SOEN-287-project-deliverable-1-
  ```

### Step 3: Install Dependencies

In the terminal, run:
```bash
npm install
```

This will download all required packages. It only needs to be done ONCE.

### Step 4: Start the Server

**🍎 macOS/Linux:**
```bash
./START-SERVER.sh
```

**OR manually:**
```bash
npm start
```

**🪟 Windows:**
```cmd
START-SERVER.bat
```

**OR manually:**
```cmd
npm start
```

You should see:
```
Server running at http://localhost:3000
Database stored in: /path/to/database
```

### Step 5: Open in Browser

1. Open **Chrome, Firefox, Safari, or Edge**
2. Go to: **http://localhost:3000**
3. You should see the homepage!

---

## 🎓 How to Use the System

### Demo Accounts (Already Created)

**Admin Account:**
- Email: `admin@concordia.ca`
- Password: `admin123`
- Can: See all bookings, approve/reject requests, view statistics

**Student Account:**
- Email: `student@concordia.ca`
- Password: `student123`
- Can: Create bookings, see their own bookings

### Creating Your Own Account

1. Go to http://localhost:3000/signup.html
2. Fill in your information
3. Choose role: **Student** or **Admin**
4. Click "Create account"
5. You'll be logged in automatically!

### As a Student:

1. **Login:** http://localhost:3000/login.html
2. **Create Booking:**
   - Click "Book a Resource" on homepage
   - Fill out the form (resource, date, time, etc.)
   - Submit
   - Status will be "Pending Approval" (orange)
3. **View Your Bookings:**
   - Click "Bookings" in top menu
   - You'll ONLY see YOUR bookings
4. **Edit/Cancel:**
   - Click "Edit" or "Cancel" on any booking

### As an Admin:

1. **Login:** http://localhost:3000/login.html (use admin account)
2. **See All Bookings:**
   - Click "Bookings" → You see ALL students' bookings
3. **Approve/Reject Requests:**
   - Click "More" → "Booking Requests"
   - See all pending bookings from all students
   - Click "Approve" or "Reject"
4. **View Statistics:**
   - Click "More" → "Statistics"
   - See real-time charts and analytics
   - Total bookings, popular resources, peak hours, etc.

---

## 💾 Database Information

### Where is the data stored?

All data is stored in JSON files in the `database/` folder:

```
database/
  ├── users.json      # All user accounts (students + admins)
  └── bookings.json   # All bookings (linked to users)
```

### What happens on a new computer?

1. **First time running:** Database files are created automatically with demo accounts
2. **If you delete database folder:** Demo accounts are recreated automatically
3. **Fresh start:** Just delete the `database/` folder and restart the server

### Transferring data to another computer:

1. Copy the entire project folder (including `database/`)
2. On new computer: Run `npm install` then `npm start`
3. All users and bookings will be preserved!

---

## 🛠️ Common Issues & Solutions

### Issue: "Network error" when signing up

**Problem:** You're opening HTML files directly (file://) instead of through the server

**Solution:**
- ✅ DO: Access via http://localhost:3000
- ❌ DON'T: Double-click HTML files
- ❌ DON'T: Open file:///path/to/file.html

### Issue: "Address already in use" or "Port 3000 in use"

**Problem:** Server is already running from before

**Solution:**

**macOS/Linux:**
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Then start again
npm start
```

**Windows:**
```cmd
# Find process on port 3000
netstat -ano | findstr :3000

# Kill it (replace PID with actual number)
taskkill /PID <PID> /F

# Then start again
npm start
```

### Issue: Logo not showing

**Problem:** Logo file path was incorrect

**Solution:** This has been FIXED! The logo should now show correctly at:
- http://localhost:3000

### Issue: Can't see admin pages as student

**Solution:** This is CORRECT behavior! Students shouldn't see admin pages. Login as admin to access them.

### Issue: Student sees all bookings (they should only see theirs)

**Problem:** Old browser cache

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)
2. Refresh page (Ctrl+R / Cmd+R)
3. Or open in incognito/private window

---

## 🔄 Stopping the Server

When you're done, stop the server:

**In Terminal/Command Prompt:**
- Press `Ctrl + C` (works on all systems)
- You'll see "Server stopped" or similar message

---

## 📁 Project Structure

```
SOEN-287-project-deliverable-1-/
│
├── START-SERVER.sh              # macOS/Linux startup script ⭐ USE THIS
├── START-SERVER.bat             # Windows startup script ⭐ USE THIS
├── SETUP-INSTRUCTIONS.md        # This file
├── COMPLETE_SYSTEM_GUIDE.md     # Detailed feature documentation
├── AUTH_README.md               # Authentication system docs
│
├── server.js                    # Node.js backend (Express server)
├── package.json                 # Project dependencies
│
├── database/                    # Data storage (auto-created)
│   ├── users.json              # User accounts
│   └── bookings.json           # Booking records
│
└── public/                      # Frontend files
    ├── index.html              # Homepage (booking form)
    ├── login.html              # Login page
    ├── signup.html             # Registration page
    ├── booking-dashboard.html  # View bookings
    ├── booking-request.html    # Admin: Approve/reject (ADMIN ONLY)
    ├── admin-statistics.html   # Admin: Statistics (ADMIN ONLY)
    │
    ├── css/
    │   └── style.css           # Styling
    │
    ├── js/
    │   ├── auth.js             # Authentication system
    │   ├── index.js            # Booking form & dashboard
    │   ├── admin-statistics.js # Statistics calculations
    │   └── booking-requests.js # Admin approval system
    │
    └── assets/                 # Images, logos
        └── concordia-logo-icon.png
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Logo shows in top-left corner
- [ ] Can create a new student account
- [ ] Can login as student
- [ ] Can create a booking (shows as "Pending")
- [ ] Can login as admin
- [ ] Admin sees the student's booking in "Booking Requests"
- [ ] Admin can approve the booking
- [ ] Statistics show real numbers
- [ ] After server restart, data is still there

---

## 🎯 Quick Command Reference

```bash
# First time setup
npm install

# Start server (choose one)
npm start                    # All systems
./START-SERVER.sh           # macOS/Linux
START-SERVER.bat            # Windows

# Stop server
Ctrl + C

# Delete database (fresh start)
rm -rf database/            # macOS/Linux
rmdir /s database\          # Windows

# Check if server is running
curl http://localhost:3000  # Should see HTML
```

---

## 🆘 Need Help?

1. **Check server is running:** Look for "Server running at http://localhost:3000"
2. **Check Node.js version:** `node --version` (should be 18.x or higher)
3. **Clear browser cache:** Old data might be cached
4. **Try incognito/private window:** Fresh browser state
5. **Check terminal for errors:** Server logs show what's wrong
6. **Restart everything:**
   - Stop server (Ctrl+C)
   - Close browser
   - Start server again
   - Open browser fresh

---

## 🌟 System Features

✅ **User Authentication:** Signup, Login, Logout
✅ **Role-Based Access:** Admin vs Student permissions
✅ **Booking Management:** Create, Edit, Cancel bookings
✅ **Admin Approval:** Pending → Active/Rejected workflow
✅ **Real-Time Statistics:** Dynamic charts and analytics
✅ **Data Persistence:** All data saved to database files
✅ **Cross-Platform:** Works on Windows, macOS, Linux
✅ **Responsive Design:** Works on desktop and mobile browsers

---

## 📝 Important Notes

1. **Always access via http://localhost:3000** (NEVER file://)
2. **Server must be running** before opening browser
3. **Port 3000 must be free** (no other apps using it)
4. **Node.js is required** (install from nodejs.org)
5. **Database persists** between server restarts
6. **Each computer has its own database** (not shared)
7. **Fresh start:** Delete `database/` folder and restart server

---

## 🎓 Perfect for Your Project!

This system demonstrates:
- ✅ Node.js backend with Express
- ✅ RESTful API design
- ✅ File-based database (JSON)
- ✅ User authentication
- ✅ Role-based access control
- ✅ CRUD operations
- ✅ Real-time data
- ✅ Professional UI/UX

**Ready to run on ANY computer with Node.js!** 🚀
