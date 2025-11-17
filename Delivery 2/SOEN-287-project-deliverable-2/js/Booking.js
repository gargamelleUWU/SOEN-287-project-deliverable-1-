class Booking {
    constructor(resource, location, date, startTime, endTime, status) {
        this.resource = resource;
        this.location = location;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.id = Date.now().toString();
    }
}

function saveBookingsToStorage() {
    localStorage.setItem('campusBookings', JSON.stringify(allBookings));
}

function loadBookingsFromStorage() {
    const bookingsString = localStorage.getItem('campusBookings');
    if (bookingsString) {
        return JSON.parse(bookingsString);
    }
    return [];
}

let allBookings = loadBookingsFromStorage();

function renderBookings() {
    const container = document.getElementById('booking-list-container');
    if (!container) {
        console.error('Booking list container not found!');
        return;
    }

    container.innerHTML = '';

    if (allBookings.length === 0) {
        container.innerHTML = '<p class="muted">No bookings have been created yet.</p>';
        return;
    }

    allBookings.forEach(booking => {
        const statusClass = `status-${booking.status.toLowerCase()}`;

        const bookingCardHTML = `
            <div class="booking-card" data-booking-id="${booking.id}">
                <div>
                    <div class="label">Resource</div>
                    <strong>${booking.resource}</strong>
                </div>
                <div>
                    <div class="label">Location</div>
                    <strong>${booking.location}</strong>
                </div>
                <div>
                    <div class="label">Date</div>
                    <strong>${booking.date}</strong>
                </div>
                <div>
                    <div class="label">Time</div>
                    <strong>${booking.startTime} | ${booking.endTime}</strong>
                </div>
                <div>
                    <div class="label">Status</div>
                    <strong class="${statusClass}">
                        ${booking.status}
                    </strong>
                </div>
                <div class="booking-card-actions">
                <button class="btn btn-delete">Delete</button>
                </div>
            </div>`;

        container.innerHTML += bookingCardHTML;
    });
}

(function () {
    const manageBookingForm = document.getElementById('manageBookingForm');
    const messageEl = document.getElementById('form-message');

    const bookingListContainer = document.getElementById('booking-list-container');

    if (manageBookingForm) {
        manageBookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const resource = document.getElementById('resource').value;
            const location = document.getElementById('location').value;
            const date = document.getElementById('bookingDate').value;
            const startTime = document.getElementById('startTime').value;
            const endTime = document.getElementById('endTime').value;
            const status = 'available';

            const newBooking = new Booking(resource, location, date, startTime, endTime, status);

            allBookings.push(newBooking);

            saveBookingsToStorage();

            console.log("New Booking Saved:", newBooking);
            console.log("All Bookings in Storage:", allBookings);

            if (messageEl) {
                messageEl.textContent = 'Booking created successfully!';
                messageEl.className = 'success';
            }

            manageBookingForm.reset();

            renderBookings();

            setTimeout(() => {
                if (messageEl) {
                    messageEl.textContent = '';
                    messageEl.className = '';
                }
            }, 3000);
        });
    }

    if (bookingListContainer) {
        bookingListContainer.addEventListener('click', function (e) {
            if (e.target.classList.contains('btn-delete')) {
                const bookingCard = e.target.closest('.booking-card');
                const bookingId = bookingCard.dataset.bookingId;

                allBookings = allBookings.filter(booking => booking.id !== bookingId);

                saveBookingsToStorage();

                renderBookings();
            }
        });
    }

    renderBookings();

})();