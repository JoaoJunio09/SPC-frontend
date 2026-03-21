import { formatStep } from "../../utils/format_step.js";

export function rendererCardCatechists(catechists, listCatechists) {
	const template = document.getElementById("card-catechists-template");
	
	catechists.forEach(catechist => {
		const frag = template.content.cloneNode(true);
		const card = frag.querySelector(".card");

		card.setAttribute('data-id', catechist.id);

		card.querySelector("#firstName").textContent = catechist.firstName;

		catechist.stepOfCatechistResponseDTO.id === null
			? card.querySelector(".tag-step").innerHTML = '<strong>Não possui turma</strong>'
			: card.querySelector(".tag-step").innerHTML = `<strong>${formatStep(catechist.stepOfCatechistResponseDTO.stepEnum)}</strong>`;

		listCatechists.appendChild(card);
	});
}