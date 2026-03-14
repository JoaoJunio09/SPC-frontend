import { MessageModalRenderer } from '../renderers/modal_message_renderer.js';

/**
 * Utilitário MessageModal para o sistema SPC
 * Exibe mensagens de feedback importantes (Sucesso, Erro, Info)
 */
export const MessageModal = {
    _currentModal: null,
    _handleEsc: null,

    /**
     * Mostra o modal de mensagem
     * @param {Object} config { type, title, message }
     */
    show(config) {
        // Se já houver um aberto, remove
        if (this._currentModal) this.close();

        const overlay = MessageModalRenderer.render(config, () => this.close());
        if (!overlay) return;

        document.body.appendChild(overlay);
        this._currentModal = overlay;

        // Inicializa ícones Lucide inseridos dinamicamente
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Animação de entrada
        requestAnimationFrame(() => {
            overlay.classList.add('active');
            // Foco automático no botão para acessibilidade
            const btn = overlay.querySelector('.message-modal-btn');
            if (btn) btn.focus();
        });

        // Handler para o ESC
        this._handleEsc = (e) => {
            if (e.key === 'Escape') this.close();
        };
        document.addEventListener('keydown', this._handleEsc);
    },

    /**
     * Fecha o modal e limpa o DOM
     */
    close() {
        if (!this._currentModal) return;

        const overlay = this._currentModal;
        overlay.classList.remove('active');

        // Remove listener de teclado
        document.removeEventListener('keydown', this._handleEsc);

        // Remove do DOM após a transição de CSS
        overlay.addEventListener('transitionend', () => {
            overlay.remove();
        }, { once: true });

        this._currentModal = null;
    }
};