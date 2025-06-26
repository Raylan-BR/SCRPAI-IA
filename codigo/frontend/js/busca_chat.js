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
    dadoMensagem.innerHTML = `${mensagem.value}<span>${dataEnvioMensagem()}</span>`;

    mensagem.value = "";
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
    console.log("mensagem enviada pro chat");
    fetch("/chat", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: mensagem})
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
        gerarMinhaMensagem(conteudo_campo);
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
  const container = document.querySelector(".results-section");
  container.innerHTML = ""; // limpa resultados anteriores

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
              <span>${voo.origem} - ${voo.destino}</span>
              <img src="./img/localizacao.png" alt="Localização" class="icon">
            </div>
          </div>
          <div class="trecho duracao">
            <div class="linha-icone">
              <strong>${voo.duracao}</strong>
              <img src="./img/relogio.png" alt="Relógio" class="icon">
            </div>
            <span>${voo.paradas === 0 ? "Direto" : `${voo.paradas} parada(s)`}</span>
          </div>
          <div class="trecho">
            <strong>${voo.hora_chegada}</strong>
            <div class="linha-icone">
              <span>${voo.destino} - ${voo.origem}</span>
              <img src="./img/localizacao.png" alt="Localização" class="icon">
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
