/**
 * Renderer responsável por manipular o DOM do MessageModal
 */
export const MessageModalRenderer = {
	render(config, onClose) {
			// Busca o template no index.html
		const template = document.getElementById('template-message-modal');
		if (!template) {
				console.error("Template 'template-message-modal' não encontrado no DOM.");
				return null;
		}

		const clone = template.content.cloneNode(true);
		const overlay = clone.querySelector('.message-modal-overlay');
		const modal = clone.querySelector('.message-modal');
		const iconContainer = clone.querySelector('.message-modal-icon');
		const titleEl = clone.querySelector('.message-modal-title');
		const textEl = clone.querySelector('.message-modal-text');
		const btn = clone.querySelector('.message-modal-btn');

		// Define o tipo visual (success, error, info)
		modal.classList.add(config.type || 'info');

		// Define Ícone Lucide
		const iconName = {
				success: 'check-circle',
				error: 'alert-circle',
				info: 'info'
		}[config.type] || 'info';

		iconContainer.innerHTML = `<i data-lucide="${iconName}" style="width: 40px; height: 40px;"></i>`;
		
		// Define Textos
		titleEl.textContent = config.title;
		textEl.textContent = config.message;

		// Evento de Fechar
		btn.onclick = () => onClose();
		overlay.onclick = (e) => {
				if (e.target === overlay) onClose();
		};

		return overlay;
	}
};