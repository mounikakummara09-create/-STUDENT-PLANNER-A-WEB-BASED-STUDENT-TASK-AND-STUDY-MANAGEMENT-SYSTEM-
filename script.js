const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const filterSelect = document.getElementById('filter');

let tasks = JSON.parse(localStorage.getItem('studentPlannerTasks')) || [];

function saveTasks() {
  localStorage.setItem('studentPlannerTasks', JSON.stringify(tasks));
}

function updateStats() {
  const completed = tasks.filter(task => task.completed).length;
  document.getElementById('totalCount').textContent = tasks.length;
  document.getElementById('completedCount').textContent = completed;
  document.getElementById('pendingCount').textContent = tasks.length - completed;
}

function renderTasks() {
  const filter = filterSelect.value;
  const visibleTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  taskList.innerHTML = '';
  if (visibleTasks.length === 0) {
    const message = document.createElement('p');
    message.className = 'empty-state';
    message.textContent = tasks.length === 0
      ? 'No tasks yet. Add your first task above!'
      : 'No tasks match this filter.';
    taskList.appendChild(message);
  }

  visibleTasks.forEach(task => {
    const item = document.createElement('article');
    item.className = `task${task.completed ? ' done' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark ${task.name} as completed`);
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const info = document.createElement('div');
    info.className = 'task-info';

    const title = document.createElement('p');
    title.className = 'task-title';
    title.textContent = task.name;

    const meta = document.createElement('div');
    meta.className = 'task-meta';
    const details = document.createElement('span');
    details.textContent = `${task.subject} · Due ${task.dueDate}`;
    const priority = document.createElement('span');
    priority.className = `priority ${task.priority}`;
    priority.textContent = `${task.priority} priority`;
    meta.append(details, priority);
    info.append(title, meta);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete ${task.name}`);
    deleteButton.addEventListener('click', () => {
      tasks = tasks.filter(savedTask => savedTask.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, info, deleteButton);
    taskList.appendChild(item);
  });

  updateStats();
}

taskForm.addEventListener('submit', event => {
  event.preventDefault();
  const newTask = {
    id: Date.now(),
    name: document.getElementById('taskName').value.trim(),
    subject: document.getElementById('subject').value.trim(),
    dueDate: document.getElementById('dueDate').value,
    priority: document.getElementById('priority').value,
    completed: false
  };

  if (!newTask.name || !newTask.subject || !newTask.dueDate) return;
  tasks.push(newTask);
  saveTasks();
  taskForm.reset();
  document.getElementById('priority').value = 'Medium';
  renderTasks();
});

filterSelect.addEventListener('change', renderTasks);
renderTasks();
