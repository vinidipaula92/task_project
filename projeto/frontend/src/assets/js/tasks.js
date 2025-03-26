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

const completeTask = async (id, currentStatus) => {
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

const renderTasks = (taskList) => {
  taskTableBody.innerHTML = ''; // Limpa a tabela antes de renderizar
  taskList.forEach((task) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <th scope="row">${task.id}</th>
      <td>${task.title}</td>
      <td>${task.description}</td>
      <td>${new Date(task.created_at).toLocaleDateString('pt-BR')}</td>
      <td>${task.status.toUpperCase()}</td>
      <td>
        <button class="btn btn-success btn-sm complete-task" data-id="${
          task.id
        }" data-status="${task.status}" ${
      task.status !== 'pendente' ? 'disabled' : ''
    }>
          ${task.status === 'pendente' ? 'Concluir' : 'Concluído'}
        </button>
        <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">
          Excluir
        </button>
      </td>
    `;
    taskTableBody.appendChild(row);
  });

  document.querySelectorAll('.complete-task').forEach((button) => {
    button.addEventListener('click', (event) => {
      const id = event.target.dataset.id;
      const status = event.target.dataset.status;
      completeTask(id, status);
    });
  });

  document.querySelectorAll('.delete-task').forEach((button) => {
    button.addEventListener('click', (event) => {
      const id = event.target.dataset.id;
      deleteTask(id);
    });
  });
};

const handleTaskFormSubmit = async (e) => {
  e.preventDefault();
  const taskName = document.getElementById('taskName').value;
  const taskStatus = document.getElementById('taskStatus').value;
  const taskDescription = document.getElementById('taskDescription').value;
  await createTask({
    title: taskName,
    status: taskStatus,
    description: taskDescription,
  });
  document.getElementById('taskForm').reset();
};

// Exporta as funções
export {
  fetchTasks,
  createTask,
  completeTask,
  deleteTask,
  filterTasks,
  handleTaskFormSubmit,
};
