document.addEventListener('DOMContentLoaded', function() {
  const signupForm = document.getElementById('signupForm');

  signupForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      const nome = document.getElementById('nome').value;
      const telefone = document.getElementById('telefone').value;
      const msgSuccess = document.getElementById('msgSuccess');
      const msgError = document.getElementById('msgError');

      if (nome && telefone) {
          try {
              const response = await fetch('http://localhost:3000/api/usuarios', {  // Certifique-se de que o endpoint está correto
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ nome_completo: nome, telefone: telefone })
              });

              const data = await response.json();

              if (response.ok) {
                  msgSuccess.style.display = 'block';
                  msgSuccess.innerHTML = `<strong>${data.message}</strong>`;
                  msgError.style.display = 'none';

                  // Redirecionar após um curto intervalo para dar tempo de ver a mensagem
                  setTimeout(() => {
                      window.location.href = 'index.html';
                  }, 2000);  // 2 segundos
              } else {
                  msgError.style.display = 'block';
                  msgError.innerHTML = `<strong>Erro ao cadastrar: ${data.message}</strong>`;
                  msgSuccess.style.display = 'none';
              }
          } catch (error) {
              console.error('Erro ao cadastrar usuário:', error);
              msgError.style.display = 'block';
              msgError.innerHTML = `<strong>Erro ao cadastrar. Tente novamente.</strong>`;
              msgSuccess.style.display = 'none';
          }
      } else {
          msgError.style.display = 'block';
          msgError.innerHTML = `<strong>Por favor, preencha todos os campos.</strong>`;
          msgSuccess.style.display = 'none';
      }
  });
});
