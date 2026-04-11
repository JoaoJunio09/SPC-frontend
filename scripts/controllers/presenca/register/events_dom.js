import { Loading } from "../../../utils/loading.js";
import { dom, init, handleListCatechumens, markPresence, markAbsence, arrays, search, proceedReview, checksExistinsPresence} from "./register_presence_controller.js";

document.addEventListener('DOMContentLoaded', init);

dom.toogleAccordion.addEventListener('click', () => {
	if (dom.accordionContent.style.maxHeight && dom.accordionContent.style.maxHeight !== "0px") {
		dom.accordionContent.style.maxHeight = dom.accordionContent.scrollHeight  + "px";
		requestAnimationFrame(() => { dom.accordionContent.style.maxHeight = "0px" });
	} 
	else {
		dom.accordionContent.style.maxHeight = dom.accordionContent.scrollHeight + "px";
	}
});

dom.containerListStep.addEventListener('click', (e) => {
	const btnListCatechumens = e.target.closest('.btn-list-students');

	if (btnListCatechumens) {
		const card = btnListCatechumens.closest('#card-step');
		const stepId = card.dataset.id;

		handleListCatechumens(stepId);
	}
});

dom.containerListCatechumens.addEventListener('click', (e) => {
	const btnMarkPresence = e.target.closest('.btn-mark-presence');
	const btnMarkAbsence = e.target.closest('.btn-mark-absence');
	
	if (btnMarkPresence) {
		const catechumen = e.target.closest('.catechumen-card').dataset.catechumen;
		if (markPresence(catechumen)) {
			dom.countSelected.innerText++;
		}
	}

	if (btnMarkAbsence) {
		const catechumen = e.target.closest('.catechumen-card').dataset.catechumen;
		if (markAbsence(catechumen)) {
			dom.countSelected.innerText--;
		}
	}
});

dom.actionsFooter.addEventListener('click', async (e) => {
	const btnConfirmAndProceedReview = e.target.closest('.btn-confirm-final');
	if (btnConfirmAndProceedReview) await proceedReview();
});

dom.search.addEventListener('input', async (e) => { 
	await checksExistinsPresence();
	await search(e.target.value); 
});

dom.reset.addEventListener('click', () => {
	arrays.catechumensPresent = [];
	sessionStorage.setItem('catechumensPresent', []);
	location.reload();
});