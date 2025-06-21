document.addEventListener('DOMContentLoaded', function () {
  const btnCartao = document.querySelector('.btn:nth-child(1)');
  const btnPix = document.querySelector('.btn:nth-child(2)');
  const formCartao = document.getElementById('form-cartao');
  const form = document.getElementById('cartaoForm');

  // Máscaras para os campos
  const numero = document.getElementById('numero');
  const cpf = document.getElementById('cpf');
  const cvv = document.getElementById('cvv');
  const validade = document.getElementById('validade');

  IMask(numero, { mask: '0000 0000 0000 0000' });
  IMask(cpf, { mask: '000.000.000-00' });
  IMask(cvv, { mask: '000' });
  IMask(validade, { mask: '00/00' });

  // Exibe o formulário do cartão ao clicar
  btnCartao.addEventListener('click', () => {
    formCartao.style.display = 'flex';
    document.querySelector('.botoes').classList.add('oculto');
  });

  // Dados simulados da viagem — serão dinâmicos depois
  const dadosViagem = {
    nome: "Lilia Moura",
    origem: "São Luís",
    destino: "Rio de Janeiro",
    data: "25/06/2025",
    horario: "14:30",
    preco: "R$ 320,00"
  };

  // SUBSTITUIR ESTA LÓGICA PELO BACKEND REAL
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const dados = {
      nome: form.nome.value,
      numero: form.numero.value,
      cpf: form.cpf.value,
      cvv: form.cvv.value,
      validade: form.validade.value,
      parcelamento: form.parcelamento.value
    };

    // SIMULAÇÃO — Trocar por fetch real depois
    setTimeout(() => {
      const sucesso = true; // <-- Aqui virá a resposta real do backend
      if (sucesso) {
        mostrarModalSucesso();
      } else {
        mostrarModalErro();
      }
    }, 2000);
  });

  // SUBSTITUIR ESTA LÓGICA PELO BACKEND REAL
  btnPix.addEventListener('click', () => {
    formCartao.style.display = 'none';
    document.querySelector('.botoes').classList.add('oculto');

    const pixContainer = document.getElementById('pix-container');
    const pixContent = document.getElementById('pix-content');
    const status = document.getElementById('pix-status');
    const loading = document.getElementById('loading-img');
    const qrImg = document.getElementById('qr-img');
    const copiaCola = document.getElementById('codigo-pix');
    const tempoSpan = document.getElementById('tempo');

    pixContainer.style.display = 'flex';
    pixContent.style.display = 'none';
    status.textContent = 'Gerando QRCode...';
    loading.style.display = 'block';

    // SIMULAÇÃO — Trocar por fetch para gerar o Pix
    setTimeout(() => {
      qrImg.src = '../../img/qrcode.png';
      copiaCola.value = '00020126580014BR.GOV.BCB.PIX0136pix-exemplo@banco.com.br...';

      status.textContent = '';
      loading.style.display = 'none';
      pixContent.style.display = 'block';

      // Contagem regressiva
      let segundos = 120;
      const timer = setInterval(() => {
        segundos--;
        const min = String(Math.floor(segundos / 60)).padStart(2, '0');
        const seg = String(segundos % 60).padStart(2, '0');
        tempoSpan.textContent = `${min}:${seg}`;
        if (segundos <= 0) {
          clearInterval(timer);
          tempoSpan.textContent = "Expirado";
          alert("Tempo expirado. Solicite um novo código.");
        }
      }, 1000);

      // SIMULAÇÃO — Aqui será onde o backend confirmará o pagamento via Pix
      setTimeout(() => {
        mostrarModalSucesso(); // <- No futuro: só se o backend confirmar
      }, 5000);
    }, 2000);
  });

  // MODAIS de sucesso/erro
  window.mostrarModalSucesso = function () {
    document.getElementById('modal-sucesso').style.display = 'flex';
  };

  window.mostrarModalErro = function () {
    document.getElementById('modal-erro').style.display = 'flex';
  };

  // Gera PDF com os dados da viagem
  window.baixarComprovante = function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("Helvetica", "bold");
    doc.text("Comprovante de Pagamento - SkAI", 20, 20);
    doc.setFont("Helvetica", "normal");
    doc.text(`Passageiro: ${dadosViagem.nome}`, 20, 40);
    doc.text(`Origem: ${dadosViagem.origem}`, 20, 50);
    doc.text(`Destino: ${dadosViagem.destino}`, 20, 60);
    doc.text(`Data: ${dadosViagem.data}`, 20, 70);
    doc.text(`Horário: ${dadosViagem.horario}`, 20, 80);
    doc.text(`Valor Pago: ${dadosViagem.preco}`, 20, 90);
    doc.text("Status: Pagamento Confirmado", 20, 110);
    doc.save("comprovante-pagamento.pdf");
  };
});
