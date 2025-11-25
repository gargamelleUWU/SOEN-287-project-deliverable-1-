# 🚀 How to Run on ANY Computer - Ultra Simple Guide

## Step 1️⃣: Install Node.js (One-Time Setup)

### Don't have Node.js? Install it:

**Windows:**
1. Go to https://nodejs.org
2. Click the big green button "Download Node.js (LTS)"
3. Run the installer
4. Click "Next" → "Next" → "Install"
5. **Restart your computer**

**Mac:**
1. Go to https://nodejs.org
2. Click the big green button "Download Node.js (LTS)"
3. Open the downloaded file
4. Follow the installer
5. **Restart your computer**

**Already have Node.js?** Skip to Step 2!

---

## Step 2️⃣: Get the Project on Your Computer

1. Copy the entire project folder to your computer
2. Put it anywhere (Desktop, Documents, etc.)

Example locations:
- Windows: `C:\Users\YourName\Desktop\booking-system`
- Mac: `/Users/YourName/Desktop/booking-system`

---

## Step 3️⃣: Open Terminal/Command Prompt

### Windows:
1. Press `Windows Key + R`
2. Type: `cmd`
3. Press Enter
4. Type: `cd C:\path\to\your\project`
5. Press Enter

### Mac:
1. Press `Command + Space`
2. Type: `terminal`
3. Press Enter
4. Type: `cd /path/to/your/project`
5. Press Enter

**OR:** Just navigate to the project folder and:
- **Windows:** Shift + Right-click → "Open PowerShell window here"
- **Mac:** Right-click → Services → "New Terminal at Folder"

---

## Step 4️⃣: Install Dependencies (First Time Only!)

In the terminal, type:
```bash
npm install
```

Press Enter. Wait for it to finish (might take 1-2 minutes).

**You only need to do this ONCE per computer!**

---

## Step 5️⃣: Start the Server

### Easy Way (Recommended):

**Windows:**
- Double-click `START-SERVER.bat`

**Mac/Linux:**
- Double-click `START-SERVER.sh`
- If it doesn't work, open Terminal and type:
  ```bash
  chmod +x START-SERVER.sh
  ./START-SERVER.sh
  ```

### Manual Way:

In terminal, type:
```bash
npm start
```

You should see:
```
Server running at http://localhost:3000
```

✅ **Server is ready!**

---

## Step 6️⃣: Open in Browser

1. Open **Chrome, Firefox, Safari, or Edge**
2. Type in address bar: `http://localhost:3000`
3. Press Enter

🎉 **You should see the booking system!**

---

## Step 7️⃣: Login and Test

### Use Demo Accounts:

**Admin Account:**
- Email: `admin@concordia.ca`
- Password: `admin123`
- Can see ALL bookings and approve requests

**Student Account:**
- Email: `student@concordia.ca`
- Password: `student123`
- Can create bookings

### Or Create Your Own Account:
1. Click "Sign Up"
2. Fill in the form
3. Choose "Student" or "Admin"
4. Click "Create account"

---

## 🛑 How to Stop the Server

When you're done:
1. Go to the terminal window
2. Press `Ctrl + C` (Windows/Mac/Linux - same on all!)
3. Server stops

---

## ⚠️ Common Issues

### "Network error" when creating account

**Problem:** You opened the HTML file directly instead of through the server.

**Solution:**
- ❌ WRONG: Opening `index.html` by double-clicking
- ✅ RIGHT: Go to `http://localhost:3000` in browser

### "Port 3000 is already in use"

**Problem:** Server is already running from before.

**Solution:**
- Just close the old terminal window
- Or press `Ctrl + C` in the terminal
- Then start server again

### "Node.js is not installed"

**Problem:** Node.js not installed or not in PATH

**Solution:**
1. Install Node.js from https://nodejs.org
2. **Restart your computer** (important!)
3. Try again

### Logo not showing

**Problem:** Image path was wrong (now fixed!)

**Solution:** Refresh the page (Ctrl + R / Cmd + R)

---

## 📝 Quick Commands Cheat Sheet

```bash
# First time only (installs dependencies)
npm install

# Start server
npm start

# Stop server
Ctrl + C

# Check if Node.js is installed
node --version

# Check if npm is installed
npm --version
```

---

## 🎯 What's the Difference Between Computers?

### Each computer will have:
- ✅ Its own database (in `database/` folder)
- ✅ Its own user accounts
- ✅ Its own bookings

### To transfer data between computers:
1. Copy the entire project folder (including `database/`)
2. On new computer: Run `npm install` then `npm start`
3. All users and bookings come with it!

### For a fresh start on a new computer:
1. Just copy the project (without `database/` folder)
2. Run `npm install`
3. Run `npm start`
4. New database created automatically with demo accounts

---

## ✅ Verification Checklist

After starting, verify:
- [ ] Terminal shows "Server running at http://localhost:3000"
- [ ] Can open http://localhost:3000 in browser
- [ ] Can see the homepage
- [ ] Logo shows in top-left corner
- [ ] Can click "Sign Up" and "Login"
- [ ] Can create a new account
- [ ] Can login with demo accounts

If all checked, **you're ready to go!** 🎉

---

## 🆘 Still Having Issues?

1. **Make sure Node.js is installed:** `node --version` in terminal
2. **Make sure you ran `npm install` first**
3. **Make sure server is running** (see "Server running..." message)
4. **Make sure you're using http://localhost:3000** (not file://)
5. **Try restarting everything:**
   - Close terminal
   - Close browser
   - Open terminal fresh
   - Run `npm start`
   - Open browser fresh
   - Go to http://localhost:3000

---

## 🎓 That's It!

Your booking system is now running on YOUR computer!

**Remember:**
1. Server must be running (see terminal message)
2. Access via http://localhost:3000
3. To stop: Ctrl + C in terminal

**Every time you want to use it:**
1. Open terminal in project folder
2. Run `npm start`
3. Open browser to http://localhost:3000
4. Done!

🚀 **Happy booking!**
