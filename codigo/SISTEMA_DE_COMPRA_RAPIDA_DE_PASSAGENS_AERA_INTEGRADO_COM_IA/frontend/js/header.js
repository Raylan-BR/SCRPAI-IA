/**
 * @file header.js
 * @brief Script de controle do cabeçalho dinâmico
 * @description Gerencia a renderização do header e funcionalidades de login/logout
 * @author LILIA ROSA COELHO MOURA <lilia.rosa@discente.ufma.br>
 * @author VIRGINIA MARIA MONDEGO FERREIRA <virginia.mondego@discente.ufma.br>
 * @author YASMIN CANTANHEDE SANTOS <yasmin.cantanhede@discente.ufma.br>
 */

/**
 * @event DOMContentLoaded
 * @description Executa quando o DOM está totalmente carregado
 * @listens document#DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Obtém dados do usuário do localStorage
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  const isLoggedIn = !!userEmail;

  // Extrair o primeiro nome ou mostrar "Entrar"
  const primeiroNome = userName ? userName.split(' ')[0] : 'Entrar';

  /**
   * Template HTML do header
   * @type {string}
   */
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

  // Redireciona para login se não estiver logado
  if (!isLoggedIn && userNameDisplay) {
    userNameDisplay.addEventListener('click', () => {
      window.location.href = '/pages/autenticacao/login.html';
    });
  }

  /**
   * @event logoutBtn#click
   * @description Realiza logout do usuário
   * @listens logoutBtn#click
   */
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');

    // Faz logout do Firebase se estiver autenticado
    if (firebase?.auth().currentUser) {
      firebase.auth().signOut();
    }

    window.location.href = '/pages/autenticacao/login.html';
  });
});

/**
 * @function toggleMenu
 * @description Alterna a visibilidade do menu de navegação
 * @global
 */
window.toggleMenu = function () {
  const menu = document.getElementById('menu');
  if (menu) {
    menu.classList.toggle('ativo');
  }
};