const registerBtn = document.querySelector('.register-btn');

registerBtn.addEventListener('click', () => {
  const loginField = document.querySelector('#login-field');
  const registerField = document.querySelector('#register-field');

  loginField.classList.add('display-none');
  registerField.classList.remove('display-none');
});
