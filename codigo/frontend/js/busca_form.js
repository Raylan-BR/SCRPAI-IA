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

async function buscarVoos() {
  event.preventDefault();

  const origem = document.getElementById("origem").value;
  const destino = document.getElementById("destino").value;
  const data = document.getElementById("dataIda").value;
  const adultos = document.getElementById("adultos").value;

  const rotaInfo = document.getElementById("rota-info");
  const contadorVoos = document.getElementById("contador-voos");
  const listaVoos = document.getElementById("lista-voos");

  rotaInfo.textContent = `${origem} ⮕ ${destino}`;
  listaVoos.innerHTML = "<p>Buscando voos...</p>";
  contadorVoos.textContent = "";

  try {
    const response = await fetch(`http://localhost:5000/api/voos?origem=${origem}&destino=${destino}&data=${data}&adultos=${adultos}`);
    if (!response.ok) throw new Error("Erro ao buscar voos");

    const voos = await response.json();
    listaVoos.innerHTML = "";

    if (!voos.length) {
      listaVoos.innerHTML = "<p>Nenhum voo encontrado.</p>";
      return;
    }

    contadorVoos.textContent = `IA encontrou ${voos.length} opções`;

    voos.forEach(voo => {
      const div = document.createElement("div");
      div.className = "voo";
      div.innerHTML = `
        <div class="info-principal">
          <p class="companhia">${voo.companhia}</p>
          <p class="aeronave">Aeronave: ${voo.aeronave} Assentos disponíveis: ${voo.assentos}</p>
        </div>

        <div class="detalhes-voo">
          <div class="trecho">
            <strong>${voo.horario_saida}</strong>
            <div class="linha-icone">
              <span>${voo.origem} → ${voo.destino}</span>
              <img src="./img/localizacao.png" class="icon" />
            </div>
          </div>
          <div class="trecho duracao">
            <div class="linha-icone">
              <strong>${voo.duracao}</strong>
              <img src="./img/relogio.png" class="icon" />
            </div>
            <span>Direto</span>
          </div>
          <div class="trecho">
            <strong>${voo.horario_chegada}</strong>
            <div class="linha-icone">
              <span>${voo.destino}</span>
              <img src="./img/localizacao.png" class="icon" />
            </div>
          </div>
        </div>

        <div class="acao">
          <div class="preco">R$ ${voo.preco}<small> por pessoa</small></div>
          <button class="selecionar">Selecionar</button>
        </div>
      `;
      listaVoos.appendChild(div);
    });

  } catch (erro) {
    listaVoos.innerHTML = `<p style="color: red;">Erro: ${erro.message}</p>`;
  }
}
