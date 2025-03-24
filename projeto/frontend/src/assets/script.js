document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const taskTableBody = document.getElementById('taskTableBody');
  let tasks = [];

  function loadTasks() {
    tasks = [
      { id: 1, name: 'Task 1', status: 'Pendente' },
      { id: 2, name: 'Task 2', status: 'Concluída' },
      { id: 3, name: 'Task 3', status: 'Pendente' },
      { id: 4, name: 'Task 4', status: 'Concluída' },
      { id: 5, name: 'Task 5', status: 'Pendente' },
      { id: 6, name: 'Task 6', status: 'Concluída' },
    ];
    renderTasks(tasks);
  }

  function renderTasks(taskList) {
    taskTableBody.innerHTML = '';
    taskList.forEach((task) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <th scope="row">${task.id}</th>
        <td>${task.name}</td>
        <td>${task.status}</td>
        <td>
          <button class="btn btn-success btn-sm" onclick="changeStatus(${
            task.id
          }, '${task.status}')">
            ${task.status === 'Pendente' ? 'Concluir' : 'Reabrir'}
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteTask(${
            task.id
          })">Excluir</button>
        </td>
      `;
      taskTableBody.appendChild(row);
    });
  }

  window.filterTasks = (status) => {
    if (status === 'All') {
      renderTasks(tasks);
    } else {
      const filteredTasks = tasks.filter((task) => task.status === status);
      renderTasks(filteredTasks);
    }
  };

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskName = document.getElementById('taskName').value;
    const taskStatus = document.getElementById('taskStatus').value;
    console.log('Task saved:', { taskName, taskStatus });
    loadTasks();
    taskForm.reset();
  });

  window.changeStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Pendente' ? 'Concluída' : 'Pendente';
    console.log(`Task ${id} status changed to ${newStatus}`);
    loadTasks();
  };

  window.deleteTask = (id) => {
    console.log(`Task ${id} deleted`);
    loadTasks();
  };

  loadTasks();
});
