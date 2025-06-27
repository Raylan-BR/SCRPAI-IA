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
    userEmail = localStorage.getItem('userEmail');
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
        gerarMensagemChatbot("Veja minha recomendações abaixo...");
        renderizarPassagens(resultado.voo)
    }else if(resultado.tipo == 0){
        gerarMensagemChatbot(resultado.response);
    }
    else {
        console.error("erro na resposta do servidor");
    }
}
function renderizarPassagens(passagens) {
     //limpar conteúdo
    const container = document.querySelector("#lista-voos");
    container.innerHTML = '';
    document.querySelector(".container-result").classList.remove("escondido");
    passagens.forEach((voo) => {
    const card = `
                <div class="voo">
            <div class="info-principal">
                <p class="companhia">${voo.companhia.toUpperCase()}</p>
                <p class="aeronave">Aeronave: A320 Assentos disponíveis: 12</p>
            </div>

            <div class="detalhes-voo">
                <div class="trecho">
                <strong>${voo.hora_partida}</strong>
                <div class="linha-icone">
                    <span>${voo.origem}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 25px" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                </div>
                </div>

                <div class="trecho duracao">
                <div class="linha-icone">
                    <strong>${voo.duracao}</strong>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                <span>${voo.paradas === 0 ? "Direto" : `${voo.paradas} parada(s)`}</span>
                </div>

                <div class="trecho">
                <strong>${voo.hora_chegada}</strong>
                <div class="linha-icone">
                    <span>${voo.destino}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 25px" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                </div>
                </div>
            </div>

            <div class="acao">
                <div class="preco">
                R$ ${voo.preco.toFixed(2).replace(".", ",")}
                <small>por pessoa</small>
                </div>
                <button class="selecionar" data-voo-id="${voo.voo_id}">Selecionar</button>
            </div>
            </div>
    `;
    container.innerHTML += card;
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
