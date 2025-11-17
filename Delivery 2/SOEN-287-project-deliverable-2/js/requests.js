/* * ========================================
 * js/requests.js (Admin Booking Requests Page)
 * ========================================
 */

// --- Storage Helper Functions ---
// (Copied from our other files for consistency)
function saveBookingsToStorage(bookings) {
    localStorage.setItem('campusBookings', JSON.stringify(bookings));
}

function loadBookingsFromStorage() {
    const bookingsString = localStorage.getItem('campusBookings');
    if (bookingsString) {
        return JSON.parse(bookingsString);
    }
    return [];
}

// --- Main Render Function ---
function renderRequests() {
    const container = document.getElementById('requests-list-container');
    const allBookings = loadBookingsFromStorage();

    // 1. Filter to find only "Requested" bookings
    const requestedBookings = allBookings.filter(b => b.status.toLowerCase() === 'requested');

    // Clear the container
    container.innerHTML = '';

    // 2. Check if any requests are pending
    if (requestedBookings.length === 0) {
        container.innerHTML = '<p class="muted" style="text-align: center; padding-top: 20px;">No pending booking requests.</p>';
        return;
    }

    // 3. Loop and render each request
    requestedBookings.forEach(booking => {
        // NOTE: We don't have user data yet, so I'll put a placeholder.
        // We can add "Requested by: [User ID]" or similar later.
        const requestRowHTML = `
            <div class="grid3 request-item-row" data-booking-id="${booking.id}">
                <div>
                    <strong>User-Placeholder</strong>
                    <div class="muted tiny">User ID: ${booking.id}</div>
                </div>
                <div>
                    <strong>${booking.location} (${booking.resource})</strong>
                    <div class="muted tiny">${booking.date} · ${booking.startTime}–${booking.endTime}</div>
                </div>
                <div class="request-item-actions">
                    <button class="btn primary btn-approve">Approve</button>
                    <button class="btn btn-reject">Reject</button>
                </div>
            </div>`;

        container.innerHTML += requestRowHTML;
    });
}

// --- Event Listeners (IIFE) ---
(function () {
    const container = document.getElementById('requests-list-container');

    if (container) {
        container.addEventListener('click', function (e) {

            const allBookings = loadBookingsFromStorage();

            // Find which row the button was in
            const row = e.target.closest('.request-item-row');
            if (!row) return; // Click was not on a row

            const bookingId = row.dataset.bookingId;
            const bookingIndex = allBookings.findIndex(b => b.id === bookingId);

            if (bookingIndex === -1) {
                console.error("Could not find booking.");
                return;
            }

            // Check if Approve button was clicked
            if (e.target.classList.contains('btn-approve')) {
                // Change status to "Confirmed" (green)
                allBookings[bookingIndex].status = 'Confirmed';
                console.log(`Booking ${bookingId} approved (Confirmed)`);
            }
            // Check if Reject button was clicked
            else if (e.target.classList.contains('btn-reject')) {
                // Change status back to "available" (blue)
                allBookings[bookingIndex].status = 'available';
                console.log(`Booking ${bookingId} rejected (available)`);
            }

            // Save the updated array back to storage
            saveBookingsToStorage(allBookings);

            // Re-render the list (the item just actioned will disappear)
            renderRequests();
        });
    }

    // Initial render on page load
    renderRequests();
})();