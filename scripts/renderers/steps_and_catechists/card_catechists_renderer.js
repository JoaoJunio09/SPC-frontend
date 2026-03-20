export function rendererCardCatechists(catechists, listCatechists) {
	const template = document.getElementById("card-catechists-template");
	
	catechists.forEach(catechist => {
		const frag = template.content.cloneNode(true);
		const card = frag.querySelector(".card");

		card.setAttribute('data-id', catechist.id);

		card.querySelector("#firstName").textContent = catechist.firstName;
		card.querySelector(".tag-step").textContent = catechist.stepOfCatechistResponseDTO.stepEnum;

		listCatechists.appendChild(card);
	});
}