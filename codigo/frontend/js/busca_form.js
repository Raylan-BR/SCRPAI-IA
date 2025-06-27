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

// Função para criar card de voo (mantido igual)
function criarCardVoo(voo) {
    const div = document.createElement("div");
    div.className = "voo";
    div.innerHTML = `
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
                <span>${voo.escalas}</span>
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
            <button class="selecionar">Selecionar</button>
        </div>
    `;
    
    const btnSelecionar = div.querySelector('.selecionar');
    btnSelecionar.addEventListener('click', () => {
        alert(`Voo ${voo.companhia} selecionado!`);
    });
    
    return div;
}

// Banco de dados de cidades com coordenadas aproximadas
const cidades = {
    "São Paulo": { pais: "Brasil", lat: -23.55, lng: -46.63 },
    "Rio de Janeiro": { pais: "Brasil", lat: -22.91, lng: -43.20 },
    "Belo Horizonte": { pais: "Brasil", lat: -19.92, lng: -43.94 },
    "Brasília": { pais: "Brasil", lat: -15.78, lng: -47.93 },
    "Salvador": { pais: "Brasil", lat: -12.97, lng: -38.50 },
    "Fortaleza": { pais: "Brasil", lat: -3.73, lng: -38.52 },
    "Recife": { pais: "Brasil", lat: -8.05, lng: -34.90 },
    "Manaus": { pais: "Brasil", lat: -3.10, lng: -60.02 },
    "São Luís": { pais: "Brasil", lat: -2.53, lng: -44.30 },
    "Londres": { pais: "Reino Unido", lat: 51.51, lng: -0.13 },
    "Paris": { pais: "França", lat: 48.86, lng: 2.35 },
    "Nova York": { pais: "EUA", lat: 40.71, lng: -74.01 },
    "Miami": { pais: "EUA", lat: 25.76, lng: -80.19 },
    "Lisboa": { pais: "Portugal", lat: 38.72, lng: -9.14 },
    "Madrid": { pais: "Espanha", lat: 40.42, lng: -3.70 },
    "Buenos Aires": { pais: "Argentina", lat: -34.60, lng: -58.38 },
    "Santiago": { pais: "Chile", lat: -33.45, lng: -70.67 }
};

// Função para calcular distância entre duas cidades em km (fórmula simplificada)
function calcularDistancia(cidade1, cidade2) {
    if (!cidades[cidade1] || !cidades[cidade2]) return 1000; // Valor padrão se cidade não existir
    
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

// Função mock para gerar voos falsos mais realistas
function gerarVoosMock(origem, destino, data, adultos) {
    const companhias = ["LATAM", "Gol", "Azul", "Voepass"];
    const aeronavesNacionais = ["Embraer 195", "Embraer 190", "Boeing 737", "Airbus A320"];
    const aeronavesInternacionais = ["Boeing 787", "Airbus A330", "Boeing 777", "Airbus A350"];
    
    // Determinar se é um voo internacional
    const isInternacional = cidades[origem]?.pais !== cidades[destino]?.pais;
    const distancia = calcularDistancia(origem, destino);
    
    function gerarHorarioPartida() {
        // Voos internacionais geralmente saem à noite
        if (isInternacional) {
            const hora = Math.floor(18 + Math.random() * 6); // Entre 18h e 23h59
            const minuto = Math.floor(Math.random() * 60);
            return `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        } else {
            // Voos nacionais têm horários mais distribuídos
            const hora = Math.floor(Math.random() * 24);
            const minuto = Math.floor(Math.random() * 60);
            return `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        }
    }
    
    function calcularHorarioChegada(partida, duracaoMinutos) {
        const [horaPartida, minutoPartida] = partida.split(':').map(Number);
        let horaChegada = horaPartida + Math.floor(duracaoMinutos / 60);
        let minutoChegada = minutoPartida + (duracaoMinutos % 60);
        
        if (minutoChegada >= 60) {
            minutoChegada -= 60;
            horaChegada += 1;
        }
        
        if (horaChegada >= 24) {
            horaChegada -= 24;
        }
        
        return `${horaChegada.toString().padStart(2, '0')}:${minutoChegada.toString().padStart(2, '0')}`;
    }
    
    function gerarDuracao(distancia) {
        // Velocidade média de 800 km/h + tempo adicional para decolagem/aterrissagem
        const horasVoo = distancia / 800;
        const horasAdicionais = isInternacional ? 0.5 : 0.2; // Tempo adicional para voos internacionais
        
        // Adicionar variação aleatória de ±15% na duração
        const variacao = 0.85 + Math.random() * 0.3; // Entre 85% e 115% do tempo calculado
        const minutosTotais = Math.round((horasVoo + horasAdicionais) * 60 * variacao);
        
        // Garantir duração mínima de 30 minutos para voos muito curtos
        const minutosAjustados = Math.max(minutosTotais, 30);
        
        const horas = Math.floor(minutosAjustados / 60);
        const minutos = minutosAjustados % 60;
        return {
            texto: `${horas}h ${minutos.toString().padStart(2, '0')}m`,
            minutos: minutosAjustados
    };
}
    
    function gerarEscalas(distancia, isInternacional) {
        // Voos curtos (até 500km) - quase sempre diretos
        if (distancia <= 500) {
            return Math.random() > 0.9 ? "1 escala" : "Direto"; // 10% de chance de escala
        }
        
        // Voos médios (500-1500km) - maioria direto, alguns com escala
        if (distancia <= 1500) {
            if (isInternacional) {
                return Math.random() > 0.7 ? "1 escala" : "Direto"; // 30% de chance
            }
            return Math.random() > 0.85 ? "1 escala" : "Direto"; // 15% de chance
        }
        
        // Voos longos nacionais (1500-3000km)
        if (!isInternacional) {
            return Math.random() > 0.6 ? "1 escala" : "Direto"; // 40% de chance
        }
        
        // Voos internacionais longos (3000-7000km)
        if (distancia <= 7000) {
            const rand = Math.random();
            return rand > 0.7 ? "Direto" : rand > 0.3 ? "1 escala" : "2 escalas";
        }
        
        // Voos intercontinentais (acima de 7000km) - sempre com escalas
        const rand = Math.random();
        return rand > 0.6 ? "1 escala" : rand > 0.2 ? "2 escalas" : "3 escalas";
    }
    
    function gerarPreco(distancia, isInternacional) {
        // Fatores que influenciam o preço
        const temporada = 0.8 + Math.random() * 0.6; // Varia entre 80% e 140%
        const demanda = 0.9 + Math.random() * 0.3; // Varia entre 90% e 120%
        const companhiaPremium = Math.random() > 0.7 ? 1.3 : 1; // 30% de chance de ser mais caro
        
        // Preço base por km (varia por tipo de voo)
        let precoBasePorKm;
        if (distancia < 500) {
            precoBasePorKm = 0.8; // Voos curtos são mais caros por km
        } else if (distancia < 2000) {
            precoBasePorKm = 0.5; // Voos médios
        } else {
            precoBasePorKm = 0.3; // Voos longos são mais baratos por km
        }
        
        // Ajuste para voos internacionais
        if (isInternacional) {
            precoBasePorKm *= 1.5;
            // Taxa adicional para voos intercontinentais
            if (distancia > 5000) {
                precoBasePorKm *= 1.2;
            }
        }
        
        // Cálculo do preço base
        let preco = distancia * precoBasePorKm;
        
        // Aplicar variações
        preco = preco * temporada * demanda * companhiaPremium;
        
        // Arredondar para múltiplo de 10 mais próximo
        preco = Math.round(preco / 10) * 10;
        
        // Garantir preços mínimos realistas
        if (isInternacional) {
            preco = Math.max(preco, 1000);
        } else {
            preco = Math.max(preco, 200);
        }
        
        // Adicionar variação final pequena (±R$50)
        preco += (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 50);
        
        return preco;
    }
    
    function selecionarAeronave(isInternacional) {
        if (isInternacional) {
            return aeronavesInternacionais[Math.floor(Math.random() * aeronavesInternacionais.length)];
        } else {
            return aeronavesNacionais[Math.floor(Math.random() * aeronavesNacionais.length)];
        }
    }
    
    const voos = [];
    const numVoos = Math.floor(3 + Math.random() * 3); // Entre 3 e 5 voos
    
    for (let i = 0; i < numVoos; i++) {
        const companhia = companhias[Math.floor(Math.random() * companhias.length)];
        const aeronave = selecionarAeronave(isInternacional);
        const partida = gerarHorarioPartida();
        const duracao = gerarDuracao(distancia);
        const chegada = calcularHorarioChegada(partida, duracao.minutos);
        const escalas = gerarEscalas(distancia, isInternacional);
        
        voos.push({
            companhia,
            aeronave,
            assentosDisponiveis: Math.floor(1 + Math.random() * 30),
            partida,
            chegada,
            origem,
            destino,
            duracao: duracao.texto,
            escalas,
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

// Restante do código (mantido igual)
async function buscarVoos(event) {
    event.preventDefault();
    
    document.getElementById("container-ida").classList.remove("escondido");
    const origem = document.getElementById("origem").value;
    const destino = document.getElementById("destino").value;
    const dataIda = document.getElementById("dataIda").value;
    const adultos = document.getElementById("adultos").value;
    const isIdaVolta = document.getElementById("ida-e-volta").checked;
    const dataVolta = isIdaVolta ? document.getElementById("data-volta").value : null;

    const rotaInfo = document.getElementById("rota-info");
    const contadorVoos = document.getElementById("contador-voos");
    const listaVoos = document.getElementById("lista-voos");

    const rotaInfoVolta = document.getElementById("rota-info-volta");
    const contadorVoosVolta = document.getElementById("contador-voos-volta");
    const listaVoosVolta = document.getElementById("lista-voos-volta");

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
        // MOCK IDA
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

        // MOCK VOLTA
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
