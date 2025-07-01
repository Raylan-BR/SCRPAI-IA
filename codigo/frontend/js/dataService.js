/**
 * @file dataService.js
 * @brief Serviço de persistência de dados no localStorage para o sistema de reservas de voos
 * @description Gerencia todas as operações CRUD relacionadas a voos e reservas usando localStorage
 * @author KAUAN GUILHERME ALVES PINHEIRO SANTOS <kauan.santos@discente.ufma.br>
 */

/**
 * @class DataService
 * @brief Classe utilitária para operações de persistência no localStorage
 * @description Fornece métodos estáticos para gerenciamento de dados de voos e reservas,
 * incluindo operações de criação, leitura, atualização, exportação e importação de dados.
 * @static
 */
class DataService {
    /**
     * @method getVoosDisponiveis
     * @static
     * @brief Recupera os voos disponíveis armazenados
     * @description Obtém do localStorage a lista completa de voos de ida e volta disponíveis
     * @return {Object} Retorna um objeto contendo dois arrays: {voosIda: Array<Voo>, voosVolta: Array<Voo>}
     * @example
     * const voos = DataService.getVoosDisponiveis();
     * console.log(voos.voosIda); // Lista de voos de ida
     */
    static getVoosDisponiveis() {
        return JSON.parse(localStorage.getItem('voos_disponiveis')) || { voosIda: [], voosVolta: [] };
    }

    /**
     * @method getVooSelecionado
     * @static
     * @brief Recupera o voo selecionado pelo usuário
     * @description Obtém do localStorage os detalhes do voo que o usuário selecionou para reserva
     * @return {Object|null} Retorna o objeto do voo selecionado ou null se não existir
     * @example
     * const voo = DataService.getVooSelecionado();
     * if (voo) { /* prossegue com reserva *\/ }
     */
    static getVooSelecionado() {
        return JSON.parse(localStorage.getItem('voo_selecionado'));
    }

    /**
     * @method salvarReserva
     * @static
     * @brief Armazena uma nova reserva
     * @description Adiciona uma nova reserva ao histórico no localStorage
     * @param {Object} reserva - Objeto contendo todos os dados da reserva
     * @param {string} reserva.id - ID único da reserva
     * @param {string} reserva.usuario_email - Email do usuário que fez a reserva
     * @param {Object} reserva.voo - Dados completos do voo reservado
     * @param {string} reserva.data - Data/hora da reserva
     * @return {Object} Retorna a reserva salva
     * @example
     * const reserva = {
     *   id: '123',
     *   usuario_email: 'cliente@exemplo.com',
     *   voo: { /* dados do voo *\/ },
     *   data: '2023-01-01'
     * };
     * DataService.salvarReserva(reserva);
     */
    static salvarReserva(reserva) {
        const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        reservas.push(reserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));
        return reserva;
    }

    /**
     * @method getReservasUsuario
     * @static
     * @brief Recupera reservas de um usuário específico
     * @description Filtra o histórico de reservas pelo email do usuário
     * @param {string} email - Email do usuário para filtrar as reservas
     * @return {Array<Object>} Retorna um array com todas as reservas do usuário
     * @example
     * const minhasReservas = DataService.getReservasUsuario('meu@email.com');
     */
    static getReservasUsuario(email) {
        const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        return reservas.filter(r => r.usuario_email === email);
    }

    /**
     * @method exportarDados
     * @static
     * @brief Exporta todos os dados armazenados
     * @description Cria um snapshot completo de todos os dados no localStorage
     * @return {Object} Retorna objeto contendo: {voos_disponiveis: Object, reservas: Array}
     * @example
     * const backup = DataService.exportarDados();
     * // Pode ser salvo em arquivo ou enviado para servidor
     */
    static exportarDados() {
        return {
            voos_disponiveis: this.getVoosDisponiveis(),
            reservas: JSON.parse(localStorage.getItem('reservas')) || []
        };
    }

    /**
     * @method importarDados
     * @static
     * @brief Importa dados para o localStorage
     * @description Carrega dados previamente exportados para o localStorage
     * @param {Object} dados - Dados no formato {voos_disponiveis: Object, reservas: Array}
     * @throws {Error} Pode lançar erro se os dados estiverem em formato inválido
     * @example
     * // Recuperando de um backup
     * DataService.importarDados(backupData);
     */
    static importarDados(dados) {
        localStorage.setItem('voos_disponiveis', JSON.stringify(dados.voos_disponiveis));
        localStorage.setItem('reservas', JSON.stringify(dados.reservas));
    }
}