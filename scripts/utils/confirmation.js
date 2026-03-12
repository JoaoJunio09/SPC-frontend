export function confirmModal(message) {
	return new Promise((resolve) => {
		// 1. Criação dos elementos
		const overlay = document.createElement('div');
		overlay.className = 'confirm-modal-overlay';
		
		const modalBox = document.createElement('div');
		modalBox.className = 'confirm-modal-box';
		
		// 2. Estrutura interna (HTML Dinâmico)
		modalBox.innerHTML = `
			<div class="confirm-modal-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
			</div>
			<p class="confirm-modal-message">${message}</p>
			<div class="confirm-modal-actions">
					<button class="confirm-btn confirm-btn-cancel" id="confirm-cancel">Cancelar</button>
					<button class="confirm-btn confirm-btn-confirm" id="confirm-ok">Confirmar</button>
			</div>
		`;
		
		overlay.appendChild(modalBox);
		document.body.appendChild(overlay);

		// 3. Forçar reflow para disparar animação de entrada
		requestAnimationFrame(() => {
			overlay.classList.add('active');
		});

		// 4. Função para fechar e limpar o DOM
		const close = (result) => {
			overlay.classList.remove('active');
			
			// Aguarda o fim da animação de saída antes de remover do DOM
			overlay.addEventListener('transitionend', () => {
				overlay.remove();
				resolve(result);
			}, { once: true });
		};

		// 5. Event Listeners
		const btnCancel = modalBox.querySelector('#confirm-cancel');
		const btnOk = modalBox.querySelector('#confirm-ok');

		btnCancel.onclick = () => close(false);
		btnOk.onclick = () => close(true);

		// Fechar ao clicar no overlay (fora do box)
		overlay.onclick = (e) => {
			if (e.target === overlay) close(false);
		};

		// Suporte para tecla ESC
		const handleEsc = (e) => {
			if (e.key === 'Escape') {
				document.removeEventListener('keydown', handleEsc);
				close(false);
			}
		};
		document.addEventListener('keydown', handleEsc);
	});
}