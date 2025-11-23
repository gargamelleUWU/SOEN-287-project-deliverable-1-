// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// --- Parse JSON request bodies ---
app.use(express.json());

// === API ROUTES (bookings) ===
// We mount them BEFORE static, but /api/* is not affected by static anyway.

// In-memory array for bookings (OK for this assignment)
let bookings = [];

// Helper: generate a simple unique id
function newId() {
  return Date.now().toString(36) + Math.random().toString(16).slice(2);
}

// GET /api/bookings  -> list all bookings
app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

// POST /api/bookings -> create new booking
app.post("/api/bookings", (req, res) => {
  const data = req.body || {};

  const booking = {
    id: newId(),
    full: data.full || "",
    email: data.email || "",
    resource: data.resource || "",
    people: data.people || "",
    notes: data.notes || "",
    date: data.date || "",
    start: data.start || "",
    end: data.end || "",
    purpose: data.purpose || "",
    building: data.building || "",
    length: data.length || "",
    status: data.status || "Active",
    savedAt: new Date().toISOString()
  };

  bookings.push(booking);
  console.log("BOOKING CREATED:", booking);
  res.status(201).json(booking);
});

// PUT /api/bookings/:id -> update booking (e.g., cancel)
app.put("/api/bookings/:id", (req, res) => {
  const id = req.params.id;
  const idx = bookings.findIndex((b) => b.id === id);

  if (idx === -1) {
    console.log("UPDATE FAILED, ID NOT FOUND:", id);
    return res.status(404).json({ error: "Booking not found" });
  }

  bookings[idx] = {
    ...bookings[idx],
    ...req.body
  };

  console.log("BOOKING UPDATED:", bookings[idx]);
  res.json(bookings[idx]);
});

// DELETE /api/bookings/:id -> delete ONE booking
app.delete("/api/bookings/:id", (req, res) => {
  const id = req.params.id;
  const before = bookings.length;
  bookings = bookings.filter((b) => b.id !== id);
  const removed = bookings.length !== before;

  console.log("DELETE REQUEST:", id, "REMOVED:", removed);
  // Always return 200, but tell client if it was removed or not
  res.json({ ok: removed });
});

// --- Serve static files from /public ---
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
