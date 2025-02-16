document.addEventListener('DOMContentLoaded', loadEvents);

document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const eventName = document.getElementById('eventName').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventLocation = document.getElementById('eventLocation').value;
    const eventDescription = document.getElementById('eventDescription').value;

    if (eventName && eventDate && eventLocation) {
        const event = { name: eventName, date: eventDate, location: eventLocation, description: eventDescription };
        addEvent(event);
        saveEvent(event);

        // Clear input fields
        document.getElementById('eventName').value = '';
        document.getElementById('eventDate').value = '';
        document.getElementById('eventLocation').value = '';
        document.getElementById('eventDescription').value = '';
    }
});

document.getElementById('searchInput').addEventListener('input', filterEvents);
document.getElementById('filterUpcoming').addEventListener('click', filterUpcomingEvents);
document.getElementById('sortAsc').addEventListener('click', () => sortEvents('asc'));
document.getElementById('sortDesc').addEventListener('click', () => sortEvents('desc'));

function addEvent(event) {
    const eventList = document.getElementById('events');
    const listItem = document.createElement('li');
    listItem.className = 'event-item';

    listItem.innerHTML = `
        <strong>${event.name}</strong> - <em>${event.date}</em>
        <div class="toggle-details">
            <span class="event-details">Location: ${event.location}</span><br>
            <span class="event-details">Description: ${event.description}</span>
        </div>
        <button class="edit-btn"><i class="fas fa-edit"></i> Edit</button>
        <button class="delete-btn"><i class="fas fa-trash-alt"></i> Delete</button>
    `;

    eventList.appendChild(listItem);

    listItem.querySelector('.delete-btn').addEventListener('click', () => {
        deleteEvent(event);
        listItem.remove();
    });

    listItem.querySelector('.edit-btn').addEventListener('click', () => editEvent(event, listItem));

    listItem.addEventListener('click', toggleDetails);
}

function saveEvent(event) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
}

function deleteEvent(event) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events = events.filter(e => e.name !== event.name || e.date !== event.date);
    localStorage.setItem('events', JSON.stringify(events));
}

function editEvent(event, listItem) {
    document.getElementById('eventName').value = event.name;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventLocation').value = event.location;
    document.getElementById('eventDescription').value = event.description;

    deleteEvent(event);
    listItem.remove();
}

function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    events.forEach(event => addEvent(event));
}

function filterEvents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const events = document.querySelectorAll('.event-item');
    events.forEach(event => {
        const text = event.textContent.toLowerCase();
        event.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function filterUpcomingEvents() {
    const today = new Date().toISOString().split('T')[0];
    const events = document.querySelectorAll('.event-item');
    events.forEach(event => {
        const eventDate = event.querySelector('em').textContent;
        event.style.display = eventDate >= today ? '' : 'none';
    });
}

function sortEvents(order) {
    const events = Array.from(document.querySelectorAll('.event-item'));
    events.sort((a, b) => {
        const dateA = new Date(a.querySelector('em').textContent);
        const dateB = new Date(b.querySelector('em').textContent);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const eventList = document.getElementById('events');
    eventList.innerHTML = '';
    events.forEach(event => eventList.appendChild(event));
}

function toggleDetails(event) {
    if (event.target.tagName !== 'BUTTON') {
        const details = event.currentTarget.querySelector('.toggle-details');
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
    }
}