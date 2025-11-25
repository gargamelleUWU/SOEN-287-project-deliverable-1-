// admin-statistics.js - Dynamic statistics based on actual booking data
document.addEventListener("DOMContentLoaded", async function () {
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

  // Load booking data from server
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

  // Calculate statistics from bookings
  function calculateStatistics(bookings) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter bookings from last 30 days
    const recentBookings = bookings.filter(b => {
      if (!b.savedAt && !b.date) return false;
      const bookingDate = new Date(b.savedAt || b.date);
      return bookingDate >= thirtyDaysAgo;
    });

    // Total bookings in last 30 days
    const totalBookings = recentBookings.length;

    // Most popular resource
    const resourceCount = {};
    recentBookings.forEach(b => {
      if (b.resource) {
        resourceCount[b.resource] = (resourceCount[b.resource] || 0) + 1;
      }
    });

    let mostPopularResource = "N/A";
    let maxCount = 0;
    for (const [resource, count] of Object.entries(resourceCount)) {
      if (count > maxCount) {
        maxCount = count;
        mostPopularResource = resource;
      }
    }

    // Peak booking hour (most common start time)
    const hourCount = {};
    recentBookings.forEach(b => {
      if (b.start) {
        const hour = b.start.split(':')[0];
        const hourLabel = `${hour}:00`;
        hourCount[hourLabel] = (hourCount[hourLabel] || 0) + 1;
      }
    });

    let peakHour = "N/A";
    let maxHourCount = 0;
    for (const [hour, count] of Object.entries(hourCount)) {
      if (count > maxHourCount) {
        maxHourCount = count;
        peakHour = hour;
      }
    }

    // Status counts
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let activeCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;
    let pendingCount = 0;
    let rejectedCount = 0;

    bookings.forEach(b => {
      if (b.status === "Cancelled") {
        cancelledCount++;
      } else if (b.status === "Rejected") {
        rejectedCount++;
      } else if (b.status === "Pending") {
        pendingCount++;
      } else if (b.date) {
        const bookingDate = new Date(b.date);
        bookingDate.setHours(0, 0, 0, 0);
        if (bookingDate < today) {
          completedCount++;
        } else {
          activeCount++;
        }
      } else {
        activeCount++;
      }
    });

    // Bookings per day for chart
    const dailyBookings = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dailyBookings[dateStr] = 0;
    }

    recentBookings.forEach(b => {
      const dateStr = b.date || (b.savedAt ? b.savedAt.split('T')[0] : null);
      if (dateStr && dailyBookings.hasOwnProperty(dateStr)) {
        dailyBookings[dateStr]++;
      }
    });

    return {
      totalBookings,
      mostPopularResource,
      peakHour,
      activeCount,
      completedCount,
      cancelledCount,
      pendingCount,
      rejectedCount,
      dailyBookings
    };
  }

  // Update DOM with statistics
  function updateStatistics(stats) {
    // Update top stat cards
    document.getElementById('stat-total').textContent = stats.totalBookings.toLocaleString();
    document.getElementById('stat-popular').textContent = stats.mostPopularResource;
    document.getElementById('stat-peak').textContent = stats.peakHour;

    // Update status counts
    document.getElementById('stat-pending-count').textContent = stats.pendingCount;
    document.getElementById('stat-active-count').textContent = stats.activeCount;
    document.getElementById('stat-completed-count').textContent = stats.completedCount;
    document.getElementById('stat-cancelled-count').textContent = stats.cancelledCount;
    document.getElementById('stat-rejected-count').textContent = stats.rejectedCount;

    // Render simple text-based chart
    renderChart(stats.dailyBookings);
  }

  // Render a simple text-based visualization of bookings per day
  function renderChart(dailyBookings) {
    const chartContainer = document.getElementById('chart-container');

    // Sort dates
    const sortedDates = Object.keys(dailyBookings).sort();
    const values = sortedDates.map(date => dailyBookings[date]);
    const maxValue = Math.max(...values, 1);

    // Create a simple bar chart using CSS
    chartContainer.innerHTML = '';
    chartContainer.style.display = 'block';
    chartContainer.style.padding = '16px';
    chartContainer.style.overflowX = 'auto';

    const chartDiv = document.createElement('div');
    chartDiv.style.display = 'flex';
    chartDiv.style.alignItems = 'flex-end';
    chartDiv.style.gap = '4px';
    chartDiv.style.height = '250px';
    chartDiv.style.minWidth = '600px';

    // Show last 30 days (most recent on right)
    const last30Days = sortedDates.slice(-30);

    last30Days.forEach(date => {
      const count = dailyBookings[date];
      const heightPercent = maxValue > 0 ? (count / maxValue) * 100 : 0;

      const barContainer = document.createElement('div');
      barContainer.style.flex = '1';
      barContainer.style.display = 'flex';
      barContainer.style.flexDirection = 'column';
      barContainer.style.alignItems = 'center';
      barContainer.style.justifyContent = 'flex-end';
      barContainer.style.height = '100%';
      barContainer.style.position = 'relative';

      const bar = document.createElement('div');
      bar.style.width = '100%';
      bar.style.height = heightPercent + '%';
      bar.style.backgroundColor = count > 0 ? 'var(--accent, #2563eb)' : '#e5e7eb';
      bar.style.borderRadius = '4px 4px 0 0';
      bar.style.transition = 'height 0.3s ease';
      bar.title = `${date}: ${count} booking${count !== 1 ? 's' : ''}`;

      const label = document.createElement('div');
      label.style.fontSize = '9px';
      label.style.color = '#6b7280';
      label.style.marginTop = '4px';
      label.style.transform = 'rotate(-45deg)';
      label.style.transformOrigin = 'top left';
      label.style.whiteSpace = 'nowrap';
      label.textContent = new Date(date + 'T00:00:00').getDate();

      barContainer.appendChild(bar);
      barContainer.appendChild(label);
      chartDiv.appendChild(barContainer);
    });

    chartContainer.appendChild(chartDiv);

    // Add legend
    const legend = document.createElement('div');
    legend.style.marginTop = '24px';
    legend.style.textAlign = 'center';
    legend.style.fontSize = '12px';
    legend.style.color = '#6b7280';
    legend.innerHTML = `
      <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <div style="width: 12px; height: 12px; background: var(--accent, #2563eb); border-radius: 2px;"></div>
          <span>Bookings</span>
        </div>
        <div>Total shown: ${values.reduce((a, b) => a + b, 0)} bookings over ${last30Days.length} days</div>
      </div>
    `;
    chartContainer.appendChild(legend);
  }

  // Filter bookings by date range
  function filterBookingsByDateRange(bookings, startDate, endDate) {
    if (!startDate || !endDate) return bookings;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return bookings.filter(b => {
      const bookingDate = new Date(b.date || b.savedAt);
      return bookingDate >= start && bookingDate <= end;
    });
  }

  // Handle report type changes (for future enhancements)
  const reportTypeSelect = document.getElementById('report-type');
  const dateStartInput = document.getElementById('date-start');
  const dateEndInput = document.getElementById('date-end');

  // Set default date range (last 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  dateEndInput.value = now.toISOString().split('T')[0];
  dateStartInput.value = thirtyDaysAgo.toISOString().split('T')[0];

  // Refresh statistics when date range changes
  async function refreshStats() {
    const allBookings = await loadBookings();
    const startDate = dateStartInput.value;
    const endDate = dateEndInput.value;

    const filteredBookings = startDate && endDate
      ? filterBookingsByDateRange(allBookings, startDate, endDate)
      : allBookings;

    const stats = calculateStatistics(filteredBookings);
    updateStatistics(stats);
  }

  if (dateStartInput && dateEndInput) {
    dateStartInput.addEventListener('change', refreshStats);
    dateEndInput.addEventListener('change', refreshStats);
  }

  if (reportTypeSelect) {
    reportTypeSelect.addEventListener('change', () => {
      // Future: implement different report types
      refreshStats();
    });
  }

  // Initial load
  refreshStats();
});
