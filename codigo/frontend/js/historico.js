const userEmail = localStorage.getItem('userEmail');

if (!userEmail) {
  alert('Usuário não está logado. Por favor, faça login.');
  window.location.href = 'login.html';
}

function formatarData(dataStr) {
  const data = new Date(Date.parse(dataStr));
  if (isNaN(data.getTime())) return "Data inválida";
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// MODAL
function abrirModal(detalhes) {
  document.getElementById("detalhes-compra").textContent = detalhes;
  document.getElementById("modal-detalhes").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal-detalhes").style.display = "none";
}

// INICIALIZAÇÃO DO MODAL
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("fecharModal")?.addEventListener("click", fecharModal);
  carregarHistorico();
});

// FILTRO POR DESTINO
document.getElementById("filtroDestino")?.addEventListener("input", function () {
  const termo = this.value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const rota = card.querySelector(".route-date p strong").innerText.toLowerCase();
    card.style.display = rota.includes(termo) ? "block" : "none";
  });
});

// CARREGAR HISTÓRICO DE COMPRAS
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

      // ABRIR MODAL COM DETALHES
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

      // GERAR PDF
      card.querySelector('.download-button').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(14);
        doc.text("Comprovante de Compra - SkAI", 20, 20);

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
