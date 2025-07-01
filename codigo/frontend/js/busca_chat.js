/**
 * @file busca_chat.js
 * @brief Script para controle do chatbot e exibição de passagens aéreas
 * @author RAYLAN BRUNO SANTANA CARVALHO <raylan.bruno@discente.ufma.br>
 */

/** @var {boolean} chatAberto - Controla o estado de abertura do chat */
let chatAberto = false;

/**
 * Alterna o estado de abertura/fechamento do chat
 * @function abrirChatbot
 */
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

/**
 * Formata a data atual para exibição nas mensagens
 * @function dataEnvioMensagem
 * @return {string} Data formatada no padrão DD/MM/AA
 */
function dataEnvioMensagem(){
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = String(hoje.getMonth() + 1).padStart(2, "0"); // mês começa do zero
    const ano = String(hoje.getFullYear()).slice(-2); // pega só os dois últimos dígitos
    return `${dia}/${mes}/${ano}`;
}

/**
 * Exibe a mensagem do usuário no chat
 * @function gerarMinhaMensagem
 * @param {string} mensagem - Texto da mensagem do usuário
 */
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

/**
 * Exibe a mensagem do chatbot no chat
 * @function gerarMensagemChatbot
 * @param {string} resposta - Texto da resposta do chatbot
 */
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

/**
 * Envia mensagem para o servidor do chatbot
 * @function enviarServidor
 * @param {string} mensagem - Mensagem do usuário a ser enviada
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
 * Processa o envio de mensagem pelo usuário
 * @function enviar
 */
function enviar(){
    var conteudo_campo = document.getElementById("conteudo_campo");
    
    if(!chatAberto){
        document.getElementById("conteudo_historico").style.height = "300px";
    }

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

/**
 * Listener para envio de mensagem com tecla Enter
 * @event conteudo_campo#keydown
 */
document.getElementById('conteudo_campo').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // evita quebra de linha se for textarea
        enviar();
    }
});

/**
 * Processa a resposta do servidor do chatbot
 * @function tratarResultado
 * @param {Object} resultado - Resposta do servidor
 */
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

/**
 * Renderiza a lista de passagens aéreas
 * @function renderizarPassagens
 * @param {Array} passagens - Lista de voos disponíveis
 */
function renderizarPassagens(passagens) {
    // Limpa o conteúdo anterior
    const container = document.querySelector("#lista-voos");
    container.innerHTML = '';

    // Garante que o container de resultados está visível
    document.querySelector(".container-result").classList.remove("escondido");

    document.querySelector("#rota-info").textContent = `${passagens["voo"].origem} ⮕ ${passagens["voo"].destino}`;
    document.querySelector("#contador-voos").textContent = `A IA encontrou ${voo.length} opções.`;

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