import { rendererLoading } from "../renderers/loading_renderer.js";

function showLoading() {
	const modal = rendererLoading();
	if (modal) {
			modal.style.display = 'flex';
			// Impede o scroll do fundo enquanto carrega
			document.body.style.overflow = 'hidden';
	}
}

function hideLoading() {
	const modal = document.getElementById('loadingModal');
	if (modal) {
			modal.style.display = 'none';
			// Restaura o scroll do fundo
			document.body.style.overflow = 'auto';
	}
}
export const Loading = {
	showLoading,
	hideLoading
};