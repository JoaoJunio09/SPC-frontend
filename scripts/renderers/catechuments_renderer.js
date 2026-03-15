export async function rendererCatechuments(emptyState, table, tbody, catechumens) {
	const template = document.getElementById("catechumens-row-template");

	emptyState.style.display = 'none';
	table.style.display = 'initial';
	
	if (catechumens.length === 0) {
		table.style.display = 'none';
	}

	tbody.innerHTML = "";

	catechumens.forEach(catechumen => {
		const frag = template.content.cloneNode(true); 
		const tr = frag.querySelector('.catequizando-row');

		tr.querySelector("#firstName").textContent = catechumen.firstName;
		tr.querySelector("#catechistFirstName").textContent = catechumen.etapa.catequista.firstName;
		tr.querySelector("#step").textContent = catechumen.etapa.etapa;

		tbody.appendChild(tr);
	});
}