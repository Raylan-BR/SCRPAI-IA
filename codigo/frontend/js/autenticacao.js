/* ===================== LOGIN MANUAL ===================== */
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            // Armazena os dados do usuário
            localStorage.setItem('userName', data.user_name);
            localStorage.setItem('userEmail', data.user_email);
            window.location.href = '../../index.html'; 
        } else {
            alert(data.error || "Erro no login.");
        }
    } catch (err) {
        console.error("Erro detalhado:", err);
        alert("Erro de conexão com o servidor.");
    }
});

/* ===================== CADASTRO ===================== */
document.getElementById('registerForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const userData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Cadastro realizado com sucesso! Logando...");

            // Loga o usuário automaticamente após cadastro
            const loginResponse = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: userData.email, 
                    password: userData.password 
                })
            });

            const loginData = await loginResponse.json();

            if (loginResponse.ok) {
                localStorage.setItem('userName', loginData.user_name);
                localStorage.setItem('userEmail', loginData.user_email);
                window.location.href = '../../index.html';
            } else {
                alert("Cadastro feito, mas não foi possível logar automaticamente. Faça login manualmente.");
                window.location.href = 'login.html';
            }

        } else {
            alert(data.error || "Erro ao cadastrar.");
        }
    } catch (err) {
        console.error("Erro detalhado:", err);
        alert("Erro de conexão com o servidor.");
    }
});

/* ===================== LOGIN COM GOOGLE ===================== */
document.querySelector('.google-login')?.addEventListener('click', async function () {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);
        const idToken = await result.user.getIdToken();

        const response = await fetch("http://localhost:5000/google-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: idToken })
        });
        
        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            // Armazena os dados do usuário
            localStorage.setItem('userName', data.user_name);
            localStorage.setItem('userEmail', data.user_email);
            window.location.href = '../../index.html';
        } else {
            alert(data.error || "Erro ao autenticar com o Google");
        }
    } catch (error) {
        console.error("Erro detalhado:", error);
        alert("Erro ao fazer login com o Google: " + error.message);
    }
});

/* ===================== LINKS E RECUPERAÇÃO ===================== */
document.getElementById('reosetPasswordFrm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const novaSenha = document.getElementById('novaSenha').value;

    try {
        const response = await fetch("http://localhost:5000/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, new_password: novaSenha })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || 'Senha atualizada com sucesso!');
            setTimeout(() => window.location.href = 'login.html', 1500);
        } else {
            alert(data.error || 'Erro ao atualizar a senha.');
        }
    } catch (err) {
        console.error("Erro ao atualizar a senha:", err);
        alert("Erro de conexão com o servidor.");
    }
});
