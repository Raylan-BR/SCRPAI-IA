const userEmail = localStorage.getItem('userEmail');

if (!userEmail) {
  alert('Usuário não está logado. Por favor, faça login.');
  window.location.href = 'login.html';
}

function formatarData(dataStr) {
  const data = new Date(dataStr);
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// 1. FUNÇÃO PARA SALVAR COMPRA (exemplo, pode ser chamada após o pagamento)
async function salvarCompra(compra) {
  try {
    const response = await fetch("http://localhost:5000/salvar-compra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(compra)
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Compra salva com sucesso");
    } else {
      console.error("Erro ao salvar compra:", data.error);
    }
  } catch (error) {
    console.error("Erro de conexão ao salvar compra:", error);
  }
}

// 2. CARREGA HISTÓRICO
async function carregarHistorico() {
  try {
    const response = await fetch(`http://localhost:5000/historico?email=${encodeURIComponent(userEmail)}`);
    const compras = await response.json();

    const container = document.querySelector('.history-box');

    // mantém o header
    const header = container.querySelector('.header');
    container.innerHTML = '';
    container.appendChild(header);

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

      // Detalhes
      card.querySelector('.details-button').addEventListener('click', () => {
        const detalhes = `
Origem: ${compra.origin}
Destino: ${compra.destination}
Data da Viagem: ${formatarData(compra.travel_date)}
Preço: R$ ${compra.total_price.toFixed(2)}
Fonte da Compra: ${compra.purchase_source}
Passageiros: ${compra.details?.passengers ?? 'N/A'}
Código do Voo: ${compra.details?.flight_code ?? 'N/A'}
        `;
        alert(detalhes);
      });

      // 3. PDF COMPROVANTE
      card.querySelector('.download-button').addEventListener('click', async () => {
        const { jsPDF } = await import("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
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
        doc.text(`Fonte da Compra: ${compra.purchase_source}`, 20, 95);
        doc.text(`Passageiros: ${compra.details?.passengers ?? "N/A"}`, 20, 105);
        doc.text(`Código do Voo: ${compra.details?.flight_code ?? "N/A"}`, 20, 115);
        doc.text(`Emitido em: ${formatarData(new Date())}`, 20, 125);

        doc.save("comprovante-viagem.pdf");
      });

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    alert('Erro ao carregar histórico. Tente novamente.');
  }
}

// 4. FILTRO POR DESTINO
document.getElementById("filtroDestino")?.addEventListener("input", function () {
  const termo = this.value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const rota = card.querySelector(".route-date p strong").innerText.toLowerCase();
    card.style.display = rota.includes(termo) ? "block" : "none";
  });
});

// Chama o carregamento assim que abrir a página
window.addEventListener('DOMContentLoaded', carregarHistorico);
