import { confirmPresence, dom, init } from "./confirm_presence_controller.js";

document.addEventListener('DOMContentLoaded',  init);

dom.reviewAction.addEventListener('click', async (e) => {
	const btnBack = e.target.closest('.btn-back');
	const btnConfirm = e.target.closest('.btn-confirm-submit');

	if (btnBack) {
		window.location.href = "registrarPresenca.html";
	}

	if (btnConfirm) {
		await confirmPresence();
	}
});