document.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  const isLoggedIn = !!userEmail;

  // Extrair o primeiro nome ou mostrar "Entrar"
  const primeiroNome = userName ? userName.split(' ')[0] : 'Entrar';

  const headerHTML = `
    <header>
      <nav>
        <div class="conteudo_projeto">
          <img src="../../img/logo_aviao.png" alt="logo de um avião">
          <h1>SkAI</h1>
        </div>
        <div class="menu_navegacao">
          <li>
            <ul><a href="/index.html">Início</a></ul>
            <ul><a href="/historico.html">Histórico</a></ul>
          </li>
          <div class="header-right">
            <div class="lang">
              <img src="../../img/bandeira.png" alt="Bandeira Brasil" />
              <span>PT | BR</span>
              <div class="dropdown-icon">▼</div>
            </div>
            <div class="perfil">
              <span id="userNameDisplay"
                class="perfil-nome"
                style="color: white; font-weight: bold; cursor: ${isLoggedIn ? 'default' : 'pointer'};"
              >
                ${primeiroNome}
              </span>
              <button
                id="logoutBtn"
                class="perfil-btn"
                style="display: ${isLoggedIn ? 'inline-block' : 'none'};"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `;

  // Inserir o header na página
  const container = document.getElementById('header-container');
  if (container) container.innerHTML = headerHTML;

  // Eventos após o header ser inserido
  const userNameDisplay = document.getElementById('userNameDisplay');
  const logoutBtn = document.getElementById('logoutBtn');

  if (!isLoggedIn && userNameDisplay) {
    userNameDisplay.addEventListener('click', () => {
      window.location.href = '/pages/autenticacao/login.html';
    });
  }

  // Botão sair
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');

    if (firebase?.auth().currentUser) {
      firebase.auth().signOut();
    }

    window.location.href = '/pages/autenticacao/login.html';
  });
});
