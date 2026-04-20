import { arrays } from "../../../controllers/presence/register/register_presence_controller.js";
import { formatStep } from "../../../utils/format_step.js";

const isSearch = {
	is: null,
	content: null
};

export function rendererCardCatechumens(catechumens, container, isSearch) {
	container.innerHTML = '';
	isSearch.is
		? document.getElementById('tituloListagem').innerText = `Resultados para: ${isSearch.content}`
		: document.getElementById('tituloListagem').innerText = `Catequizandos: ${formatStep(catechumens[0]?.step.stepName)}`;
	
	document.getElementById('attendanceSection').style.display = 'block';

	const template = document.getElementById('card-catechumens-template');

	catechumens.forEach(catechumen => {
		const frag = template.content.cloneNode(true);
		const card = frag.querySelector(".catequizando-card");

		let stepAndCatechistName = formatStep(catechumen.step.stepName) + "<br>";

		const catechists = catechumen.step.catechists;
		if (catechists.length > 0) {
			for (let i = 0; i < catechists.length; i++) {
				catechists.length - i == 1
					? stepAndCatechistName += catechists[i].firstName+" "+catechists[i].lastName
					: stepAndCatechistName += catechists[i].firstName+" "+catechists[i].lastName + "<br>";
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
	const isBlock = catechumensAlreadyPresent.some(catechumenPresent => catechumenPresent.catechumen.id === catechumen.id);

	if (isBlock === true) {
		card.querySelector(".presente").classList.add('active');
		card.querySelector(".btn-mark-absence").disabled = true;
		card.querySelector(".btn-mark-presence").disabled = true;
	}
}