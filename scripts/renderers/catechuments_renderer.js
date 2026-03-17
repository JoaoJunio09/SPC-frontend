import { proccessTheFrequencyOfCatechumens } from "../controllers/catequizandos/catequizandos_controller.js";

export async function rendererCatechuments(emptyState, table, tbody, catechumens) {
	const template = document.getElementById("catechumens-row-template");

	emptyState.style.display = 'none';
	table.style.display = 'initial';
	
	if (catechumens.length === 0) {
		table.style.display = 'none';
	}

	tbody.innerHTML = "";

	catechumens.forEach(async catechumen => {
		const frag = template.content.cloneNode(true); 
		const tr = frag.querySelector('.catequizando-row');

		const [frequencyActual, frequencyTotal] = await proccessTheFrequencyOfCatechumens(catechumen);

		tr.querySelector("#firstName").textContent = catechumen.firstName;
		tr.querySelector("#catechistFirstName").textContent = catechumen.etapa.catequista.firstName;
		tr.querySelector("#step").textContent = catechumen.etapa.etapa;

		tr.querySelector(".freq-high").textContent = frequencyActual.toFixed(1) + "%";
		tr.querySelector(".freq-medium").textContent = frequencyTotal.toFixed(1) + "%";

		tbody.appendChild(tr);
	});
}