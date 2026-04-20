import { formatStep } from "../../../utils/format_step.js";

export function rendererCardCatechumensConfirm(catechumens, container) {
	const template = document.getElementById('card-catechumens-confirm-template');

	catechumens.forEach(catechumen => {
		const frag = template.content.cloneNode(true);
		const card = frag.querySelector('.review-card');

		let stepAndCatechistName = formatStep(catechumen.step.stepName) + " • ";

		const catechists = catechumen.step.catechists;
		if (catechists.length > 0) {
			
			for (let i = 0; i < catechists.length; i++) {
				catechists.length - i == 1
					? stepAndCatechistName += catechists[i].firstName+" "+catechists[i].lastName
					: stepAndCatechistName += "<br>" + catechists[i].firstName+" "+catechists[i].lastName + "<br>";
			}
		}
	
		card.querySelector('#catechumen-name').textContent = catechumen.firstName+" "+catechumen.lastName;
		card.querySelector('#step-and-catechists-name').innerHTML = stepAndCatechistName;

		container.appendChild(card);
	});
}