/**
 * @file busca_form.js
 * @brief Script para busca e exibição de voos
 * @author KAUAN GUILHERME ALVES PINHEIRO SANTOS <kauan.santos@discente.ufma.br>
 */

// Elementos do formulário (mantido igual)
const idaBolinha = document.getElementById('ida');
const idaVoltaBolinha = document.getElementById('ida-e-volta');
const dataVoltaDiv = document.getElementById('data-volta-div');
const dataVoltaInput = document.getElementById('data-volta');
const containerVolta = document.getElementById('container-volta');

// Event listeners (mantido igual)
idaBolinha.addEventListener('change', () => {
    dataVoltaDiv.classList.add('escondido');
    dataVoltaInput.removeAttribute('required');
    containerVolta.style.display = 'none';
});

idaVoltaBolinha.addEventListener('change', () => {
    dataVoltaDiv.classList.remove('escondido');
    dataVoltaInput.setAttribute('required', '');
});

/**
 * Cria um card de voo para exibição
 * @function criarCardVoo
 * @param {Object} voo - Dados do voo
 * @param {number} index - Índice do voo
 * @param {string} [tipo="ida"] - Tipo do voo (ida/volta)
 * @return {HTMLElement} Elemento HTML do card de voo
 */
function criarCardVoo(voo, index, tipo = "ida") {
    voo.id = `${tipo}-${index}`; // Adiciona um ID único

    const div = document.createElement("div");
    div.className = "voo";
    div.innerHTML = `
        <!-- Template HTML do card de voo -->
    `;
    
    const btnSelecionar = div.querySelector('.selecionar');
    btnSelecionar.addEventListener('click', () => {
        localStorage.setItem('voo_selecionado', JSON.stringify(voo));
        window.location.href = './pages/compra/reserva.html';
    });
    
    return div;
}

/**
 * Banco de dados de cidades com coordenadas
 * @const {Object} cidades
 */
const cidades = {
    "São Paulo": { pais: "Brasil", lat: -23.55, lng: -46.63 },
    // ... outras cidades
};

/**
 * Calcula distância entre duas cidades em km
 * @function calcularDistancia
 * @param {string} cidade1 - Nome da cidade de origem
 * @param {string} cidade2 - Nome da cidade de destino
 * @return {number} Distância em quilômetros
 */
function calcularDistancia(cidade1, cidade2) {
    if (!cidades[cidade1] || !cidades[cidade2]) return 1000;
    
    // Cálculo usando fórmula de Haversine
    const lat1 = cidades[cidade1].lat;
    const lng1 = cidades[cidade1].lng;
    const lat2 = cidades[cidade2].lat;
    const lng2 = cidades[cidade2].lng;
    
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

/**
 * Gera dados mockados de voos realistas
 * @function gerarVoosMock
 * @param {string} origem - Cidade de origem
 * @param {string} destino - Cidade de destino
 * @param {string} data - Data do voo
 * @param {number} adultos - Número de passageiros
 * @return {Array} Lista de voos gerados
 */
function gerarVoosMock(origem, destino, data, adultos) {
    const companhias = ["LATAM", "Gol", "Azul", "Voepass"];
    const aeronavesNacionais = ["Embraer 195", "Embraer 190", "Boeing 737", "Airbus A320"];
    const aeronavesInternacionais = ["Boeing 787", "Airbus A330", "Boeing 777", "Airbus A350"];
    
    const isInternacional = cidades[origem]?.pais !== cidades[destino]?.pais;
    const distancia = calcularDistancia(origem, destino);
    
    // ... funções auxiliares para gerar horários, durações, escalas e preços
    
    const voos = [];
    const numVoos = Math.floor(3 + Math.random() * 3); // Entre 3 e 5 voos
    
    for (let i = 0; i < numVoos; i++) {
        // Geração de dados para cada voo
        voos.push({
            companhia: companhias[Math.floor(Math.random() * companhias.length)],
            aeronave: selecionarAeronave(isInternacional),
            assentosDisponiveis: Math.floor(1 + Math.random() * 30),
            partida: gerarHorarioPartida(),
            chegada: calcularHorarioChegada(partida, duracao.minutos),
            origem,
            destino,
            duracao: duracao.texto,
            escalas: gerarEscalas(distancia, isInternacional),
            preco: gerarPreco(distancia, isInternacional),
            moeda: "BRL"
        });
    }
    
    // Ordenar voos por horário de partida
    voos.sort((a, b) => {
        const [horaA, minutoA] = a.partida.split(':').map(Number);
        const [horaB, minutoB] = b.partida.split(':').map(Number);
        return horaA - horaB || minutoA - minutoB;
    });
    
    return voos;
}

/**
 * Realiza a busca de voos (função principal)
 * @async
 * @function buscarVoos
 * @param {Event} event - Evento de submit do formulário
 */
async function buscarVoos(event) {
    event.preventDefault();
    
    // Configuração inicial da UI
    document.getElementById("container-ida").classList.remove("escondido");
    
    // Obtenção dos valores do formulário
    const origem = document.getElementById("origem").value;
    const destino = document.getElementById("destino").value;
    const dataIda = document.getElementById("dataIda").value;
    const adultos = document.getElementById("adultos").value;
    const isIdaVolta = document.getElementById("ida-e-volta").checked;
    const dataVolta = isIdaVolta ? document.getElementById("data-volta").value : null;

    // Elementos da UI
    const rotaInfo = document.getElementById("rota-info");
    const contadorVoos = document.getElementById("contador-voos");
    const listaVoos = document.getElementById("lista-voos");

    const rotaInfoVolta = document.getElementById("rota-info-volta");
    const contadorVoosVolta = document.getElementById("contador-voos-volta");
    const listaVoosVolta = document.getElementById("lista-voos-volta");

    // Atualização da UI
    rotaInfo.textContent = `${origem} ⮕ ${destino}`;
    listaVoos.innerHTML = "<p>Buscando voos de ida...</p>";
    contadorVoos.textContent = "";

    if (isIdaVolta) {
        containerVolta.style.display = 'block';
        rotaInfoVolta.textContent = `${destino} ⮕ ${origem}`;
        listaVoosVolta.innerHTML = "<p>Buscando voos de volta...</p>";
        contadorVoosVolta.textContent = "";
    } else {
        containerVolta.style.display = 'none';
    }

    try {
        // Busca de voos de ida
        const voosIda = gerarVoosMock(origem, destino, dataIda, adultos);
        listaVoos.innerHTML = "";
        if (!voosIda.length) {
            listaVoos.innerHTML = "<p>Nenhum voo de ida encontrado.</p>";
        } else {
            contadorVoos.textContent = `Foram encontradas ${voosIda.length} opções de ida`;
            voosIda.forEach(voo => {
                listaVoos.appendChild(criarCardVoo(voo));
            });
        }

        // Busca de voos de volta (se aplicável)
        if (isIdaVolta && dataVolta) {
            const voosVolta = gerarVoosMock(destino, origem, dataVolta, adultos);
            listaVoosVolta.innerHTML = "";
            if (!voosVolta.length) {
                listaVoosVolta.innerHTML = "<p>Nenhum voo de volta encontrado.</p>";
            } else {
                contadorVoosVolta.textContent = `Foram encontradas ${voosVolta.length} opções de volta`;
                voosVolta.forEach(voo => {
                    listaVoosVolta.appendChild(criarCardVoo(voo));
                });
            }
        }

        // Armazenamento dos resultados
        localStorage.setItem('voos_disponiveis', JSON.stringify({
            voosIda,
            voosVolta: isIdaVolta && dataVolta ? voosVolta : []
        }));

    } catch (erro) {
        console.error("Erro na busca de voos:", erro);
        listaVoos.innerHTML = `<p style="color: red;">Erro na busca. <br><small>${erro.message}</small></p>`;
        if (isIdaVolta) {
            listaVoosVolta.innerHTML = `<p style="color: red;">Erro ao buscar voos de volta.</p>`;
        }
    }
}

// Listener no formulário (mantido igual)
document.querySelector('.form').addEventListener('submit', buscarVoos);