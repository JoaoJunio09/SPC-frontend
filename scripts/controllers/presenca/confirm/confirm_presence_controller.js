import { confirmModal } from '../../../utils/confirmation.js';
import { rendererCardCatechumensConfirm } from "../../../renderers/presence/confirm/card_catechumens_confirm_renderer.js";
import { loadTemplate } from "../../../utils/template_loader.js";
import { MessageModal } from '../../../utils/modal_message.js';
import { PresencaService } from '../../../services/presenca_service.js';

const arrays = {
	catechumensPresent: []
};

export const dom = {
	get containerListCatechumens() {return document.querySelector('.review-section')},
	get reviewAction()  {return document.querySelector(".review-actions")}
};

export async function init() {
	await loadTemplate("../../../../templates/presence/confirm/card_catechumens_confirm_template.html");
	await renderCatechumensConfirm();
}

async function renderCatechumensConfirm() {
	arrays.catechumensPresent = JSON.parse(sessionStorage.getItem('catechumensPresent'));

	if (arrays.catechumensPresent.length === 0) {
		document.getElementById('reviewList').style.display = 'block';
    document.getElementById('emptyState').disabled = true;
    document.getElementById('btnSubmit').style.opacity = '0.5';
	}
	else {
		rendererCardCatechumensConfirm(arrays.catechumensPresent, dom.containerListCatechumens);
	}
}

export async function confirmPresence() {
	const confirmed = await confirmModal(`Deseja confirmar o registro de presença para os ${arrays.catechumensPresent.length} catequizandos listados?`);
	if (!confirmed) return;

	try {

		console.log(arrays.catechumensPresent);

		const requests = arrays.catechumensPresent.map(async catechumenPresent => {
			const presence = {
				catequizandoId: catechumenPresent.id,
				missaId: sessionStorage.getItem('missaId'),
				status: 'PRESENTE',
				justification: null
			};
			
			await PresencaService.createPresenca(presence)
		});

		await Promise.all(requests);

		MessageModal.show({ 
			type: 'success', 
			title: 'Sucesso', 
			message: 'Presenças foram registradas com sucesso'
		});

		sessionStorage.removeItem("catechumensPresent");

		setTimeout(() => {
			window.location.href = "index.html";
		}, 4500);
	}
	catch (e) {
		MessageModal.show({ 
			type: 'error', 
			title: 'Falha na conexão', 
			message: 'Não foi possível registrar presença dos catequizandos' 
		});
	}
}