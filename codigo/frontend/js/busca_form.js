const idaBolinha = document.getElementById('ida');
const idaVoltaBolinha = document.getElementById('ida-e-volta');
const dataVoltaDiv = document.getElementById('data-volta-div');

idaBolinha.addEventListener('change', () => {
    dataVoltaDiv.classList.add('escondido');
});

idaVoltaBolinha.addEventListener('change', () => {
    dataVoltaDiv.classList.remove('escondido');
});