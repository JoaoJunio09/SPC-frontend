export function rendererCardSteps(steps, listSteps) {
	const template = document.getElementById("card-steps-template");
	
	steps.forEach(step => {
		const frag = template.content.cloneNode(true);
		const card = frag.querySelector(".card");

		card.querySelector("#step").textContent = step.etapa;
		card.querySelector("#firstNameCatechist").textContent = step.catequista.firstName;

		listSteps.appendChild(card);
	});
}