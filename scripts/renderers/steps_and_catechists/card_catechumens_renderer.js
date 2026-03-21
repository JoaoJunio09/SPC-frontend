export function rendererCardCatechumen(list, catechumens) {
	const template = document.getElementById("card-catechumens-template");

	const percActual = 50+"%";
	const percTotal = 33.3+"%";

	catechumens.forEach(catechumen => {
		const frag = template.content.cloneNode(true);
		const card = frag.querySelector("#card");

		card.querySelector(".catechumen-firstName").textContent = catechumen.firstName;
		card.querySelector(".catechument-birthDate").textContent = catechumen.birthDate;

		card.querySelector(".presence-actual").textContent = `${percActual}`;
		card.querySelector(".bg-green").style.width = `${percActual}`;

		card.querySelector(".presence-total").textContent = `${percTotal}`;
		card.querySelector(".bg-orange").style.width = `${percTotal}`;

		list.appendChild(card);
	});
}