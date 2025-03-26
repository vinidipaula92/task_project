async function loginUser(data) {
  try {
    const response = await fetch('http://localhost/backend/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Erro ao realizar login');

    await response.json();
    alert('Login realizado com sucesso!');
  } catch (error) {
    alert('Erro ao realizar login. Tente novamente.');
  }
}

function handleLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  loginUser({ email, password });
}

document.getElementById('loginBtn').addEventListener('click', handleLogin);
