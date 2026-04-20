import { formatStep } from "../../utils/format_step.js";

export function rendererCardSteps(steps, listSteps) {
	const template = document.getElementById("card-steps-template");
	
	steps.forEach(step => {
		const frag = template.content.cloneNode(true);
		const card = frag.querySelector(".card");
		const container = card.querySelector(".catechists-container");

		if (step.catechists.length > 0) {
			const catechists = step.catechists.filter(catechist => catechist.firstName);
			card.setAttribute('data-catechists', JSON.stringify(catechists));

			catechists.forEach(catechist => {
				const strong = document.createElement('strong');
				strong.textContent =  `${catechist.firstName} ${catechist.lastName}`;
				
				container.appendChild(strong);
				container.appendChild(document.createElement('br'));
			});
		}
		
		card.setAttribute('data-step', step.etapa);
		card.querySelector("#step").textContent = formatStep(step.etapa);

		listSteps.appendChild(card);
	});
}