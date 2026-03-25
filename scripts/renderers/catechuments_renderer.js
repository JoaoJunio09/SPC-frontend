import { proccessTheFrequencyOfCatechumens } from "../controllers/catequizandos/process_frequency.js";
import { formatStep } from "../utils/format_step.js";

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

		tr.querySelector("#firstName").textContent = `${catechumen.firstName} ${catechumen.lastName}`;
		tr.querySelector("#step").textContent = formatStep(catechumen.etapa.etapa);

		tr.querySelector(".freq-high").textContent = frequencyActual.toFixed(1) + "%";
		tr.querySelector(".freq-medium").textContent = frequencyTotal.toFixed(1) + "%";

		if (catechumen.etapa.catequistas.length === 1) {
			tr.querySelector("#catechistFirstName").textContent = catechumen.etapa.catequistas[0].firstName;
		}
		else {
			let textCatechistsName = "";
			for (let i = 0; i < catechumen.etapa.catequistas.length; i++) {
				i === 0 
					? textCatechistsName += catechumen.etapa.catequistas[i].firstName + " e "
					: textCatechistsName += catechumen.etapa.catequistas[i].firstName;
			}
			tr.querySelector("#catechistFirstName").textContent = textCatechistsName;
		}

		tbody.appendChild(tr);
	});
}