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

function gerarMinhaMensagem(mensagem){
    const conversa = document.getElementById("conteudo_historico");

    var caixaMensagem = document.createElement('div');
    caixaMensagem.className = 'minha_mensagem';

    var dadoMensagem = document.createElement('p');
    dadoMensagem.className = 'estiloMensagem';

    caixaMensagem.appendChild(dadoMensagem);
    conversa.appendChild(caixaMensagem);
    dadoMensagem.innerText = mensagem.value;
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