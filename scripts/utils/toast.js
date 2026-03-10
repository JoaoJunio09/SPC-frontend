export const Toast = {
	showToast({ 
		message, 
		type = 'info',
		duration = 5000, 
		icon = null 
	}) {
		const container = document.getElementById('toast-container');

		const types = {
				success: {
						className: 'toast-success',
						defaultIcon: 'check-circle'
				},
				error: {
						className: 'toast-error',
						defaultIcon: 'alert-circle'
				},
				info: {
						className: 'toast-info',
						defaultIcon: 'info'
				}
		};

		const config = types[type] || types.info;
		const toastId = 'toast-' + Math.random().toString(36).substr(2, 9);
		const selectedIcon = icon || config.defaultIcon;

		// Criação do elemento
		const toast = document.createElement('div');
		toast.id = toastId;
		// Classes CSS semânticas substituindo Tailwind
		toast.className = `toast toast-enter ${config.className}`;
		
		toast.innerHTML = `
				<div class="toast-content">
						<i data-lucide="${selectedIcon}" class="toast-icon"></i>
						<p class="toast-message">${message}</p>
				</div>
				<button class="toast-close" data-close aria-label="Fechar">
						<i data-lucide="x" style="width: 1rem; height: 1rem;"></i>
				</button>
				<div class="toast-progress-bar" style="animation-duration: ${duration}ms;"></div>
		`;

		container.appendChild(toast);

		const closeButton = toast.querySelector('[data-close]');
		closeButton.addEventListener('click', () => this.closeToast(toastId));
		
		// Inicializa ícones Lucide
		if (window.lucide) {
				lucide.createIcons({
						attrs: { class: 'lucide' },
						nameAttr: 'data-lucide',
						root: toast
				});
		}

		// Auto-fechamento
		const timeout = setTimeout(() => {
				this.closeToast(toastId);
		}, duration);

		toast.dataset.timeoutId = timeout;
	},

	closeToast(id) {
		const toast = document.getElementById(id);
		if (!toast) return;

		clearTimeout(toast.dataset.timeoutId);
		toast.classList.replace('toast-enter', 'toast-exit');
		
		toast.addEventListener('animationend', (e) => {
				// Verifica se a animação que terminou foi a de saída
				if (e.animationName === 'toast-out') {
						toast.remove();
				}
		});
	}
};

window.onload = () => {
	if (window.lucide) lucide.createIcons();
};