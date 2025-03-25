function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function validateConfirmPassword(password, confirmPassword) {
  return password === confirmPassword;
}

export { validateEmail, validatePassword, validateConfirmPassword };
