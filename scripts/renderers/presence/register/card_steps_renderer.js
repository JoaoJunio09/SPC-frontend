import { formatStep } from "../../../utils/format_step.js";

export function rendererCardSteps(steps, container) {
	const template = document.getElementById('card-step-template');
	
	steps.forEach(step => {
		const frag = template.content.cloneNode(true);
		const card = frag.querySelector("#card-step");

		let nameCatechists = "";

		if (step.catechists.length > 0) {
			for (let i = 0; i < step.catechists.length; i++) {
				step.catechists.length - i == 1
					? nameCatechists += step.catechists[i].firstName+" "+step.catechists[i].lastName
					: nameCatechists += step.catechists[i].firstName+" "+step.catechists[i].lastName + "<br>";
			}
		}

		card.querySelector("h4").textContent = formatStep(step.stepName);
		card.querySelector("p").innerHTML = nameCatechists;
		
		card.dataset.id = step.id;

		container.appendChild(card);
	});
}