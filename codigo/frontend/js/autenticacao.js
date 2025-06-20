/* FUNCIONALIDADES DE LOGIN */
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('Login attempt:', { email, password });
    alert('Login realizado com sucesso!');
});

/* FUNCIONALIDADES DE CADASTRO */
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    
    console.log('Registration data:', userData);
    alert('Cadastro realizado com sucesso!\nRedirecionando para login...');
    
    // Redirecionamento simulado
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
});

/* FUNÇÕES COMPARTILHADAS */
document.querySelector('.google-login')?.addEventListener('click', function() {
    alert('Login com Google selecionado');
});

document.querySelectorAll('.register-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        console.log('Navigation to:', target);
        window.location.href = target;
    });
});