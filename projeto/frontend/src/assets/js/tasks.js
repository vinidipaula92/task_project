const taskTableBody = document.getElementById('taskTableBody');
let tasks = [];

const fetchTasks = async () => {
  try {
    const response = await fetch('http://localhost/backend/tasks');
    tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
  }
};

const createTask = async (task) => {
  try {
    const response = await fetch('http://localhost/backend/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (response.ok) {
      await fetchTasks();
    } else {
      console.error('Erro ao criar tarefa:', await response.text());
    }
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
  }
};

const updateTaskStatus = async (id, currentStatus) => {
  const newStatus = currentStatus === 'Pendente' ? 'Concluída' : 'Pendente';
  try {
    const response = await fetch(`http://localhost/backend/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (response.ok) {
      await fetchTasks();
    } else {
      console.error('Erro ao atualizar status:', await response.text());
    }
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
  }
};

const deleteTask = async (id) => {
  try {
    const response = await fetch(`http://localhost/backend/tasks/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      await fetchTasks();
    } else {
      console.error('Erro ao deletar tarefa:', await response.text());
    }
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
  }
};

const renderTasks = (taskList) => {
  console.log('taskList', taskList);

  taskTableBody.innerHTML = '';
  taskList.forEach((task) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <th scope="row">${task.id}</th>
      <td>${task.title}</td>
      <td>${task.status}</td>
      <td>
        <button class="btn btn-success btn-sm" onclick="updateTaskStatus(${
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
};

const filterTasks = async (status) => {
  try {
    const response = await fetch(
      `http://localhost/backend/tasks/status?status=${status}`,
    );
    const filteredTasks = await response.json();
    renderTasks(filteredTasks);
  } catch (error) {
    console.error('Erro ao filtrar tarefas:', error);
  }
};

const handleTaskFormSubmit = async (e) => {
  e.preventDefault();
  const taskName = document.getElementById('taskName').value;
  const taskStatus = document.getElementById('taskStatus').value;
  await createTask({ title: taskName, status: taskStatus });
  document.getElementById('taskForm').reset();
};

export {
  fetchTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  filterTasks,
  handleTaskFormSubmit,
};
