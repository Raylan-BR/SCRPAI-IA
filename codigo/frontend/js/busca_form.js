// Expanção do form
const idaBolinha = document.getElementById('ida');
const idaVoltaBolinha = document.getElementById('ida-e-volta');
const dataVoltaDiv = document.getElementById('data-volta-div');

idaBolinha.addEventListener('change', () => {
    dataVoltaDiv.classList.add('escondido');
});

idaVoltaBolinha.addEventListener('change', () => {
    dataVoltaDiv.classList.remove('escondido');
});

// Mostrar resultados

// function buscarVoos(event) {
//     event.preventDefault();

//     const origem = document.getElementById('origem').value;
//     const destino = document.getElementById('destino').value;
//     const dataIda = document.getElementById('data-ida').value;
//     const dataVolta = document.getElementById('data-volta').value;
//     const passageiros = document.getElementById('passageiros').value;

//     // Exemplo de chamada à API (ajuste a URL conforme sua API)
//     fetch(`http://localhost:5000/api/flights?origem=${origem}&destino=${destino}&data=${data}&adultos=${passageiros}`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             origem,
//             destino,
//             dataIda,
//             dataVolta,
//             passageiros
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         mostrarResultados(data);
//     })
//     .catch(error => {
//         document.getElementById('resultado-voos').innerHTML = 'Erro ao buscar voos.';
//     });
// }

// function mostrarResultados(voos) {
//     const container = document.getElementById('resultado-voos');
//     if (!voos.length) {
//         container.innerHTML = '<p>Nenhum voo encontrado.</p>';
//         return;
//     }
//     container.innerHTML = voos.map(voo => `
//         <div class="voo">
//             <div><strong>Companhia:</strong> ${voo.companhia}</div>
//             <div><strong>Origem:</strong> ${voo.origem}</div>
//             <div><strong>Destino:</strong> ${voo.destino}</div>
//             <div><strong>Preço:</strong> R$ ${voo.preco}</div>
//         </div>
//     `).join('');
// }