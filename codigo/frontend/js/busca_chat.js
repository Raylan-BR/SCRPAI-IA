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
        if(data.tipo==1){
            console.log("chat buscou passagens...");
            gerarMensagemChatbot("Veja minhas sugestões aí embaixo...")
            //criando um card de voo
            criarCardVoo2(data);
        }else {
            console.log("chat precisa de mais info");
            gerarMensagemChatbot(data.response)
        }
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

function criarCardVoo2(voo){
    console.log("a função criarCardVoo foi chamada");
    const resultsSection = document.querySelector('.results-section');
    const divVoo = document.createElement('div');
    divVoo.classList.add('voo');
    divVoo.innerHTML = `<p>voo de: ${voo.partida} para: ${voo.destino} na data: ${voo.data}</p>`; 
    resultsSection.appendChild(divVoo);
}