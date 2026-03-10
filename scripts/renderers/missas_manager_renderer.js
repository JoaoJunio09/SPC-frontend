export function rendererMissasManager(missas, grid) {
	grid.innerHTML = '';

	const template = document.getElementById("template-missa-manager");
	missas.forEach(missa => {
		const fragment = template.content.cloneNode(true);
		const missa_card = fragment.querySelector(".missa-card");

		missa_card.dataset.id = missa.id;

		const title = missa_card.querySelector("#title");
		const date = missa_card.querySelector("#date");
		title.textContent = missa.title;
		date.textContent = missa.dateTime;

		grid.appendChild(missa_card);
	});
}