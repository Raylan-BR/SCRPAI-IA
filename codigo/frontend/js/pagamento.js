document.addEventListener('DOMContentLoaded', function () {
  // Variável para guardar os dados da reserva atual
  let dadosReserva = null;

  // Função para carregar a reserva atual
  function carregarReservaAtual() {
    const params = new URLSearchParams(window.location.search);
    let reservaId = params.get("reserva_id");

    if (!reservaId) {
      reservaId = localStorage.getItem("reserva_atual_id"); // fallback
    }

    if (reservaId) {
      const reservas = JSON.parse(localStorage.getItem("reservas") || "[]");
      dadosReserva = reservas.find((r) => r.id === reservaId);
    }

    if (!dadosReserva) {
      alert("Erro: reserva não encontrada!");
    }
  }

  // Carrega a reserva ao iniciar
  carregarReservaAtual();

  // Seleção dos elementos do DOM
  const btnCartao = document.querySelector('.btn:nth-child(1)');
  const btnPix = document.querySelector('.btn:nth-child(2)');
  const formCartao = document.getElementById('form-cartao');
  const form = document.getElementById('cartaoForm');
  const botoesMetodo = document.querySelector('.botoes');
  const pixContainer = document.getElementById('pix-container');

  // Máscaras para os campos (usando IMask)
  const numero = document.getElementById('numero');
  const cpf = document.getElementById('cpf');
  const cvv = document.getElementById('cvv');
  const validade = document.getElementById('validade');
  const parcelamento = document.getElementById('parcelamento');

  IMask(numero, { mask: '0000 0000 0000 0000' });
  IMask(cpf, { mask: '000.000.000-00' });
  IMask(cvv, { mask: '000' });
  IMask(validade, { mask: '00/00' });
  IMask(parcelamento, { 
    mask: '0x',
    blocks: {
      0: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 10
      }
    }
  });

  // Mostrar formulário do cartão ao clicar
  btnCartao.addEventListener('click', () => {
    formCartao.style.display = 'flex';
    pixContainer.style.display = 'none';
    botoesMetodo.classList.add('oculto');
    atualizarTituloPagamento('CARTÃO');
  });

  // Funções de validação (cartão, validade, CVV, nome, CPF)
  function validarNumeroCartao(numero) {
    const numeroLimpo = numero.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(numeroLimpo)) return { valido: false, mensagem: "O número do cartão deve ter 16 dígitos" };

    // Algoritmo de Luhn
    let soma = 0;
    let deveDobrar = false;
    for (let i = numeroLimpo.length - 1; i >= 0; i--) {
      let digito = parseInt(numeroLimpo.charAt(i), 10);
      if (deveDobrar) {
        digito *= 2;
        if (digito > 9) digito -= 9;
      }
      soma += digito;
      deveDobrar = !deveDobrar;
    }
    const valido = soma % 10 === 0;
    return { valido, mensagem: valido ? "" : "Número de cartão inválido" };
  }

  function validarValidade(validade) {
    if (!/^\d{2}\/\d{2}$/.test(validade)) return { valido: false, mensagem: "Formato inválido (use MM/AA)" };
    const [mesStr, anoStr] = validade.split('/');
    const mes = parseInt(mesStr, 10);
    const ano = parseInt(anoStr, 10);
    if (mes < 1 || mes > 12) return { valido: false, mensagem: "Mês inválido" };

    const agora = new Date();
    const anoAtual = agora.getFullYear() % 100;
    const mesAtual = agora.getMonth() + 1;
    if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) return { valido: false, mensagem: "Cartão expirado" };

    return { valido: true, mensagem: "" };
  }

  function validarCVV(cvv) {
    return /^\d{3,4}$/.test(cvv) ? { valido: true, mensagem: "" } : { valido: false, mensagem: "CVV deve ter 3 ou 4 dígitos" };
  }

  function validarNome(nome) {
    return nome.trim().length >= 3 && /^[a-zA-Z\sÀ-ÿ]+$/.test(nome)
      ? { valido: true, mensagem: "" }
      : { valido: false, mensagem: "Nome inválido (mínimo 3 letras)" };
  }

  function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return { valido: false, mensagem: "CPF inválido" };

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = 11 - (soma % 11);
    const digito1 = resto >= 10 ? 0 : resto;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = 11 - (soma % 11);
    const digito2 = resto >= 10 ? 0 : resto;

    const valido = parseInt(cpf.charAt(9)) === digito1 && parseInt(cpf.charAt(10)) === digito2;
    return { valido, mensagem: valido ? "" : "CPF inválido" };
  }

  // Validação do formulário de cartão
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const validacoes = {
      nome: validarNome(form.nome.value),
      numero: validarNumeroCartao(form.numero.value),
      cpf: validarCPF(form.cpf.value),
      cvv: validarCVV(form.cvv.value),
      validade: validarValidade(form.validade.value),
      parcelamento: { valido: form.parcelamento.value.match(/^[1-9]|10x$/), mensagem: "Selecione 1x a 10x" }
    };

    const todosValidos = Object.values(validacoes).every(v => v.valido);

    if (todosValidos) {
      const processarBtn = form.querySelector('.processar-btn');
      const textoOriginal = processarBtn.textContent;
      processarBtn.textContent = 'Processando...';
      processarBtn.disabled = true;

      setTimeout(() => {
        processarBtn.textContent = textoOriginal;
        processarBtn.disabled = false;
        salvarCompraNoHistorico();
        mostrarModalSucesso();
      }, 2000);
    } else {
      // Mostrar erros
      for (const [campo, validacao] of Object.entries(validacoes)) {
        if (!validacao.valido) {
          const input = form.querySelector(`[name="${campo}"]`);
          input.classList.add('invalido');

          let mensagemErro = input.nextElementSibling;
          if (!mensagemErro || !mensagemErro.classList.contains('mensagem-erro')) {
            mensagemErro = document.createElement('div');
            mensagemErro.className = 'mensagem-erro';
            input.parentNode.insertBefore(mensagemErro, input.nextSibling);
          }
          mensagemErro.textContent = validacao.mensagem;
        }
      }
    }
  });

  // Limpar erros ao digitar
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('invalido');
      const mensagemErro = input.nextElementSibling;
      if (mensagemErro && mensagemErro.classList.contains('mensagem-erro')) {
        mensagemErro.textContent = '';
      }
    });
  });

  // Exibe área do Pix
  btnPix.addEventListener('click', () => {
    formCartao.style.display = 'none';
    pixContainer.style.display = 'flex';
    botoesMetodo.classList.add('oculto');
    atualizarTituloPagamento('PIX');

    const pixContent = document.getElementById('pix-content');
    const status = document.getElementById('pix-status');
    const loading = document.getElementById('loading-img');
    const qrImg = document.getElementById('qr-img');
    const copiaCola = document.getElementById('codigo-pix');
    const tempoSpan = document.getElementById('tempo');

    pixContent.style.display = 'none';
    status.textContent = 'Gerando QRCode...';
    loading.style.display = 'block';

    setTimeout(() => {
      qrImg.src = '../../img/qrcode.png';
      copiaCola.value = '00020126580014BR.GOV.BCB.PIX0136pix-exemplo@banco.com.br...';

      status.textContent = '';
      loading.style.display = 'none';
      pixContent.style.display = 'block';

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

      setTimeout(() => {
          salvarCompraNoHistorico();
        mostrarModalSucesso();
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

  document.getElementById('fechar-modal').addEventListener('click', function() {
  document.getElementById('modal-sucesso').style.display = 'none';
});

  // Função para gerar PDF com os dados da reserva
  window.baixarComprovante = function () {
    if (!dadosReserva) {
      alert("Não foi possível gerar o comprovante. Dados da reserva ausentes.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("Helvetica", "bold");
    doc.text("Comprovante de Pagamento - SkAI", 20, 20);

    doc.setFont("Helvetica", "normal");
    doc.text(`Origem: ${dadosReserva.voo.origem}`, 20, 50);
    doc.text(`Destino: ${dadosReserva.voo.destino}`, 20, 60);
    doc.text(`Partida: ${dadosReserva.voo.partida}`, 20, 70);
    doc.text(`Chegada: ${dadosReserva.voo.chegada}`, 20, 80);
    doc.text(`Assentos: ${dadosReserva.assentos.join(', ')}`, 20, 90);
    doc.text(`Bagagem: ${dadosReserva.bagagem}`, 20, 100);
    doc.text(`Preço Total: R$ ${dadosReserva.voo.preco.toFixed(2)}`, 20, 110);
    doc.text("Status: Pagamento Confirmado", 20, 120);

    doc.save("comprovante-pagamento.pdf");
  };

  // Função para voltar à escolha de métodos
  window.voltarMetodo = function () {
    formCartao.style.display = 'none';
    pixContainer.style.display = 'none';
    botoesMetodo.classList.remove('oculto');

    const titulo = document.getElementById('metodo-pagamento-titulo');
    titulo.textContent = "ESCOLHA SEU MÉTODO DE PAGAMENTO:";
    titulo.classList.remove('titulo-metodo-selecionado');
  };

  // Função para atualizar o título do método selecionado
  function atualizarTituloPagamento(metodo) {
    const titulo = document.getElementById('metodo-pagamento-titulo');
    titulo.textContent = `PAGAMENTO COM ${metodo}`;
    titulo.classList.add('titulo-metodo-selecionado');
  }




async function salvarCompraNoHistorico() {
  if (!dadosReserva) return;

  const compra = {
    user_email: localStorage.getItem("userEmail"),
    origin: dadosReserva.voo.origem,
    destination: dadosReserva.voo.destino,
    travel_date: dadosReserva.voo.partida,
    total_price: dadosReserva.voo.preco,
    purchase_source: "formulario",
    details: {
      passengers: dadosReserva.assentos.length,
      flight_code: dadosReserva.voo.codigo || "N/A"
    }
  };

  try {
    const response = await fetch("http://localhost:5000/salvar-compra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(compra)
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Compra salva no histórico com sucesso.");
    } else {
      console.error("Erro ao salvar compra:", data.error);
    }
  } catch (error) {
    console.error("Erro de rede ao salvar compra:", error);
  }
}


});
