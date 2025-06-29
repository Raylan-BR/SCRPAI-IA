document.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');

  if (!userEmail) {
    alert('Usuário não está logado. Por favor, faça login.');
    window.location.href = '/pages/autenticacao/login.html';
    return;
  }

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
              <span class="perfil-nome">${userName || 'Usuário'}</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `;

  const container = document.getElementById('header-container');
  if (container) container.innerHTML = headerHTML;
});
