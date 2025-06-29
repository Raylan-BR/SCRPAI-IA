let chatAberto = false;

function abrirChatbot(){
    console.log("chat aberto")
    const conversa = document.getElementById("conteudo_historico");
    if (chatAberto) {
        conversa.style.height = "0px"; // fecha
  } else {
        conversa.style.height = "300px"; // abre
  }

  chatAberto = !chatAberto; // inverte o estado
}
function dataEnvioMensagem(){
    const hoje = new Date();

  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0"); // mês começa do zero
  const ano = String(hoje.getFullYear()).slice(-2); // pega só os dois últimos dígitos

  return `${dia}/${mes}/${ano}`;
}
//gerar mensagem do usuario na tela
function gerarMinhaMensagem(mensagem){
    const conversa = document.getElementById("conteudo_historico");

    //caixa da mensagem
    var caixaMensagem = document.createElement('div');
    caixaMensagem.className = 'minhaMensagem';
    //mensagem 
    var dadoMensagem = document.createElement('p');

    //adicionar mensagem na caixa
    caixaMensagem.appendChild(dadoMensagem);
    //adicionar a caixa na conversa
    conversa.appendChild(caixaMensagem);
    dadoMensagem.innerHTML = `${mensagem}<span>${dataEnvioMensagem()}</span>`;

    conversa.scrollTop = conversa.scrollHeight;
}
//gerar a mensagem do chatbot na tela
function gerarMensagemChatbot(resposta){
    const conversa = document.getElementById("conteudo_historico");

    //caixa da mensagem
    var caixaMensagem = document.createElement('div');
    caixaMensagem.className = 'chatbotMensagem';
    //mensagem 
    var dadoMensagem = document.createElement('p');

    //adicionar mensagem na caixa
    caixaMensagem.appendChild(dadoMensagem);
    //adicionar a caixa na conversa
    conversa.appendChild(caixaMensagem);
    dadoMensagem.innerHTML = `${resposta}<span>${dataEnvioMensagem()}</span>`;
    conversa.scrollTop = conversa.scrollHeight;
}
//requisição para servidor
function enviarServidor(mensagem) {
    let userEmail = localStorage.getItem('userEmail') || "";
    console.log("mensagem enviada pro chat");
    fetch("/chat", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: mensagem, email: userEmail})
    })
    .then(res => res.json())
    .then(data => {
        tratarResultado(data)
    });
}
function enviar(){
    var conteudo_campo = document.getElementById("conteudo_campo");
    
    if(conteudo_campo.value){
        conteudo_campo.style.border = "";
        enviarServidor(conteudo_campo.value);
        gerarMinhaMensagem(conteudo_campo.value);
        conteudo_campo.value = '';
    } else {
        conteudo_campo.style.border = "2px solid red";
        console.log("digite alguma mensagem");
    }
}

function tratarResultado(resultado){
    if(resultado.tipo ==1){
        gerarMensagemChatbot(resultado.motivo);
        renderizarPassagens(resultado.voo)
    }else if(resultado.tipo == 0){
        gerarMensagemChatbot(resultado.response);
    }
    else {
        console.error("erro na resposta do servidor");
    }
}
function renderizarPassagens(passagens) {
    // Limpa o conteúdo anterior
    const container = document.querySelector("#lista-voos");
    container.innerHTML = '';

    // Garante que o container de resultados está visível
    document.querySelector(".container-result").classList.remove("escondido");

    passagens.forEach((voo,index) => {
        // Cria o card principal
        const card = document.createElement("div");
        card.className = "voo";

        // Define o conteúdo do card
        card.innerHTML = `
            <div class="info-principal">
                <p class="companhia">${voo.companhia}</p>
                <p class="aeronave">Aeronave: ${voo.aeronave}</p>
                <p class="assentos">Assentos disponíveis: ${voo.assentosDisponiveis}</p>    
            </div>

            <div class="detalhes-voo">
                <div class="trecho">
                    <strong>${voo.partida}</strong>
                    <div class="linha-icone">
                        <span>${voo.origem}</span>
                        <img src="./img/localizacao.png" class="icon" alt="Localização" />
                    </div>
                </div>
                <div class="trecho duracao">
                    <div class="linha-icone">
                        <strong>${voo.duracao}</strong>
                        <img src="./img/relogio.png" class="icon" alt="Duração" />
                    </div>
                    <span>${voo.escalas === 0 ? 'Direto' : `${voo.escalas} ${voo.escalas === 1 ? 'escala' : 'escalas'}`}</span>
                </div>
                <div class="trecho">
                    <strong>${voo.chegada}</strong>
                    <div class="linha-icone">
                        <span>${voo.destino}</span>
                        <img src="./img/localizacao.png" class="icon" alt="Localização" />
                    </div>
                </div>
            </div>

            <div class="acao">
                <div class="preco">R$ ${voo.preco.toLocaleString('pt-BR')}<small> por pessoa</small></div>
                <button class="selecionar" onclick="cardSelecionado(${index})">Selecionar</button>
            </div>
        `;

        // Adiciona o card ao container
        container.appendChild(card);
    });
}
//renderizar histórico de conversas no chatbot
document.addEventListener('DOMContentLoaded', () => {
  // Supondo que o email está no localStorage
const email = localStorage.getItem("userEmail");

fetch(`/conversa_chat?email=${encodeURIComponent(email)}`)
  .then(response => response.json())
  .then(conversas => renderizarConversas(conversas))
  .catch(error => console.error("Erro ao carregar conversa:", error));
});
function renderizarConversas(conversas) {
  conversas.slice(1).forEach(mensagem => {
    const texto = mensagem.parts.map(p => p.text);
    if (mensagem.role === "user") {
      gerarMinhaMensagem(texto);
    } else {
      gerarMensagemChatbot(texto);
    }
  });
}

async function cardSelecionado(id) {
  try {
    const resposta = await fetch(`/card-selecionado/${id}`);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar voo no backend");
    }

    const dados = await resposta.json();

    // Salva no localStorage como string
    localStorage.setItem('voo_selecionado', JSON.stringify(dados));
    window.location.href = './pages/compra/reserva.html';

    console.log("Voo selecionado salvo com sucesso:", dados);
  } catch (erro) {
    console.error("Erro ao selecionar voo:", erro);
  }
}
