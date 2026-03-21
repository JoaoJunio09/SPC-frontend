import { proccessTheFrequencyOfCatechumens } from "../../controllers/catequizandos/process_frequency.js";


export function rendererCardCatechumen(list, catechumens) {
	const template = document.getElementById("card-catechumens-template");

	catechumens.forEach(async catechumen => {
		const frag = template.content.cloneNode(true);
		const card = frag.querySelector("#card");

		let [frequencyActual, frequencyTotal] = await proccessTheFrequencyOfCatechumens(catechumen);

		card.querySelector(".catechumen-firstName").textContent = catechumen.firstName;
		card.querySelector(".catechument-birthDate").textContent = catechumen.birthDate;

		card.querySelector(".presence-actual").textContent = `${frequencyActual.toFixed(1) + "%"}`;
		card.querySelector(".bg-green").style.width = `${frequencyActual.toFixed(1) + "%"}`;

		card.querySelector(".presence-total").textContent = `${frequencyTotal.toFixed(1) + "%"}`;
		card.querySelector(".bg-orange").style.width = `${frequencyTotal.toFixed(1) + "%"}`;

		list.appendChild(card);
	});
}