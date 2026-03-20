export function rendererCardViewCatechumens(catechumens) {
	const template = document.getElementById("card-view-catechumens-template");
	
	catechumens.forEach(catechumen => {
		const frag = template.content.cloneNode(true);
		const modal = frag.querySelector("#modalViewCatechumens");

		console.log(catechumen);
	});

	// DEPOIS DE LISTAR OS CATEQUIZANDOS, DEVO ABRIR O MODAL PARA EXIBIR OS DADOS
}