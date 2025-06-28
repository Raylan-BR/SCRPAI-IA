// dataService.js
class DataService {
    static getVoosDisponiveis() {
        return JSON.parse(localStorage.getItem('voos_disponiveis')) || { voosIda: [], voosVolta: [] };
    }

    static getVooSelecionado() {
        return JSON.parse(localStorage.getItem('voo_selecionado'));
    }

    static salvarReserva(reserva) {
        const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        reservas.push(reserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));
        return reserva;
    }

    static getReservasUsuario(email) {
        const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        return reservas.filter(r => r.usuario_email === email);
    }

    // Em dataService.js
    static exportarDados() {
        return {
            voos_disponiveis: this.getVoosDisponiveis(),
            reservas: JSON.parse(localStorage.getItem('reservas')) || []
        };
    }

    static importarDados(dados) {
        localStorage.setItem('voos_disponiveis', JSON.stringify(dados.voos_disponiveis));
        localStorage.setItem('reservas', JSON.stringify(dados.reservas));
    }
}