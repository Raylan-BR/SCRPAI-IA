document.addEventListener('DOMContentLoaded', () => {
    // 1. Obter elementos do DOM
    const formReserva = document.querySelector('.form-reserva');
    const btnProsseguir = formReserva.querySelector('button[type="submit"]');
    const dadosVooDiv = document.querySelector('.dados-voo');
    const loadingDiv = dadosVooDiv.querySelector('.loading');
    const mapaAssentos = document.querySelector('.mapa-assentos');
    const loadingAssentos = mapaAssentos.querySelector('.loading-assentos');
    const selectBagagem = document.getElementById('bagagem');

    // 2. Obter dados do usuário e voo selecionado
    const usuario = JSON.parse(localStorage.getItem('usuario')) || { 
        email: 'anonimo@example.com',
        name: 'Visitante'
    };
    const voo = JSON.parse(localStorage.getItem('voo_selecionado'));

    // 3. Verificar se há voo selecionado
    if (!voo) {
        loadingDiv.innerHTML = `
            <div class="aviso-sem-voo">
                <p><strong>Nenhum voo foi selecionado.</strong></p>
                <p>Por favor, retorne à página anterior e selecione um voo para continuar com a reserva.</p>
            </div>
        `;
        formReserva.style.display = 'none';
        return;
    }

    // 4. Exibir dados do voo
    loadingDiv.remove();
    dadosVooDiv.innerHTML = `
        <h3>${voo.companhia} - ${voo.aeronave}</h3>
        <p><strong>Origem:</strong> ${voo.origem}</p>
        <p><strong>Destino:</strong> ${voo.destino}</p>
        <p><strong>Partida:</strong> ${voo.partida}</p>
        <p><strong>Chegada:</strong> ${voo.chegada}</p>
        <p><strong>Duração:</strong> ${voo.duracao}</p>
        <p><strong>Preço:</strong> R$ ${voo.preco.toFixed(2)}</p>
    `;

    // 5. Configurar mapa de assentos
    loadingAssentos.remove();
    mapaAssentos.innerHTML = `
        <div class="legenda">
            <span><span class="assento-legenda disponivel"></span> Disponível</span>
            <span><span class="assento-legenda ocupado"></span> Ocupado</span>
            <span><span class="assento-legenda selecionado"></span> Selecionado</span>
        </div>
    `;

    // Gerar assentos (6 fileiras de A-F)
    for (let fileira = 1; fileira <= 10; fileira++) {
        const fileiraDiv = document.createElement('div');
        fileiraDiv.className = 'fileira-assentos';
        
        const numeroFileira = document.createElement('div');
        numeroFileira.className = 'numero-fileira';
        numeroFileira.textContent = fileira;
        fileiraDiv.appendChild(numeroFileira);

        ['A', 'B', 'C', 'D', 'E', 'F'].forEach((letra, index) => {
            // Adicionar corredor após a letra C
            if (index === 3) {
                const corredor = document.createElement('div');
                corredor.className = 'corredor';
                corredor.textContent = '|';
                fileiraDiv.appendChild(corredor);
            }

            const assento = document.createElement('div');
            assento.className = 'assento';
            assento.dataset.numero = `${fileira}${letra}`;
            assento.textContent = `${fileira}${letra}`;

            // 70% de chance de estar disponível
            if (Math.random() > 0.3) {
                assento.classList.add('disponivel');
                assento.addEventListener('click', () => {
                    assento.classList.toggle('selecionado');
                    atualizarResumo();
                });
            } else {
                assento.classList.add('ocupado');
            }

            fileiraDiv.appendChild(assento);
        });

        mapaAssentos.appendChild(fileiraDiv);
    }

    // 6. Configurar opções de bagagem
    selectBagagem.innerHTML = '';
    const opcoesBagagem = [
        { tipo: 'Bagagem de mão (gratuita)', preco: 0 },
        { tipo: 'Bagagem despachada (23kg)', preco: 100 },
        { tipo: 'Bagagem extra (32kg)', preco: 180 }
    ];
    
    opcoesBagagem.forEach(bagagem => {
        const option = document.createElement('option');
        option.value = bagagem.tipo;
        option.textContent = `${bagagem.tipo} ${bagagem.preco > 0 ? `(+R$ ${bagagem.preco.toFixed(2)})` : ''}`;
        selectBagagem.appendChild(option);
    });

    selectBagagem.addEventListener('change', atualizarResumo);
    selectBagagem.disabled = false;
    btnProsseguir.disabled = false;

    // 7. Função para atualizar resumo
    function atualizarResumo() {
        const assentosSelecionados = Array.from(document.querySelectorAll('.assento.selecionado'))
            .map(assento => assento.dataset.numero);
        const bagagem = selectBagagem.value;
        const resumoDiv = document.getElementById('resumo-reserva');
        
        if (assentosSelecionados.length > 0 || bagagem) {
            resumoDiv.style.display = 'block';
            resumoDiv.innerHTML = `
                <h4>Resumo da Reserva</h4>
                <p><strong>Assentos:</strong> ${assentosSelecionados.join(', ') || 'Nenhum selecionado'}</p>
                <p><strong>Bagagem:</strong> ${bagagem || 'Não selecionada'}</p>
                <p><strong>Total:</strong> R$ ${voo.preco.toFixed(2)}</p>
            `;
        } else {
            resumoDiv.style.display = 'none';
        }
    }

    // 8. Configurar envio do formulário
    formReserva.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const assentosSelecionados = Array.from(document.querySelectorAll('.assento.selecionado'))
            .map(assento => assento.dataset.numero);
        const bagagem = selectBagagem.value;

        if (assentosSelecionados.length === 0) {
            alert('Selecione pelo menos um assento');
            return;
        }

        // Criar objeto de reserva
        const reserva = {
            id: Date.now().toString(),
            voo: voo,
            assentos: assentosSelecionados,
            bagagem: bagagem,
            usuario_email: usuario.email,
            data_reserva: new Date().toISOString(),
            status: 'pendente'
        };

        // Salvar reserva no LocalStorage
        const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        reservas.push(reserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));

        // Redirecionar para pagamento
        window.location.href = `pagamento.html?reserva_id=${reserva.id}`;
    });
});

// Função para selecionar a classe
  function selecionarClasse(elemento) {
    // Remove a classe 'selecionada' de todas as opções
    document.querySelectorAll('.classe-option').forEach(opt => {
      opt.classList.remove('selecionada');
    });
    
    // Adiciona a classe 'selecionada' à opção clicada
    elemento.classList.add('selecionada');
    
    // Atualiza o campo hidden com o valor selecionado
    document.getElementById('classe-selecionada').value = elemento.getAttribute('data-classe');
    
    // Aqui você pode adicionar lógica para atualizar o preço total, etc.
    console.log('Classe selecionada:', elemento.getAttribute('data-classe'));
  }
