document.addEventListener('DOMContentLoaded', function() {
  const newEventBtn = document.getElementById('new-event-btn');
  const modal = document.getElementById('new-event-modal');
  const closeBtn = document.querySelector('.close');
  const calendar = document.querySelector('.calendar');
  let events = [];
  let editIndex = -1;

  function createEvent(category, priority, title, description, date, time) {
    const event = {
      category: category,
      priority: priority,
      title: title,
      description: description,
      date: new Date(date + 'T' + time)
    };

    events.push(event);

    renderEvents();
  }

  function renderEvents() {
    calendar.innerHTML = '';

    events.sort((a, b) => a.date - b.date);

    events.forEach((event, index) => {
      const eventElement = document.createElement('div');
      eventElement.classList.add('event');
      eventElement.classList.add(event.category);

      const eventInfo = document.createElement('div');
      eventInfo.classList.add('event-info');

      const eventTitle = document.createElement('h3');
      eventTitle.textContent = event.title;

      const eventDateTime = document.createElement('p');
      eventDateTime.textContent = event.date.toLocaleString();

      const eventDescription = document.createElement('p');
      eventDescription.textContent = event.description;

      eventInfo.appendChild(eventTitle);
      eventInfo.appendChild(eventDateTime);
      eventInfo.appendChild(eventDescription);

      const editButton = document.createElement('button');
      editButton.textContent = 'Bearbeiten';
      editButton.addEventListener('click', function() {
        editIndex = index;
        document.getElementById('category').value = event.category;
        document.getElementById('priority').value = event.priority;
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-description').value = event.description;
        const eventDate = new Date(event.date);
        document.getElementById('event-date').value = eventDate.toISOString().slice(0, 10);
        document.getElementById('event-time').value = eventDate.toTimeString().slice(0, 5);
        const createBtn = document.getElementById('create-event-btn');
        createBtn.textContent = 'Bearbeiten';
        createBtn.removeEventListener('click', handleCreateEvent);
        createBtn.addEventListener('click', handleEditEvent);
        modal.style.display = 'block';
      });

      const deleteButton = document.createElement('img');
      deleteButton.src = 'delete-icon.png';
      deleteButton.alt = 'Delete';
      deleteButton.classList.add('delete-button');
      deleteButton.addEventListener('click', function() {
        events.splice(index, 1);
        renderEvents();
      });

      eventElement.appendChild(eventInfo);
      eventElement.appendChild(editButton);
      eventElement.appendChild(deleteButton);

      calendar.appendChild(eventElement);
    });
  }

  newEventBtn.addEventListener('click', function() {
    editIndex = -1;
    resetModal();
    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });

  function resetModal() {
    document.getElementById('category').value = 'meeting';
    document.getElementById('priority').value = 'low';
    document.getElementById('event-title').value = '';
    document.getElementById('event-description').value = '';
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById('event-date').value = today;
    document.getElementById('event-time').value = '00:00';
    const createBtn = document.getElementById('create-event-btn');
    createBtn.textContent = 'Erstellen';
    createBtn.removeEventListener('click', handleEditEvent);
    createBtn.addEventListener('click', handleCreateEvent);
  }

  function handleCreateEvent() {
    const category = document.getElementById('category').value;
    const priority = document.getElementById('priority').value;
    const title = document.getElementById('event-title').value;
    const description = document.getElementById('event-description').value;
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;

    createEvent(category, priority, title, description, date, time);

    modal.style.display = 'none';
    resetModal();
  }

  function handleEditEvent() {
    const category = document.getElementById('category').value;
    const priority = document.getElementById('priority').value;
    const title = document.getElementById('event-title').value;
    const description = document.getElementById('event-description').value;
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;

    events[editIndex].category = category;
    events[editIndex].priority = priority;
    events[editIndex].title = title;
    events[editIndex].description = description;
    events[editIndex].date = new Date(date + 'T' + time);

    renderEvents();

    modal.style.display = 'none';
    resetModal();
  }

  const createEventBtn = document.getElementById('create-event-btn');
  createEventBtn.addEventListener('click', handleCreateEvent);

  const uploadJsonInput = document.getElementById('upload-json');
  uploadJsonInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
      const jsonData = event.target.result;
      events = JSON.parse(jsonData);
      renderEvents();
    };

    reader.readAsText(file);
  });

  const saveJsonBtn = document.getElementById('save-event-btn');
  saveJsonBtn.addEventListener('click', function() {
    const jsonData = JSON.stringify(events, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
});
