/**
 * @file historico.js
 * @brief Gerenciamento do histórico de compras de viagens
 * @description Controla a exibição do histórico de compras, filtragem e geração de comprovantes
 * @author LILIA ROSA COELHO MOURA <lilia.rosa@discente.ufma.br>
 */

// Verificação de autenticação
const userEmail = localStorage.getItem('userEmail');
if (!userEmail) {
  alert('Usuário não está logado. Por favor, faça login.');
  window.location.href = 'login.html';
}

/**
 * Formata uma data string para o formato brasileiro
 * @function formatarData
 * @param {string} dataStr - Data em formato string
 * @return {string} Data formatada ou "Data inválida"
 * @example
 * formatarData("2023-12-25") → "25 de dezembro de 2023"
 */
function formatarData(dataStr) {
  const data = new Date(Date.parse(dataStr));
  if (isNaN(data.getTime())) return "Data inválida";
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// Controle do Modal de Detalhes
/**
 * Abre o modal com os detalhes da compra
 * @function abrirModal
 * @param {string} detalhes - Texto com os detalhes da compra
 */
function abrirModal(detalhes) {
  document.getElementById("detalhes-compra").textContent = detalhes;
  document.getElementById("modal-detalhes").style.display = "flex";
}

/**
 * Fecha o modal de detalhes
 * @function fecharModal
 */
function fecharModal() {
  document.getElementById("modal-detalhes").style.display = "none";
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("fecharModal")?.addEventListener("click", fecharModal);
  carregarHistorico();
  
  // Esconde o botão de Histórico no menu
  const historicoBtn = document.querySelector('a[href="/historico.html"] > button.perfil-btn');
  if (historicoBtn) {
    historicoBtn.style.display = 'none';
  }
});

/**
 * Filtra as compras por destino
 * @event filtroDestino#input
 * @listens filtroDestino#input
 */
document.getElementById("filtroDestino")?.addEventListener("input", function () {
  const termo = this.value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const rota = card.querySelector(".route-date p strong").innerText.toLowerCase();
    card.style.display = rota.includes(termo) ? "block" : "none";
  });
});

/**
 * Carrega o histórico de compras do usuário
 * @async
 * @function carregarHistorico
 * @description Busca no servidor e renderiza o histórico de compras do usuário logado
 * @throws {Error} Lança erro se a requisição falhar
 */
async function carregarHistorico() {
  try {
    const response = await fetch(`http://localhost:5000/loadHistorico?email=${encodeURIComponent(userEmail)}`);
    const compras = await response.json();

    const container = document.querySelector('.history-box');
    const header = container.querySelector('.header');
    container.innerHTML = '';
    if (header) container.appendChild(header);

    if (!Array.isArray(compras) || compras.length === 0) {
      container.innerHTML += '<p>Nenhuma compra encontrada.</p>';
      return;
    }

    compras.forEach(compra => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <div class="route-date">
          <p><strong>${compra.origin} ➜ ${compra.destination}</strong></p>
          <p class="date">${formatarData(compra.travel_date)}</p>
        </div>
        <div class="price-actions">
          <p class="total">Total<br><strong>R$ ${compra.total_price.toFixed(2)}</strong></p>
          <button class="details-button">Ver detalhes</button>
          <button class="download-button">Baixar comprovante</button>
        </div>
      `;

      /**
       * Mostra detalhes da compra no modal
       * @event details-button#click
       * @listens details-button#click
       */
      card.querySelector('.details-button').addEventListener('click', () => {
        const detalhes = `
Origem: ${compra.origin}
Destino: ${compra.destination}
Data da Viagem: ${formatarData(compra.travel_date)}
Preço: R$ ${compra.total_price.toFixed(2)}
Passageiros: ${compra.details?.passengers ?? 'N/A'}
Código do Voo: ${compra.details?.flight_code ?? 'N/A'}
Tipo de Pagamento: ${compra.details?.payment_type ?? 'N/A'}
        `.trim();
        abrirModal(detalhes);
      });

      /**
       * Gera PDF do comprovante
       * @event download-button#click
       * @listens download-button#click
       */
      card.querySelector('.download-button').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Configuração do documento PDF
        doc.setFontSize(14);
        doc.text("Comprovante de Compra - SkAI", 20, 20);

        // Conteúdo do comprovante
        doc.setFontSize(12);
        doc.text(`Nome: ${localStorage.getItem("userName") || "Usuário"}`, 20, 35);
        doc.text(`Email: ${userEmail}`, 20, 45);
        doc.text(`Origem: ${compra.origin}`, 20, 55);
        doc.text(`Destino: ${compra.destination}`, 20, 65);
        doc.text(`Data da Viagem: ${formatarData(compra.travel_date)}`, 20, 75);
        doc.text(`Preço: R$ ${compra.total_price.toFixed(2)}`, 20, 85);
        doc.text(`Passageiros: ${compra.details?.passengers ?? "N/A"}`, 20, 105);
        doc.text(`Código do Voo: ${compra.details?.flight_code ?? "N/A"}`, 20, 115);
        doc.text(`Tipo de Pagamento: ${compra.details?.payment_type ?? "N/A"}`, 20, 125);
        doc.text(`Emitido em: ${formatarData(new Date())}`, 20, 135);

        doc.save("comprovante-viagem.pdf");
      });

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    alert('Erro ao carregar histórico. Tente novamente.');
  }
}