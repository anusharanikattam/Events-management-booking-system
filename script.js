// Local Application Database
const eventsData = [
    { id: 1, title: "Global Tech Summit 2026", date: "July 15, 2026", location: "San Francisco, CA", price: 149, image: "https://picsum.photos" },
    { id: 2, title: "Rock Beats Festival", date: "August 22, 2026", location: "Austin, TX", price: 89, image: "https://picsum.photos" },
    { id: 3, title: "AI & UX Design Workshop", date: "September 05, 2026", location: "Online", price: 45, image: "https://picsum.photos" }
];

// Structural Element Selectors
const eventGrid = document.getElementById('eventGrid');
const bookingModal = document.getElementById('bookingModal');
const closeModal = document.getElementById('closeModal');
const ticketForm = document.getElementById('ticketForm');
const bookedList = document.getElementById('bookedList');

let activePrice = 0;

// Render Event Listings dynamically on page load
function displayEvents() {
    eventGrid.innerHTML = eventsData.map(event => `
        <div class="card">
            <img src="${event.image}" alt="${event.title}">
            <div class="card-body">
                <h3>${event.title}</h3>
                <p>📅 ${event.date}</p>
                <p>📍 ${event.location}</p>
                <div class="price">$${event.price}</div>
                <button class="btn" onclick="openBookingModal(${event.id})">Book Ticket</button>
            </div>
        </div>
    `).join('');
}

// Open booking window and populate structural values
function openBookingModal(eventId) {
    const selectedEvent = eventsData.find(e => e.id === eventId);
    if (!selectedEvent) return;

    activePrice = selectedEvent.price;
    document.getElementById('modalEventId').value = selectedEvent.id;
    document.getElementById('modalEventTitle').innerText = `Book tickets for: ${selectedEvent.title}`;
    document.getElementById('modalEventPrice').innerText = `$${selectedEvent.price}`;
    
    // Reset defaults
    document.getElementById('userName').value = '';
    document.getElementById('ticketQty').value = 1;
    calculateTotal();

    bookingModal.style.display = 'flex';
}

// Real-time pricing calculations
function calculateTotal() {
    const qty = parseInt(document.getElementById('ticketQty').value) || 1;
    document.getElementById('totalCost').innerText = `$${qty * activePrice}`;
}

// Watch inputs to handle dynamic pricing changes 
document.getElementById('ticketQty').addEventListener('input', calculateTotal);

// Hide modal functions
closeModal.addEventListener('click', () => bookingModal.style.display = 'none');
window.addEventListener('click', (e) => { if (e.target === bookingModal) bookingModal.style.display = 'none'; });

// Form Submission handling & local data persistence
ticketForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const eventId = parseInt(document.getElementById('modalEventId').value);
    const userName = document.getElementById('userName').value;
    const qty = parseInt(document.getElementById('ticketQty').value);
    const targetEvent = eventsData.find(evt => evt.id === eventId);

    const bookingRecord = {
        title: targetEvent.title,
        date: targetEvent.date,
        userName: userName,
        tickets: qty,
        totalPaid: qty * activePrice
    };

    // Pull current arrays or launch blank
    const savedBookings = JSON.parse(localStorage.getItem('myEventBookings')) || [];
    savedBookings.push(bookingRecord);
    localStorage.setItem('myEventBookings', JSON.stringify(savedBookings));

    bookingModal.style.display = 'none';
    renderBookingsSection();
});

// Render the user's booking updates from storage
function renderBookingsSection() {
    const savedBookings = JSON.parse(localStorage.getItem('myEventBookings')) || [];
    
    if (savedBookings.length === 0) {
        bookedList.innerHTML = `<p class="empty-message">No events booked yet.</p>`;
        return;
    }

    bookedList.innerHTML = savedBookings.map(b => `
        <div class="booking-item">
            <div>
                <strong>${b.title}</strong><br>
                <small>Date: ${b.date} | Attendee: ${b.userName}</small>
            </div>
            <div>
                <span class="badge">${b.tickets} Ticket(s)</span>
                <strong>$${b.totalPaid}</strong>
            </div>
        </div>
    `).join('');
}

// Initialization routine
displayEvents();
renderBookingsSection();
