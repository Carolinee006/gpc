document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const msgSuccess = document.getElementById('msgSuccess');
    const msgError = document.getElementById('msgError');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();

        if (nome && telefone) {
            // Armazena os dados no localStorage
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            usuarios.push({ nome, telefone });
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            // Exibe mensagem de sucesso
            msgSuccess.style.display = 'block';
            msgSuccess.textContent = 'Cadastro realizado com sucesso!';
            msgError.style.display = 'none';

            // Redireciona para a página inicial após 2 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            // Exibe mensagem de erro
            msgError.style.display = 'block';
            msgError.textContent = 'Por favor, preencha todos os campos.';
            msgSuccess.style.display = 'none';
        }
    });
});
