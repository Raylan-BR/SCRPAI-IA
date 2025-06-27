document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const vooId = urlParams.get('voo_id');
    
    if (!vooId) {
        window.location.href = '/index.html';
        return;
    }

    // Verificar autenticação do usuário
    const usuario = JSON.parse(localStorage.getItem('usuario')) || { 
        email: 'anonimo@example.com',
        name: 'Visitante'
    };

    // Elementos da UI
    const formReserva = document.querySelector('.form-reserva');
    const btnProsseguir = formReserva.querySelector('button[type="submit"]');
    btnProsseguir.textContent = 'Prosseguir para Pagamento';
    
    try {
        // 1. Carregar detalhes do voo
        const response = await fetch(`/detalhes-voo/${vooId}`);
        const voo = await response.json();
        
        if (!response.ok) {
            throw new Error(voo.error || 'Erro ao carregar voo');
        }
        
        // 2. Atualizar interface com os dados do voo
        document.querySelector('.dados-voo').innerHTML = `
            <h3>${voo.companhia} - ${voo.aeronave}</h3>
            <p><strong>Origem:</strong> ${voo.origem}</p>
            <p><strong>Destino:</strong> ${voo.destino}</p>
            <p><strong>Data:</strong> ${formatarData(voo.data_partida)}</p>
            <p><strong>Horário:</strong> ${voo.hora_partida} - ${voo.hora_chegada} (${voo.duracao})</p>
            <p><strong>Preço base:</strong> R$ ${voo.preco_base.toFixed(2)}</p>
        `;
        
        // 3. Renderizar assentos
        renderizarAssentos(voo.mapa_assentos);
        
        // 4. Renderizar opções de bagagem
        const selectBagagem = document.getElementById('bagagem');
        voo.bagagens.forEach(bagagem => {
            const option = document.createElement('option');
            option.value = bagagem.tipo;
            option.textContent = `${bagagem.tipo} ${bagagem.preco > 0 ? `(+R$ ${bagagem.preco.toFixed(2)})` : ''}`;
            selectBagagem.appendChild(option);
        });
        
        // 5. Configurar envio do formulário
        formReserva.addEventListener('submit', async (e) => {
            e.preventDefault();
            btnProsseguir.disabled = true;
            btnProsseguir.innerHTML = '<span class="spinner"></span> Processando...';
            
            try {
                const assentosSelecionados = Array.from(document.querySelectorAll('.assento.selecionado'))
                    .map(assento => assento.dataset.numero);
                    
                const bagagem = document.getElementById('bagagem').value;
                
                if (assentosSelecionados.length === 0) {
                    throw new Error('Selecione pelo menos um assento');
                }
                
                if (!bagagem) {
                    throw new Error('Selecione uma opção de bagagem');
                }
                
                // Criar reserva no backend
                const response = await fetch('/criar-reserva', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        voo_id: vooId,
                        assentos: assentosSelecionados,
                        bagagem: bagagem,
                        usuario_email: usuario.email
                    })
                });
                
                const resultado = await response.json();
                
                if (!response.ok) {
                    throw new Error(resultado.error || 'Erro ao criar reserva');
                }
                
                // Redirecionar para pagamento com todos os dados necessários
                const params = new URLSearchParams({
                    reserva_id: resultado.reserva_id,
                    preco_total: resultado.preco_total,
                    origem: resultado.detalhes.origem,
                    destino: resultado.detalhes.destino,
                    data: resultado.detalhes.data,
                    hora: resultado.detalhes.hora,
                    assentos: resultado.detalhes.assentos.join(','),
                    bagagem: encodeURIComponent(resultado.detalhes.bagagem),
                    companhia: resultado.detalhes.companhia
                });
                
                window.location.href = `/pagamento.html?${params.toString()}`;
                
            } catch (error) {
                console.error('Erro:', error);
                alert(`Erro: ${error.message}`);
                btnProsseguir.disabled = false;
                btnProsseguir.textContent = 'Prosseguir para Pagamento';
            }
        });
        
    } catch (error) {
        console.error('Erro:', error);
        alert(`Erro ao carregar voo: ${error.message}`);
        window.location.href = '/';
    }
});

function renderizarAssentos(mapaAssentos) {
    const container = document.querySelector('.mapa-assentos');
    container.innerHTML = '<h3>Selecione seus assentos:</h3>';
    
    // Organizar por fileira
    const assentosPorFileira = {};
    mapaAssentos.forEach(assento => {
        const fileira = assento.numero.match(/^\d+/)[0];
        if (!assentosPorFileira[fileira]) {
            assentosPorFileira[fileira] = [];
        }
        assentosPorFileira[fileira].push(assento);
    });
    
    // Renderizar cada fileira
    Object.keys(assentosPorFileira).sort((a, b) => a - b).forEach(fileira => {
        const fileiraDiv = document.createElement('div');
        fileiraDiv.className = 'fileira-assentos';
        fileiraDiv.innerHTML = `<span class="numero-fileira">${fileira}</span>`;
        
        // Ordenar assentos: A, B, corredor, C, D, E, F
        const assentosOrdenados = assentosPorFileira[fileira].sort((a, b) => {
            const ordem = {'A': 0, 'B': 1, 'C': 3, 'D': 4, 'E': 5, 'F': 6};
            return ordem[a.numero.slice(-1)] - ordem[b.numero.slice(-1)];
        });
        
        assentosOrdenados.forEach(assento => {
            const assentoDiv = document.createElement('div');
            assentoDiv.className = `assento ${assento.disponivel ? 'disponivel' : 'ocupado'}`;
            assentoDiv.textContent = assento.numero.slice(-1); // Mostra apenas a letra
            assentoDiv.title = assento.numero;
            assentoDiv.dataset.numero = assento.numero;
            
            if (assento.disponivel) {
                assentoDiv.addEventListener('click', () => {
                    assentoDiv.classList.toggle('selecionado');
                    atualizarResumo();
                });
            }
            
            fileiraDiv.appendChild(assentoDiv);
            
            // Adicionar corredor após o assento B
            if (assento.numero.endsWith('B')) {
                const corredor = document.createElement('div');
                corredor.className = 'corredor';
                corredor.textContent = '↔';
                fileiraDiv.appendChild(corredor);
            }
        });
        
        container.appendChild(fileiraDiv);
    });
    
    // Adicionar legenda
    const legenda = document.createElement('div');
    legenda.className = 'legenda-assentos';
    legenda.innerHTML = `
        <div><span class="assento-legenda disponivel"></span> Disponível</div>
        <div><span class="assento-legenda selecionado"></span> Selecionado</div>
        <div><span class="assento-legenda ocupado"></span> Ocupado</div>
    `;
    container.appendChild(legenda);
}

function atualizarResumo() {
    const assentosSelecionados = Array.from(document.querySelectorAll('.assento.selecionado'))
        .map(assento => assento.dataset.numero);
    
    const resumo = document.getElementById('resumo-reserva');
    if (!resumo) return;
    
    resumo.innerHTML = `
        <h4>Resumo da Reserva</h4>
        <p>Assentos: ${assentosSelecionados.join(', ')}</p>
    `;
}

function formatarData(dataString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
}