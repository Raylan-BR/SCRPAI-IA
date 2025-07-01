/**
 * @file autenticacao.js
 * @brief Manipulação do chat interativo e exibição de passagens aéreas
 * @author LILIA ROSA COELHO MOURA <lilia.rosa@discente.ufma.br>
 */

/** @var {boolean} chatAberto - Controla o estado de abertura/fechamento do chat */
let chatAberto = false;

/**
 * Alterna o estado de abertura/fechamento do chat
 * @function abrirChatbot
 */
function abrirChatbot() {
    console.log("chat aberto")
    const conversa = document.getElementById("conteudo_historico");
    if (chatAberto) {
        conversa.style.height = "0px"; // fecha
    } else {
        conversa.style.height = "300px"; // abre
    }
    chatAberto = !chatAberto; // inverte o estado
}

/**
 * Formata a data atual para exibição nas mensagens
 * @function dataEnvioMensagem
 * @return {string} Data formatada no padrão DD/MM/AA
 */
function dataEnvioMensagem() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = String(hoje.getFullYear()).slice(-2);
    return `${dia}/${mes}/${ano}`;
}

/**
 * Exibe a mensagem do usuário no histórico do chat
 * @function gerarMinhaMensagem
 * @param {string} mensagem - Texto da mensagem do usuário
 */
function gerarMinhaMensagem(mensagem) {
    const conversa = document.getElementById("conteudo_historico");
    var caixaMensagem = document.createElement('div');
    caixaMensagem.className = 'minhaMensagem';
    var dadoMensagem = document.createElement('p');
    caixaMensagem.appendChild(dadoMensagem);
    conversa.appendChild(caixaMensagem);
    dadoMensagem.innerHTML = `${mensagem}<span>${dataEnvioMensagem()}</span>`;
    conversa.scrollTop = conversa.scrollHeight;
}

/**
 * Exibe a mensagem do chatbot no histórico do chat
 * @function gerarMensagemChatbot
 * @param {string} resposta - Texto da resposta do chatbot
 */
function gerarMensagemChatbot(resposta) {
    const conversa = document.getElementById("conteudo_historico");
    var caixaMensagem = document.createElement('div');
    caixaMensagem.className = 'chatbotMensagem';
    var dadoMensagem = document.createElement('p');
    caixaMensagem.appendChild(dadoMensagem);
    conversa.appendChild(caixaMensagem);
    dadoMensagem.innerHTML = `${resposta}<span>${dataEnvioMensagem()}</span>`;
    conversa.scrollTop = conversa.scrollHeight;
}

/**
 * Envia mensagem para o servidor e obtém resposta
 * @function enviarServidor
 * @param {string} mensagem - Mensagem do usuário para processamento
 */
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

/**
 * Processa o envio de mensagem e valida campo vazio
 * @function enviar
 */
function enviar() {
    var conteudo_campo = document.getElementById("conteudo_campo");
    
    if(conteudo_campo.value) {
        conteudo_campo.style.border = "";
        enviarServidor(conteudo_campo.value);
        gerarMinhaMensagem(conteudo_campo.value);
        conteudo_campo.value = '';
    } else {
        conteudo_campo.style.border = "2px solid red";
        console.log("digite alguma mensagem");
    }
}

/**
 * Processa a resposta do servidor e direciona para a função adequada
 * @function tratarResultado
 * @param {Object} resultado - Resposta do servidor
 */
function tratarResultado(resultado) {
    if(resultado.tipo == 1) {
        gerarMensagemChatbot(resultado.motivo);
        renderizarPassagens(resultado.voo)
    } else if(resultado.tipo == 0) {
        gerarMensagemChatbot(resultado.response);
    } else {
        console.error("erro na resposta do servidor");
    }
}

/**
 * Renderiza a lista de passagens aéreas disponíveis
 * @function renderizarPassagens
 * @param {Array} passagens - Lista de voos disponíveis
 */
function renderizarPassagens(passagens) {
    const container = document.querySelector("#lista-voos");
    container.innerHTML = '';
    document.querySelector(".container-result").classList.remove("escondido");

    passagens.forEach((voo,index) => {
        const card = document.createElement("div");
        card.className = "voo";
        card.innerHTML = `
            <div class="info-principal">
                <p class="companhia">${voo.companhia}</p>
                <p class="aeronave">Aeronave: ${voo.aeronave}</p>
                <p class="assentos">Assentos disponíveis: ${voo.assentosDisponiveis}</p>    
            </div>
            <!-- Restante do template HTML -->
        `;
        container.appendChild(card);
    });
}

/**
 * Carrega o histórico de conversas ao iniciar a página
 * @event DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    const email = localStorage.getItem("userEmail");
    fetch(`/conversa_chat?email=${encodeURIComponent(email)}`)
        .then(response => response.json())
        .then(conversas => renderizarConversas(conversas))
        .catch(error => console.error("Erro ao carregar conversa:", error));
});

/**
 * Renderiza o histórico de conversas anteriores
 * @function renderizarConversas
 * @param {Array} conversas - Lista de mensagens históricas
 */
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

/**
 * Processa a seleção de um voo específico
 * @function cardSelecionado
 * @param {number} id - ID do voo selecionado
 * @async
 */
async function cardSelecionado(id) {
    try {
        const resposta = await fetch(`/card-selecionado/${id}`);
        if (!resposta.ok) {
            throw new Error("Erro ao buscar voo no backend");
        }
        const dados = await resposta.json();
        localStorage.setItem('voo_selecionado', JSON.stringify(dados));
        window.location.href = './pages/compra/reserva.html';
        console.log("Voo selecionado salvo com sucesso:", dados);
    } catch (erro) {
        console.error("Erro ao selecionar voo:", erro);
    }
}