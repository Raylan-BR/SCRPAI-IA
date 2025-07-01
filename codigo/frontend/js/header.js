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

        <div class="menu-direita">
          <div class="user-name-top">
            <span id="userNameDisplay"
              class="perfil-nome"
              style="color: white; font-weight: bold; cursor: ${isLoggedIn ? 'default' : 'pointer'};"
            >
              ${primeiroNome}
            </span>
          </div>

          <!-- Botão de menu hamburguer -->
          <button class="menu-toggle" onclick="toggleMenu()">☰</button>
          <div class="menu_navegacao" id="menu">
            <ul>
              <li><a href="/index.html"><button class="perfil-btn">Início</button></a></li>
              <li><a href="/historico.html"><button class="perfil-btn">Histórico</button></a></li>
              <li>
                <button
                  id="logoutBtn"
                  class="perfil-btn"
                  style="display: ${isLoggedIn ? 'inline-block' : 'none'};"
                >
                  Sair
                </button>
              </li>
            </ul>
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
  // Essa função mostra ou esconde o menu quando o botão ☰ é clicado
window.toggleMenu = function () {
  const menu = document.getElementById('menu');
  if (menu) {
    menu.classList.toggle('ativo');
  }
};
});
