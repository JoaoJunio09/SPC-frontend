import { confirmModal } from '../../../utils/confirmation.js';
import { rendererCardCatechumensConfirm } from "../../../renderers/presence/confirm/card_catechumens_confirm_renderer.js";
import { loadTemplate } from "../../../utils/template_loader.js";
import { MessageModal } from '../../../utils/modal_message.js';
import { PresenceService } from '../../../services/presence_service.js';
import { arrays } from '../register/register_presence_controller.js';
import { Exceptions } from '../../../exceptions/exceptions.js';

const arraysConfirm = {
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
	arraysConfirm.catechumensPresent = JSON.parse(sessionStorage.getItem('catechumensPresent'));

	if (arraysConfirm.catechumensPresent.length === 0) {
		document.getElementById('reviewList').style.display = 'block';
    document.getElementById('emptyState').disabled = true;
    document.getElementById('btnSubmit').style.opacity = '0.5';
	}
	else {
		rendererCardCatechumensConfirm(arraysConfirm.catechumensPresent, dom.containerListCatechumens);
	}
}

export async function confirmPresence() {
	const confirmed = await confirmModal(
		`Deseja confirmar o registro de presença para os ${arraysConfirm.catechumensPresent.length} catequizandos listados?`
	);

	if (!confirmed) return;

	try {
		const catechist = JSON.parse(sessionStorage.getItem('catechist'));

		const requests = arraysConfirm.catechumensPresent.map(async catechumenPresent => {
			const presence = {
				catechistId: catechist.id,
				catechumenId: catechumenPresent.id,
				massId: sessionStorage.getItem('massId'),
				status: 'PRESENTE',
				justification: null
			};
			
			await PresenceService.create(presence);
		});

		await Promise.all(requests);
		PresenceService.clearCache();

		MessageModal.show({ 
			type: 'success', 
			title: 'Sucesso', 
			message: 'Presenças foram registradas com sucesso'
		});

		sessionStorage.removeItem("catechumensPresent");
		arraysConfirm.catechumensPresent = [];
		arrays.catechumensWithBlockAbsenceButton = [];

		setTimeout(() => {
			window.location.href = "index.html";
		}, 4500);
	}
	catch (err) {
		if (err instanceof Exceptions.ConflictWhenSavingInTheDatabaseException) {
			PresenceService.clearCache();
			MessageModal.show({ 
				type: 'info', 
				title: 'Aviso', 
				message: 'Você marcou 1 ou mais catequizandos que já estavam com presença, no entanto não houve nenhuma falha ao registrar presença dos demais.'
			});

			sessionStorage.removeItem("catechumensPresent");
			arraysConfirm.catechumensPresent = [];
			arrays.catechumensWithBlockAbsenceButton = [];

			setTimeout(() => {
				window.location.href = "index.html";
			}, 6500);
		} 
		else {
			console.log(err)
			MessageModal.show({ 
				type: 'error', 
				title: 'Falha na conexão', 
				message: 'Não foi possível registrar presença dos catequizandos'
			});
		}
	}
}