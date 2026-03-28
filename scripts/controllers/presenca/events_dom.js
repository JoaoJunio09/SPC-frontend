import { dom, init, handleListCatechumens} from "./register_presence_controller.js";

document.addEventListener('DOMContentLoaded', init);

dom.toogleAccordion.addEventListener('click', () => {
	const content = document.getElementById('accordionContent');
  content.classList.toggle('open');
});

dom.containerListStep.addEventListener('click', (e) => {
	const btnListCatechumens = e.target.closest('.btn-list-students');

	if (btnListCatechumens) {
		const card = btnListCatechumens.closest('#card-step');
		const stepId = card.dataset.id;

		handleListCatechumens(stepId);
	}
});