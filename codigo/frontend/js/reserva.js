document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const vooId = urlParams.get('voo_id');

    // Verificar autenticação do usuário
    const usuario = JSON.parse(localStorage.getItem('usuario')) || { 
        email: 'anonimo@example.com',
        name: 'Visitante'
    };

    const formReserva = document.querySelector('.form-reserva');
    const btnProsseguir = formReserva.querySelector('button[type="submit"]');
    btnProsseguir.textContent = 'Prosseguir para Pagamento';

    if (!vooId) {
        document.querySelector('.dados-voo').innerHTML = `
            <div class="aviso-sem-voo">
                <p><strong>Nenhum voo foi selecionado.</strong></p>
                <p>Por favor, retorne à página anterior e selecione um voo para continuar com a reserva.</p>
            </div>
        `;
        formReserva.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`/detalhes-voo/${vooId}`);
        const voo = await response.json();

        if (!response.ok) {
            throw new Error(voo.error || 'Erro ao carregar voo');
        }

        // Preencher os dados do voo
        document.querySelector('.dados-voo').innerHTML = `
            <h3>${voo.companhia} - ${voo.aeronave}</h3>
            <p><strong>Origem:</strong> ${voo.origem}</p>
            <p><strong>Destino:</strong> ${voo.destino}</p>
            <p><strong>Data:</strong> ${formatarData(voo.data_partida)}</p>
            <p><strong>Horário:</strong> ${voo.hora_partida} - ${voo.hora_chegada} (${voo.duracao})</p>
            <p><strong>Preço base:</strong> R$ ${voo.preco_base.toFixed(2)}</p>
        `;

        renderizarAssentos(voo.mapa_assentos);

        // Preencher bagagens
        const selectBagagem = document.getElementById('bagagem');
        voo.bagagens.forEach(bagagem => {
            const option = document.createElement('option');
            option.value = bagagem.tipo;
            option.textContent = `${bagagem.tipo} ${bagagem.preco > 0 ? `(+R$ ${bagagem.preco.toFixed(2)})` : ''}`;
            selectBagagem.appendChild(option);
        });

        selectBagagem.disabled = false;
        btnProsseguir.disabled = false;

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

                const response = await fetch('/criar-reserva', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
        formReserva.style.display = 'none';
    }
});
