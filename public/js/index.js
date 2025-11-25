// public/js/script.js
document.addEventListener("DOMContentLoaded", function () {
  // ===============================
  // 0) Footer year
  // ===============================
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ===============================
  // 1) Dropdown menus (.more and .adminmore)
  // ===============================
  const allDropdowns = document.querySelectorAll(".more, .adminmore");

  allDropdowns.forEach(function (dropdown) {
    const btn = dropdown.querySelector(".more-btn");
    if (!btn) return;

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains("open");
      allDropdowns.forEach((d) => d.classList.remove("open"));
      if (!isOpen) dropdown.classList.add("open");
    });
  });

  document.addEventListener("click", function (e) {
    let inside = false;
    allDropdowns.forEach((dropdown) => {
      if (dropdown.contains(e.target)) inside = true;
    });
    if (!inside) {
      allDropdowns.forEach((dropdown) => dropdown.classList.remove("open"));
    }
  });

  // ===============================
  // 2) Storage keys + API helpers
  // ===============================
  const DRAFT_KEY = "bookingDraft"; // local draft only

  const FIELD_IDS = [
    "full",
    "email",
    "resource",
    "people",
    "notes",
    "date",
    "start",
    "duration",
    "purpose",
    "building",
    "length"
  ];

  // Helper function to calculate end time from start + duration
  function calculateEndTime(startTime, durationMinutes) {
    if (!startTime || !durationMinutes) return "";

    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + parseInt(durationMinutes);

    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;

    return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
  }

  // ---- API calls to Node server ----
  async function loadHistory() {
    try {
      // Get current user to filter bookings
      const currentUser = getCurrentUser();
      if (!currentUser) {
        console.log("No user logged in");
        return [];
      }

      // Build query params based on role
      const params = new URLSearchParams({
        userEmail: currentUser.email,
        userRole: currentUser.role
      });

      const res = await fetch(`/api/bookings?${params}`);
      if (!res.ok) throw new Error("Failed to load bookings");
      return await res.json();
    } catch (err) {
      console.error("loadHistory error:", err);
      return [];
    }
  }

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

  async function saveBookingToServer(bookingData) {
    // Add user info to booking
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("User not logged in");
    }

    const bookingWithUser = {
      ...bookingData,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name
    };

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingWithUser)
    });
    if (!res.ok) throw new Error("Failed to save booking");
    return await res.json();
  }

  async function updateBookingOnServer(id, partial) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial)
    });
    if (!res.ok) throw new Error("Failed to update booking");
    return await res.json();
  }

  async function deleteBookingOnServer(id) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete booking (HTTP error)");
    return await res.json(); // { ok: true/false }
  }

  // ===============================
  // 3) FORM PAGE (index.html)
  // ===============================
  const form = document.getElementById("form");

  if (form) {
    // ---- 3a) Stepper (Next / Back) ----
    const stepSections = form.querySelectorAll(".s");
    const progressSteps = document.querySelectorAll(".progress .p-step");
    const nextButtons = form.querySelectorAll(".next");
    const backButtons = form.querySelectorAll(".back");

    let currentStepIndex = 0;

    function showStep(index) {
      stepSections.forEach((sec, i) => (sec.hidden = i !== index));

      progressSteps.forEach((p, i) => {
        p.classList.remove("is-done", "is-current");
        if (i < index) p.classList.add("is-done");
        if (i === index) p.classList.add("is-current");
      });

      currentStepIndex = index;
    }

    function validateCurrentStep() {
      const currentSection = stepSections[currentStepIndex];
      if (!currentSection) return true;

      const requiredFields = currentSection.querySelectorAll("[required]");
      let valid = true;

      requiredFields.forEach((field) => {
        field.classList.remove("field-error");
      });

      requiredFields.forEach((field) => {
        if (field.type === "radio") {
          const groupName = field.name;
          const checked = currentSection.querySelector(
            'input[name="' + groupName + '"]:checked'
          );
          if (!checked) valid = false;
        } else if (!field.value) {
          valid = false;
          field.classList.add("field-error");
        }
      });

      return valid;
    }

    nextButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!validateCurrentStep()) return;
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < stepSections.length) showStep(nextIndex);
      });
    });

    backButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) showStep(prevIndex);
      });
    });

    showStep(0);

    // ---- 3b) Draft read/save (local only) ----
    function readDraftData() {
      const data = {};

      FIELD_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) data[id] = el.value;
      });

      const equipChecked = document.querySelector(
        'input[name="equip"]:checked'
      );
      data.equip = equipChecked ? equipChecked.value : "";

      return data;
    }

    function saveDraft() {
      const draft = readDraftData();
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }

    function loadDraft() {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;

      try {
        const data = JSON.parse(raw);

        FIELD_IDS.forEach((id) => {
          const el = document.getElementById(id);
          if (el && data[id] !== undefined) {
            el.value = data[id];
          }
        });

        if (data.equip) {
          const radio = document.querySelector(
            'input[name="equip"][value="' + data.equip + '"]'
          );
          if (radio) radio.checked = true;
        }
      } catch (e) {
        console.error("Cannot parse draft data", e);
      }
    }

    FIELD_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", saveDraft);
        el.addEventListener("change", saveDraft);
      }
    });

    document
      .querySelectorAll('input[name="equip"]')
      .forEach((radio) => radio.addEventListener("change", saveDraft));

    loadDraft();

    // ---- 3b2) Calculate and show end time dynamically ----
    const startSelect = document.getElementById("start");
    const durationSelect = document.getElementById("duration");

    if (startSelect && durationSelect) {
      function updateEndTimeDisplay() {
        const start = startSelect.value;
        const duration = durationSelect.value;

        if (start && duration) {
          const endTime = calculateEndTime(start, duration);

          // Find or create end time display
          let endTimeDisplay = document.getElementById("end-time-display");
          if (!endTimeDisplay) {
            endTimeDisplay = document.createElement("div");
            endTimeDisplay.id = "end-time-display";
            endTimeDisplay.style.marginTop = "8px";
            endTimeDisplay.style.fontSize = "14px";
            endTimeDisplay.style.color = "#059669";
            endTimeDisplay.style.fontWeight = "600";
            durationSelect.parentElement.appendChild(endTimeDisplay);
          }

          endTimeDisplay.textContent = `📅 Ends at: ${formatTime(endTime)}`;
        }
      }

      function formatTime(time24) {
        const [hours, minutes] = time24.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
      }

      startSelect.addEventListener("change", updateEndTimeDisplay);
      durationSelect.addEventListener("change", updateEndTimeDisplay);
    }

    // ---- 3c) Final submit: send to Node server ----
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (!validateCurrentStep()) return;

      const draft = readDraftData();

      // Calculate end time from start + duration
      const endTime = calculateEndTime(draft.start, draft.duration);

      // Convert duration to human-readable format
      const durationNum = parseInt(draft.duration);
      let durationText = "";
      if (durationNum >= 60) {
        const hours = Math.floor(durationNum / 60);
        const mins = durationNum % 60;
        durationText = hours + (hours > 1 ? " hours" : " hour");
        if (mins > 0) durationText += " " + mins + " min";
      } else {
        durationText = durationNum + " min";
      }

      const booking = {
        ...draft,
        end: endTime,          // Add calculated end time
        length: durationText,  // Add human-readable duration
        status: "Pending",     // Changed from "Active" to "Pending"
        savedAt: new Date().toISOString()
      };

      try {
        const saved = await saveBookingToServer(booking);
        localStorage.setItem(DRAFT_KEY, JSON.stringify(saved));
        window.location.href = "booking-dashboard.html";
      } catch (err) {
        console.error("saveBooking error:", err);
        alert("Error saving booking to server");
      }
    });
  }

  // ===============================
  
// 4) DASHBOARD PAGE (booking-dashboard.html)
  // ===============================
  const activeBookingList = document.getElementById("active-booking-list");
  const pastList = document.getElementById("past-list");

  if (activeBookingList && pastList) {
    // We will render ALL upcoming bookings as rows (list view),
    // and past / cancelled bookings in the Past section.

    function splitActiveAndPast(history) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const active = [];
      const past = [];

      history.forEach((b) => {
        const isCancelled = b.status === "Cancelled";
        const isRejected = b.status === "Rejected";

        let dateObj = null;
        if (b.date) {
          dateObj = new Date(b.date);
          dateObj.setHours(0, 0, 0, 0);
        }

        if (isCancelled || isRejected) {
          past.push(b);
        } else if (!dateObj) {
          past.push(b);
        } else if (dateObj < today) {
          past.push(b); // date already passed
        } else {
          active.push(b); // future + not cancelled/rejected (includes Pending and Active)
        }
      });

      return { active, past };
    }

    function renderActive(activeList) {
      activeBookingList.innerHTML = "";

      if (!activeList.length) {
        const p = document.createElement("p");
        p.className = "muted tiny";
        p.textContent = "No active bookings.";
        activeBookingList.appendChild(p);
        return;
      }

      // Sort by date + start time (earliest first)
      activeList.sort((a, b) => {
        const aKey = (a.date || "") + " " + (a.start || "");
        const bKey = (b.date || "") + " " + (b.start || "");
        return aKey.localeCompare(bKey);
      });

      activeList.forEach((booking) => {
        const row = document.createElement("div");
        row.className = "grid3";
        row.dataset.id = booking.id;

        const datePart = booking.date || "";
        const timePart =
          (booking.start || "") && (booking.end || "")
            ? `${booking.start}–${booking.end}`
            : "";

        const nameEmail =
          (booking.full || "Unnamed") +
          (booking.email ? " — " + booking.email : "");

        const statusLabel = booking.status === "Pending" ? "Pending Approval" : "Upcoming";
        const statusColor = booking.status === "Pending" ? "color: #f59e0b;" : "";

        row.innerHTML = `
          <div>
            <strong>${booking.resource || "Resource"}</strong><br>
            <span class="muted tiny">
              ${datePart ? datePart + " · " : ""}${timePart ? timePart + " · " : ""}<span style="${statusColor}">${statusLabel}</span>
            </span><br>
            <span class="muted tiny">${nameEmail}</span>
          </div>
          <div>
            <span class="muted">${booking.building || "Campus building"}</span>
          </div>
          <div class="cta-row" style="justify-content:flex-end;">
            <button class="btn primary btn-edit-active" data-id="${booking.id}">Edit</button>
            <button class="btn btn-cancel-active" data-id="${booking.id}">Cancel</button>
          </div>
        `;

        activeBookingList.appendChild(row);
      });
    }

    function renderPast(pastBookings) {
      pastList.innerHTML = "";

      if (!pastBookings.length) {
        const li = document.createElement("li");
        li.textContent = "No past bookings yet.";
        pastList.appendChild(li);
        return;
      }

      // Newest first
      pastBookings.sort((a, b) => {
        const da = a.date || "";
        const db = b.date || "";
        return db.localeCompare(da);
      });

      pastBookings.forEach((b) => {
        const li = document.createElement("li");

        const datePart = b.date || "";
        const timePart =
          (b.start || "") && (b.end || "")
            ? `${b.start}–${b.end}`
            : "";

        let statusLabel = "";
        if (b.status === "Cancelled") {
          statusLabel = " (Cancelled)";
        } else if (b.status === "Rejected") {
          statusLabel = " (Rejected)";
        } else {
          statusLabel = " (Completed)";
        }

        const text =
          (b.resource || "Resource") +
          (datePart ? " — " + datePart : "") +
          (timePart ? " · " + timePart : "") +
          statusLabel;

        li.dataset.id = b.id;
        li.innerHTML = `
          <span>${text}</span>
          <button class="btn btn-delete-past" data-id="${b.id}">Delete</button>
        `;

        pastList.appendChild(li);
      });
    }

    async function refreshDashboard() {
      const history = await loadHistory();
      const { active, past } = splitActiveAndPast(history);
      renderActive(active);
      renderPast(past);
    }

    // Initial render
    refreshDashboard();

    // Delete past booking (event delegation)
    pastList.addEventListener("click", async function (e) {
      const btn = e.target.closest(".btn-delete-past");
      if (!btn) return;

      const id = btn.getAttribute("data-id");
      if (!id) return;

      if (!confirm("Delete this past booking?")) return;

      try {
        const ok = await deleteBookingOnServer(id);
        if (!ok) {
          alert("Error deleting booking");
          return;
        }
        await refreshDashboard();
      } catch (err) {
        console.error("Delete error:", err);
        alert("Error deleting booking");
      }
    });

    // Active booking buttons (Edit / Cancel) using event delegation
    activeBookingList.addEventListener("click", async function (e) {
      const editBtn = e.target.closest(".btn-edit-active");
      const cancelBtn = e.target.closest(".btn-cancel-active");

      // Edit
      if (editBtn) {
        const id = editBtn.getAttribute("data-id");
        if (!id) return;

        try {
          const history = await loadHistory();
          const booking = history.find((b) => b.id === id);
          if (booking) {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(booking));
          }
          window.location.href = "index.html";
        } catch (err) {
          console.error("Edit load error:", err);
        }
        return;
      }

      // Cancel
      if (cancelBtn) {
        const id = cancelBtn.getAttribute("data-id");
        if (!id) return;

        if (!confirm("Cancel this booking?")) return;

        try {
          await updateBookingOnServer(id, { status: "Cancelled" });
          localStorage.removeItem(DRAFT_KEY);
          await refreshDashboard();
        } catch (err) {
          console.error("Cancel error:", err);
          alert("Error cancelling booking");
        }
      }
    });
  }
// ===============================
  // 5) CALENDAR PAGE – Month + 8–4 Time slots
  // ===============================
  const calGrid = document.getElementById("cal-grid");
  const calMonthLabel = document.getElementById("cal-month-label");
  const calPrev = document.getElementById("cal-prev");
  const calNext = document.getElementById("cal-next");
  const selectedDateLabel = document.getElementById("selected-date-label");
  const timeSlotsContainer = document.getElementById("time-slots");

  if (
    calGrid &&
    calMonthLabel &&
    calPrev &&
    calNext &&
    selectedDateLabel &&
    timeSlotsContainer
  ) {
    let history = [];

    // ---- 8:00–16:00 in 30-minute steps ----
    const ALL_SLOTS = [];
    for (let h = 8; h < 16; h++) {
      for (let m of [0, 30]) {
        const hh = String(h).padStart(2, "0");
        const mm = String(m).padStart(2, "0");
        ALL_SLOTS.push(`${hh}:${mm}`);
      }
    }

    const MORNING_SLOTS = ALL_SLOTS.filter(
      (t) => Number(t.split(":")[0]) < 12
    );
    const AFTERNOON_SLOTS = ALL_SLOTS.filter(
      (t) => Number(t.split(":")[0]) >= 12
    );

    function timeToMinutes(t) {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    }

    let current = new Date();
    current.setDate(1);
    let selectedISO = null;

    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    function formatISO(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }

    function renderCalendar() {
      calMonthLabel.textContent = `${monthNames[current.getMonth()]} ${
        current.getFullYear()
      }`;

      calGrid.innerHTML = "";

      const year = current.getFullYear();
      const month = current.getMonth();

      const firstDay = new Date(year, month, 1);
      const firstWeekday = firstDay.getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let i = 0; i < firstWeekday; i++) {
        const emptyCell = document.createElement("div");
        calGrid.appendChild(emptyCell);
      }

      const todayISO = formatISO(new Date());

      for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(year, month, day);
        const iso = formatISO(dateObj);

        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = String(day);
        btn.dataset.iso = iso;

        btn.style.borderRadius = "999px";
        btn.style.padding = "6px 0";
        btn.style.border = "1px solid transparent";
        btn.style.cursor = "pointer";
        btn.style.background = "transparent";

        if (iso === todayISO) {
          btn.style.borderColor = "var(--accent, #2563eb)";
        }

        if (selectedISO === iso) {
          btn.style.background = "var(--accent, #2563eb)";
          btn.style.color = "white";
        }

        btn.addEventListener("click", () => {
          selectedISO = iso;
          renderCalendar();
          renderTimeSlots(iso);
        });

        calGrid.appendChild(btn);
      }
    }

    function renderTimeSlots(isoDate) {
      if (!isoDate) {
        selectedDateLabel.textContent = "Select a day to see available times.";
        timeSlotsContainer.innerHTML = "";
        return;
      }

      const readable = new Date(isoDate + "T00:00:00");
      selectedDateLabel.textContent =
        "Available times for " +
        readable.toLocaleDateString("en-CA", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric"
        });

      timeSlotsContainer.innerHTML = "";

      function createGroup(title, slots) {
        const groupDiv = document.createElement("div");
        groupDiv.style.marginTop = "12px";

        const h4 = document.createElement("h4");
        h4.textContent = title;
        h4.style.marginBottom = "6px";
        groupDiv.appendChild(h4);

        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.flexWrap = "wrap";
        row.style.gap = "8px";

        slots.forEach((time) => {
          const slotMinutes = timeToMinutes(time);

          const booked = history.some((b) => {
            if (b.date !== isoDate) return false;
            if (b.status === "Cancelled") return false;
            if (!b.start || !b.end) return false;

            const startM = timeToMinutes(b.start);
            const endM = timeToMinutes(b.end);
            return slotMinutes >= startM && slotMinutes < endM;
          });

          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = time + (booked ? " (Booked)" : "");
          btn.style.padding = "4px 10px";
          btn.style.borderRadius = "999px";
          btn.style.border = "1px solid var(--line, #e5e7eb)";
          btn.style.background = booked ? "#f3f4f6" : "white";
          btn.style.cursor = booked ? "not-allowed" : "pointer";
          btn.disabled = booked;

          btn.addEventListener("click", () => {
            if (booked) return;
            timeSlotsContainer
              .querySelectorAll("button")
              .forEach((b) => (b.style.outline = "none"));
            btn.style.outline = "2px solid var(--accent, #2563eb)";
          });

          row.appendChild(btn);
        });

        groupDiv.appendChild(row);
        timeSlotsContainer.appendChild(groupDiv);
      }

      createGroup("Morning", MORNING_SLOTS);
      createGroup("Afternoon", AFTERNOON_SLOTS);
    }

    calPrev.addEventListener("click", () => {
      current.setMonth(current.getMonth() - 1);
      renderCalendar();
      renderTimeSlots(selectedISO);
    });

    calNext.addEventListener("click", () => {
      current.setMonth(current.getMonth() + 1);
      renderCalendar();
      renderTimeSlots(selectedISO);
    });

    (async function initCalendar() {
      history = await loadHistory();
      renderCalendar();
      renderTimeSlots(null);
    })();
  }
});
