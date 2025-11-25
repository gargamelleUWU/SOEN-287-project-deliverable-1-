// server.js - Enhanced with database persistence and proper user-booking linking
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// --- Parse JSON request bodies ---
app.use(express.json());

// === DATABASE FILES ===
const DB_DIR = path.join(__dirname, "database");
const USERS_DB = path.join(DB_DIR, "users.json");
const BOOKINGS_DB = path.join(DB_DIR, "bookings.json");

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR);
}

// === LOAD/SAVE FUNCTIONS ===
function loadUsers() {
  try {
    if (fs.existsSync(USERS_DB)) {
      const data = fs.readFileSync(USERS_DB, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error loading users:", err);
  }

  // Return default users if file doesn't exist
  return [
    {
      id: "admin1",
      name: "Admin User",
      email: "admin@concordia.ca",
      password: "admin123",
      role: "admin",
      createdAt: new Date().toISOString()
    },
    {
      id: "student1",
      name: "John Student",
      email: "student@concordia.ca",
      password: "student123",
      role: "student",
      createdAt: new Date().toISOString()
    }
  ];
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_DB, JSON.stringify(users, null, 2));
    console.log("Users saved to database");
  } catch (err) {
    console.error("Error saving users:", err);
  }
}

function loadBookings() {
  try {
    if (fs.existsSync(BOOKINGS_DB)) {
      const data = fs.readFileSync(BOOKINGS_DB, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error loading bookings:", err);
  }
  return [];
}

function saveBookings(bookings) {
  try {
    fs.writeFileSync(BOOKINGS_DB, JSON.stringify(bookings, null, 2));
    console.log("Bookings saved to database");
  } catch (err) {
    console.error("Error saving bookings:", err);
  }
}

// Initialize data from database
let users = loadUsers();
let bookings = loadBookings();

// Save initial data if files don't exist
if (!fs.existsSync(USERS_DB)) saveUsers(users);
if (!fs.existsSync(BOOKINGS_DB)) saveBookings(bookings);

// Helper: generate a simple unique id
function newId() {
  return Date.now().toString(36) + Math.random().toString(16).slice(2);
}

// === API ROUTES (bookings) ===

// GET /api/bookings -> list bookings (filtered by user or all for admin)
app.get("/api/bookings", (req, res) => {
  const userEmail = req.query.userEmail; // Get user email from query
  const userRole = req.query.userRole;   // Get user role from query

  if (userRole === "admin") {
    // Admin sees all bookings
    res.json(bookings);
  } else if (userEmail) {
    // Student sees only their own bookings
    const userBookings = bookings.filter(b =>
      b.userEmail && b.userEmail.toLowerCase() === userEmail.toLowerCase()
    );
    res.json(userBookings);
  } else {
    // No auth info provided - return empty array
    res.json([]);
  }
});

// POST /api/bookings -> create new booking (linked to user)
app.post("/api/bookings", (req, res) => {
  const data = req.body || {};

  // Require userEmail and userId for proper linking
  if (!data.userEmail || !data.userId) {
    return res.status(400).json({ error: "User authentication required" });
  }

  const booking = {
    id: newId(),
    userId: data.userId,           // Link to user ID
    userEmail: data.userEmail,     // Link to user email
    userName: data.userName || "",  // Store user name for display
    full: data.full || "",
    email: data.email || data.userEmail, // Use form email or user email
    resource: data.resource || "",
    people: data.people || "",
    notes: data.notes || "",
    date: data.date || "",
    start: data.start || "",
    end: data.end || "",
    purpose: data.purpose || "",
    building: data.building || "",
    length: data.length || "",
    equip: data.equip || "",
    status: data.status || "Pending", // Default to Pending for admin approval
    savedAt: new Date().toISOString()
  };

  bookings.push(booking);
  saveBookings(bookings);

  console.log("BOOKING CREATED:", { ...booking, userId: booking.userId });
  res.status(201).json(booking);
});

// PUT /api/bookings/:id -> update booking
app.put("/api/bookings/:id", (req, res) => {
  const id = req.params.id;
  const idx = bookings.findIndex((b) => b.id === id);

  if (idx === -1) {
    console.log("UPDATE FAILED, ID NOT FOUND:", id);
    return res.status(404).json({ error: "Booking not found" });
  }

  // Update booking
  bookings[idx] = {
    ...bookings[idx],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  saveBookings(bookings);

  console.log("BOOKING UPDATED:", bookings[idx]);
  res.json(bookings[idx]);
});

// DELETE /api/bookings/:id -> delete ONE booking
app.delete("/api/bookings/:id", (req, res) => {
  const id = req.params.id;
  const before = bookings.length;
  bookings = bookings.filter((b) => b.id !== id);
  const removed = bookings.length !== before;

  if (removed) {
    saveBookings(bookings);
  }

  console.log("DELETE REQUEST:", id, "REMOVED:", removed);
  res.json({ ok: removed });
});

// === API ROUTES (users/auth) ===

// POST /api/signup -> create new user account
app.post("/api/signup", (req, res) => {
  const { name, email, password, role } = req.body || {};

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  if (!role || (role !== "admin" && role !== "student")) {
    return res.status(400).json({ error: "Role must be 'admin' or 'student'" });
  }

  // Check if email already exists
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ error: "Email already registered" });
  }

  // Create new user
  const user = {
    id: newId(),
    name,
    email: email.toLowerCase(),
    password, // In production, you would hash this with bcrypt!
    role,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  saveUsers(users);

  console.log("USER CREATED:", { ...user, password: "[HIDDEN]" });

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  res.status(201).json(userWithoutPassword);
});

// POST /api/login -> authenticate user
app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Find user
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  console.log("USER LOGGED IN:", user.email, "Role:", user.role);

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// GET /api/users -> get all users (admin only)
app.get("/api/users", (req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  res.json(usersWithoutPasswords);
});

// --- Serve static files from /public ---
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Database stored in: ${DB_DIR}`);
});
