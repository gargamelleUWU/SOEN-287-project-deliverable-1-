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

function getImageForResource(resourceType) {
    switch (resourceType) {
        case 'Study Room':
            return '../assets/Study room.jpg';
        case 'Computer Lab':
            return '../assets/comp-lab.jpg';
        case 'Sports Court':
            return '../assets/Uiversity sport hall .webp';
        case 'Art Studio':
            return '../assets/art.jpg';
        case 'Leisure Space':
            return '../assets/leisure.jpg';
        default:
            return '../assets/concordia-logo-icon.png';
    }
}

function renderAvailableBookings() {
    const allBookings = loadBookingsFromStorage();
    const container = document.getElementById('cardsWrap');

    // *** GET NEW FILTER VALUES ***
    const filterType = document.getElementById('fType').value;
    const filterLocation = document.getElementById('fLocation').value.toLowerCase();
    const filterDate = document.getElementById('fDate').value; // Get the date value


    const availableBookings = allBookings.filter(booking => {

        // *** UPDATE FILTER LOGIC ***
        const isAvailable = booking.status.toLowerCase() === 'available';
        const typeMatch = !filterType || booking.resource === filterType;
        const locationMatch = !filterLocation || booking.location.toLowerCase().includes(filterLocation);
        const dateMatch = !filterDate || booking.date === filterDate; // Add date logic

        return isAvailable && typeMatch && locationMatch && dateMatch; // Updated return
    });

    container.innerHTML = '';

    if (availableBookings.length === 0) {
        container.innerHTML = '<p class="muted no-bookings-msg">No available resources match your criteria.</p>';
        return;
    }

    availableBookings.forEach(booking => {
        const cardHTML = `
        <article class="card resource-card" data-booking-id="${booking.id}">
            <img class="resource-card-image" src="${getImageForResource(booking.resource)}" alt="${booking.resource}">
            <div class="resource-card-content">
                <div class="muted tiny">${booking.resource}</div>
                <h3>${booking.location}</h3> 
                <p class="muted">
                    Date: <strong>${booking.date}</strong><br>
                    Time: <strong>${booking.startTime} to ${booking.endTime}</strong>
                </p>
                <div class="cta-row">
                    <button class="btn primary btn-request">Request</button>
                    <a class="btn" href="resource-details.html">Details</a>
                </div>
            </div>
        </article>`;
        container.innerHTML += cardHTML;
    });
}

(function () {
    const filterForm = document.getElementById('filterForm');
    const cardsContainer = document.getElementById('cardsWrap');

    if (cardsContainer) {
        cardsContainer.addEventListener('click', function (e) {
            if (e.target.classList.contains('btn-request')) {

                const card = e.target.closest('.resource-card');
                const bookingId = card.dataset.bookingId;

                let allBookings = loadBookingsFromStorage();

                const bookingIndex = allBookings.findIndex(b => b.id === bookingId);

                if (bookingIndex > -1) {
                    allBookings[bookingIndex].status = 'Requested';

                    saveBookingsToStorage(allBookings);

                    renderAvailableBookings();
                }
            }
        });
    }

    if (filterForm) {
        filterForm.addEventListener('change', renderAvailableBookings);
        filterForm.addEventListener('keyup', renderAvailableBookings);
    }

    renderAvailableBookings();
})();