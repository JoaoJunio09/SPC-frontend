import { arrays } from "../../../controllers/presenca/register/register_presence_controller.js";
import { formatStep } from "../../../utils/format_step.js";

export function rendererCardCatechumens(catechumens, container) {
	container.innerHTML = '';
	document.getElementById('tituloListagem').innerText = `Catequizandos: ${formatStep(catechumens[0]?.etapa.etapa)}`;
	document.getElementById('attendanceSection').style.display = 'block';

	const template = document.getElementById('card-catechumens-template');

	catechumens.forEach(catechumen => {
		const frag = template.content.cloneNode(true);
		const card = frag.querySelector(".catequizando-card");

		let stepAndCatechistName = formatStep(catechumen.etapa.etapa) + "<br>";

		if (catechumen.etapa.catequistas.length > 0) {
			for (let i = 0; i < catechumen.etapa.catequistas.length; i++) {
				catechumen.etapa.catequistas.length - i == 1
					? stepAndCatechistName += catechumen.etapa.catequistas[i].firstName+" "+catechumen.etapa.catequistas[i].lastName
					: stepAndCatechistName += catechumen.etapa.catequistas[i].firstName+" "+catechumen.etapa.catequistas[i].lastName + "<br>";
			}
		}

		isPresent(arrays.catechumensPresent, card, catechumen);
		blocksAbsenceButton(arrays.catechumensWithBlockAbsenceButton, card, catechumen);

		card.querySelector("#catechumen-name").textContent = catechumen.firstName+" "+catechumen.lastName;
		card.querySelector("#step-and-catechist-name").innerHTML = stepAndCatechistName;
		
		card.dataset.catechumen = JSON.stringify(catechumen);

		container.appendChild(card)
	});
}

function isPresent(catechumensPresent, card, catechumen) {
	const isPresent = catechumensPresent.some(catechumenPresent => catechumenPresent.id === catechumen.id);

	isPresent
		? card.querySelector(".presente").classList.add('active') 
		: card.querySelector(".ausente").classList.add('active');
}

function blocksAbsenceButton(catechumensAlreadyPresent, card, catechumen) {
	const isBlock = catechumensAlreadyPresent.some(catechumenPresent => catechumenPresent.id === catechumen.id);

	if (isBlock) {
		card.querySelector(".presente").classList.add('active');
		card.querySelector(".btn-mark-absence").disabled = true;
		card.querySelector(".btn-mark-presence").disabled = true;
	}
}