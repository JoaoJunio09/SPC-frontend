import { formatStep } from "../../../utils/format_step.js";

export function rendererCardSteps(steps, container) {
	const template = document.getElementById('card-step-template');
	
	steps.forEach(step => {
		const frag = template.content.cloneNode(true);
		const card = frag.querySelector("#card-step");

		let nameCatechists = "";

		if (step.catequistas.length > 0) {
			for (let i = 0; i < step.catequistas.length; i++) {
				step.catequistas.length - i == 1
					? nameCatechists += step.catequistas[i].firstName+" "+step.catequistas[i].lastName
					: nameCatechists += step.catequistas[i].firstName+" "+step.catequistas[i].lastName + "<br>";
			}
		}

		card.querySelector("h4").textContent = formatStep(step.etapa);
		card.querySelector("p").innerHTML = nameCatechists;
		
		card.dataset.id = step.id;

		container.appendChild(card);
	});
}