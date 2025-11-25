// booking-requests.js - Admin booking approval system
document.addEventListener("DOMContentLoaded", async function() {
  const pendingList = document.getElementById("pending-requests-list");

  if (!pendingList) return;

  // Helper to get current user from localStorage
  function getCurrentUser() {
    const userJson = localStorage.getItem("currentUser");
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch (e) {
      return null;
    }
  }

  // Load bookings from server
  async function loadBookings() {
    try {
      // Get current user - admin should see all bookings
      const currentUser = getCurrentUser();
      if (!currentUser) {
        console.log("No user logged in");
        return [];
      }

      // Build query params - admin sees all
      const params = new URLSearchParams({
        userEmail: currentUser.email,
        userRole: currentUser.role
      });

      const res = await fetch(`/api/bookings?${params}`);
      if (!res.ok) throw new Error("Failed to load bookings");
      return await res.json();
    } catch (err) {
      console.error("loadBookings error:", err);
      return [];
    }
  }

  // Update booking status on server
  async function updateBookingStatus(id, status) {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update booking");
      return await res.json();
    } catch (err) {
      console.error("updateBookingStatus error:", err);
      throw err;
    }
  }

  // Render pending booking requests
  function renderPendingRequests(bookings) {
    pendingList.innerHTML = "";

    // Filter for pending bookings only
    const pendingBookings = bookings.filter(b => b.status === "Pending");

    if (pendingBookings.length === 0) {
      const noRequests = document.createElement("div");
      noRequests.style.padding = "20px";
      noRequests.style.textAlign = "center";
      noRequests.className = "muted";
      noRequests.textContent = "No pending booking requests";
      pendingList.appendChild(noRequests);
      return;
    }

    // Sort by date (earliest first)
    pendingBookings.sort((a, b) => {
      const dateA = a.savedAt || a.date || "";
      const dateB = b.savedAt || b.date || "";
      return dateA.localeCompare(dateB);
    });

    pendingBookings.forEach(booking => {
      const row = document.createElement("div");
      row.className = "grid3";
      row.style.borderTop = "1px solid var(--line)";
      row.style.paddingTop = "12px";
      row.style.marginTop = "12px";
      row.dataset.id = booking.id;

      // User info
      const userDiv = document.createElement("div");
      userDiv.innerHTML = `
        <strong>${booking.full || "Unnamed User"}</strong><br>
        <span class="muted tiny">${booking.email || "No email"}</span>
      `;

      // Resource and time info
      const resourceDiv = document.createElement("div");
      const datePart = booking.date || "No date";
      const timePart = (booking.start && booking.end)
        ? `${booking.start}–${booking.end}`
        : "No time";
      resourceDiv.innerHTML = `
        <strong>${booking.resource || "No resource"}</strong><br>
        <span class="muted tiny">${datePart} · ${timePart}</span><br>
        <span class="muted tiny">${booking.building || "No building"}</span>
      `;

      // Action buttons
      const actionDiv = document.createElement("div");
      actionDiv.className = "cta-row";
      actionDiv.style.justifyContent = "flex-end";

      const approveBtn = document.createElement("button");
      approveBtn.className = "btn primary";
      approveBtn.textContent = "Approve";
      approveBtn.onclick = async function() {
        if (!confirm(`Approve booking for ${booking.full}?`)) return;

        try {
          await updateBookingStatus(booking.id, "Active");
          alert("Booking approved!");
          await refreshRequests();
        } catch (err) {
          alert("Failed to approve booking");
        }
      };

      const rejectBtn = document.createElement("button");
      rejectBtn.className = "btn";
      rejectBtn.textContent = "Reject";
      rejectBtn.onclick = async function() {
        if (!confirm(`Reject booking for ${booking.full}?`)) return;

        try {
          await updateBookingStatus(booking.id, "Rejected");
          alert("Booking rejected");
          await refreshRequests();
        } catch (err) {
          alert("Failed to reject booking");
        }
      };

      actionDiv.appendChild(approveBtn);
      actionDiv.appendChild(rejectBtn);

      row.appendChild(userDiv);
      row.appendChild(resourceDiv);
      row.appendChild(actionDiv);
      pendingList.appendChild(row);
    });
  }

  // Refresh the requests list
  async function refreshRequests() {
    const bookings = await loadBookings();
    renderPendingRequests(bookings);
  }

  // Initial load
  await refreshRequests();
});
