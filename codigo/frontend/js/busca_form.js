// Elementos do formulário
const idaBolinha = document.getElementById('ida');
const idaVoltaBolinha = document.getElementById('ida-e-volta');
const dataVoltaDiv = document.getElementById('data-volta-div');
const dataVoltaInput = document.getElementById('data-volta');
const containerVolta = document.getElementById('container-volta');

// Event listeners para os radio buttons
idaBolinha.addEventListener('change', () => {
    dataVoltaDiv.classList.add('escondido');
    dataVoltaInput.removeAttribute('required');
    containerVolta.style.display = 'none';
});

idaVoltaBolinha.addEventListener('change', () => {
    dataVoltaDiv.classList.remove('escondido');
    dataVoltaInput.setAttribute('required', '');
});

// Função para criar card de voo (reutilizável)
function criarCardVoo(voo) {
    const div = document.createElement("div");
    div.className = "voo";
    div.innerHTML = `
        <div class="info-principal">
            <p class="companhia">${voo.companhia}</p>
            <p class="aeronave">Aeronave: ${voo.aeronave} | Assentos disponíveis: ${voo.assentos}</p>
        </div>

        <div class="detalhes-voo">
            <div class="trecho">
                <strong>${voo.horario_saida}</strong>
                <div class="linha-icone">
                    <span>${voo.origem} → ${voo.destino}</span>
                    <img src="./img/localizacao.png" class="icon" alt="Localização" />
                </div>
            </div>
            <div class="trecho duracao">
                <div class="linha-icone">
                    <strong>${voo.duracao}</strong>
                    <img src="./img/relogio.png" class="icon" alt="Duração" />
                </div>
                <span>${voo.tipo_voo || 'Direto'}</span>
            </div>
            <div class="trecho">
                <strong>${voo.horario_chegada}</strong>
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

// Função principal para buscar voos
async function buscarVoos(event) {
    event.preventDefault();
    
    // Obter valores do formulário
    const origem = document.getElementById("origem").value;
    const destino = document.getElementById("destino").value;
    const dataIda = document.getElementById("dataIda").value;
    const adultos = document.getElementById("adultos").value;
    const isIdaVolta = document.getElementById("ida-e-volta").checked;
    const dataVolta = isIdaVolta ? document.getElementById("data-volta").value : null;

    // Elementos de resultado - IDA
    const rotaInfo = document.getElementById("rota-info");
    const contadorVoos = document.getElementById("contador-voos");
    const listaVoos = document.getElementById("lista-voos");

    // Elementos de resultado - VOLTA
    const rotaInfoVolta = document.getElementById("rota-info-volta");
    const contadorVoosVolta = document.getElementById("contador-voos-volta");
    const listaVoosVolta = document.getElementById("lista-voos-volta");

    // Atualizar UI - IDA
    rotaInfo.textContent = `${origem} ⮕ ${destino}`;
    listaVoos.innerHTML = "<p>Buscando voos de ida...</p>";
    contadorVoos.textContent = "";

    // Atualizar UI - VOLTA (se aplicável)
    if (isIdaVolta) {
        containerVolta.style.display = 'block';
        rotaInfoVolta.textContent = `${destino} ⮕ ${origem}`;
        listaVoosVolta.innerHTML = "<p>Buscando voos de volta...</p>";
        contadorVoosVolta.textContent = "";
    } else {
        containerVolta.style.display = 'none';
    }

    try {
        // Construir URLs da API
        let urlIda = `http://localhost:5000/api/voos?origem=${origem}&destino=${destino}&data=${dataIda}&adultos=${adultos}`;
        let urlVolta = isIdaVolta ? `http://localhost:5000/api/voos?origem=${destino}&destino=${origem}&data=${dataVolta}&adultos=${adultos}` : null;

        // Fazer requisição dos voos de IDA
        const responseIda = await fetch(urlIda);
        if (!responseIda.ok) throw new Error("Erro ao buscar voos de ida");
        const voosIda = await responseIda.json();

        // Processar voos de IDA
        listaVoos.innerHTML = "";
        if (!voosIda.length) {
            listaVoos.innerHTML = "<p>Nenhum voo de ida encontrado.</p>";
        } else {
            contadorVoos.textContent = `Foram encontradas ${voosIda.length} opções de ida`;
            voosIda.forEach(voo => {
                listaVoos.appendChild(criarCardVoo(voo));
            });
        }

        // Se for ida e volta, buscar voos de VOLTA
        if (isIdaVolta && dataVolta) {
            const responseVolta = await fetch(urlVolta);
            if (!responseVolta.ok) throw new Error("Erro ao buscar voos de volta");
            const voosVolta = await responseVolta.json();

            // Processar voos de VOLTA
            listaVoosVolta.innerHTML = "";
            if (!voosVolta.length) {
                listaVoosVolta.innerHTML = "<p>Nenhum voo de volta encontrado.</p>";
                contadorVoosVolta.textContent = "";
            } else {
                contadorVoosVolta.textContent = `Foram encontradas ${voosVolta.length} opções de volta`;
                voosVolta.forEach(voo => {
                    listaVoosVolta.appendChild(criarCardVoo(voo));
                });
            }
        }

    } catch (erro) {
        console.error("Erro na busca de voos:", erro);
        listaVoos.innerHTML = `
            <p style="color: red;">
                Ocorreu um erro na busca. Por favor, tente novamente mais tarde.
                <br><small>${erro.message}</small>
            </p>
        `;
        if (isIdaVolta) {
            listaVoosVolta.innerHTML = `
                <p style="color: red;">
                    Erro ao buscar voos de volta.
                </p>
            `;
        }
    }
}

// Adicionar evento de submit ao formulário
document.querySelector('.form').addEventListener('submit', buscarVoos);

// // Expansão do form
// const idaBolinha = document.getElementById('ida');
// const idaVoltaBolinha = document.getElementById('ida-e-volta');
// const dataVoltaDiv = document.getElementById('data-volta-div');
// const dataVoltaInput = document.getElementById('data-volta');

// // Event listeners para os radio buttons
// idaBolinha.addEventListener('change', () => {
//     dataVoltaDiv.classList.add('escondido');
//     dataVoltaInput.removeAttribute('required');
// });

// idaVoltaBolinha.addEventListener('change', () => {
//     dataVoltaDiv.classList.remove('escondido');
//     dataVoltaInput.setAttribute('required', '');
// });

// // Mostrar resultados
// async function buscarVoos(event) {
//     event.preventDefault();
    
//     // Obter valores do formulário
//     const origem = document.getElementById("origem").value;
//     const destino = document.getElementById("destino").value;
//     const dataIda = document.getElementById("dataIda").value;
//     const adultos = document.getElementById("adultos").value;
//     const isIdaVolta = document.getElementById("ida-e-volta").checked;
//     const dataVolta = isIdaVolta ? document.getElementById("data-volta").value : null;

//     // Elementos de resultado
//     const rotaInfo = document.getElementById("rota-info");
//     const contadorVoos = document.getElementById("contador-voos");
//     const listaVoos = document.getElementById("lista-voos");

//     // Atualizar UI
//     rotaInfo.textContent = `${origem} ⮕ ${destino}`;
//     listaVoos.innerHTML = "<p>Buscando voos...</p>";
//     contadorVoos.textContent = "";

//     try {
//         // Construir URL da API
//         let url = `http://localhost:5000/api/voos?origem=${origem}&destino=${destino}&data=${dataIda}&adultos=${adultos}`;
//         if (isIdaVolta && dataVolta) {
//             url += `&dataVolta=${dataVolta}`;
//         }

//         // Fazer requisição
//         const response = await fetch(url);
//         if (!response.ok) throw new Error("Erro ao buscar voos");

//         const voos = await response.json();
//         listaVoos.innerHTML = "";

//         // Tratar caso sem voos
//         if (!voos.length) {
//             listaVoos.innerHTML = "<p>Nenhum voo encontrado para os critérios selecionados.</p>";
//             return;
//         }

//         // Mostrar contagem de voos
//         contadorVoos.textContent = `Foram encontradas ${voos.length} opções`;

//         // Renderizar cada voo
//         voos.forEach(voo => {
//             const div = document.createElement("div");
//             div.className = "voo";
//             div.innerHTML = `
//                 <div class="info-principal">
//                     <p class="companhia">${voo.companhia}</p>
//                     <p class="aeronave">Aeronave: ${voo.aeronave} | Assentos disponíveis: ${voo.assentos}</p>
//                 </div>

//                 <div class="detalhes-voo">
//                     <div class="trecho">
//                         <strong>${voo.horario_saida}</strong>
//                         <div class="linha-icone">
//                             <span>${voo.origem} → ${voo.destino}</span>
//                             <img src="./img/localizacao.png" class="icon" alt="Localização" />
//                         </div>
//                     </div>
//                     <div class="trecho duracao">
//                         <div class="linha-icone">
//                             <strong>${voo.duracao}</strong>
//                             <img src="./img/relogio.png" class="icon" alt="Duração" />
//                         </div>
//                         <span>${voo.tipo_voo || 'Direto'}</span>
//                     </div>
//                     <div class="trecho">
//                         <strong>${voo.horario_chegada}</strong>
//                         <div class="linha-icone">
//                             <span>${voo.destino}</span>
//                             <img src="./img/localizacao.png" class="icon" alt="Localização" />
//                         </div>
//                     </div>
//                 </div>

//                 <div class="acao">
//                     <div class="preco">R$ ${voo.preco.toLocaleString('pt-BR')}<small> por pessoa</small></div>
//                     <button class="selecionar">Selecionar</button>
//                 </div>
//             `;
            
//             // Adicionar evento ao botão selecionar
//             const btnSelecionar = div.querySelector('.selecionar');
//             btnSelecionar.addEventListener('click', () => {
//                 alert(`Voo ${voo.companhia} selecionado!`);
//                 // Aqui você pode adicionar a lógica para reservar o voo
//             });
            
//             listaVoos.appendChild(div);
//         });

//     } catch (erro) {
//         console.error("Erro na busca de voos:", erro);
//         listaVoos.innerHTML = `
//             <p style="color: red;">
//                 Ocorreu um erro na busca. Por favor, tente novamente mais tarde.
//                 <br><small>${erro.message}</small>
//             </p>
//         `;
//     }
// }

// // Adicionar evento de submit ao formulário
// document.querySelector('.form').addEventListener('submit', buscarVoos);