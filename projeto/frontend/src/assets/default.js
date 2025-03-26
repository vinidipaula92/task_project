import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from './validation.js';

async function registerUser(data) {
  try {
    const response = await fetch('http://localhost/backend/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Erro ao registrar usuário');

    await response.json();
    alert('Cadastro realizado com sucesso!');
  } catch (error) {
    alert('Erro ao cadastrar usuário. Tente novamente.');
  }
}

function handleRegister() {
  const name = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!validateEmail(email)) return alert('E-mail inválido!');
  if (!validatePassword(password))
    return alert('A senha deve ter pelo menos 6 caracteres!');
  if (!validateConfirmPassword(password, confirmPassword))
    return alert('As senhas não coincidem!');

  registerUser({ name, email, password });
}

document
  .getElementById('registerBtn')
  .addEventListener('click', handleRegister);
