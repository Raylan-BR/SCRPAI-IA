/*LOGIN*/
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('Email:', email);
    console.log('Senha:', password);
    alert('Login realizado com sucesso!');
});

document.querySelector('.google-login').addEventListener('click', function() {
    alert('Login com Google selecionado');
});

document.querySelector('.register-link').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Redirecionar para página de cadastro');
});