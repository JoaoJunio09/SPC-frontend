import { formatStep } from "../../utils/format_step.js";
import { rendererCardCatechumen } from "./card_catechumens_renderer.js";

export function rendererCardViewCatechumens(catechumens, step) {
	const template = document.getElementById("card-view-catechumens-template");
	const frag = template.content.cloneNode(true);
	const modal = frag.querySelector(".modal-overlay");
	const list = modal.querySelector("#list-catechumens");

	modal.addEventListener('click', (e) => {
		if (e.target.id === "btn-cancel") closeModal(modal);
	});

	openModal(modal, step);

	rendererCardCatechumen(list, catechumens)
		
	document.body.appendChild(modal);
}

function openModal(modal, step) {
	modal.style.display = 'flex';
	modal.querySelector('#view-steps-title').innerText = `Catequizandos: ${formatStep(step)}`;
}

function closeModal(modal) {
	modal.style.display = 'none';
}