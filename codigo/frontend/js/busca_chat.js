let chatAberto = false;

function abrirChatbot(){
    console.log("chat aberto")
    const conversa = document.getElementById("conteudo_historico");
    if (chatAberto) {
        conversa.style.height = "0px"; // fecha
  } else {
        conversa.style.height = "400px"; // abre
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

function gerarMinhaMensagem(mensagem){
    const conversa = document.getElementById("conteudo_historico");
    const agora = new Date();

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

function enviar(){
    var conteudo_campo = document.getElementById("conteudo_campo");
    
    if(conteudo_campo.value){
        conteudo_campo.style.border = "";
        gerarMinhaMensagem(conteudo_campo);
    } else {
        conteudo_campo.style.border = "2px solid red";
        console.log("digite alguma mensagem");
    }
}