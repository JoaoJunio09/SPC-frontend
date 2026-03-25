import { UtilsDate } from '../utils/utils_date.js';

export function rendererMissasManager(missas, grid) {
	grid.innerHTML = '';

	const template = document.getElementById("template-missa-manager");
	missas.forEach(missa => {
		const fragment = template.content.cloneNode(true);
		const missa_card = fragment.querySelector(".missa-card");

		if (missa.registeredAttendance) {
			missa_card.classList.add('missa-card-register-presence');
			missa_card.querySelector(".missa-actions").classList.add('missa-actions-register-presence');
		}

		missa_card.dataset.id = missa.id;
		missa_card.dataset.liturgicalCalendarId = missa.massOfLiturgicalCalendarId;

		const title = missa_card.querySelector("#title");
		const date = missa_card.querySelector("#date");
		title.textContent = missa.title;
		date.textContent = formatDateTime(missa.dateTime);

		grid.appendChild(missa_card);
	});
}

function formatDateTime(dateTime) {
	const day = UtilsDate.formatDateTimeThisMissaForDate(dateTime).slice(8, 10);
	const month = UtilsDate.returnsMonthAsAString(UtilsDate.formatDateTimeThisMissaForDate(dateTime).slice(5, 7));
	const time = UtilsDate.formatDateTimeThisMissaForTime(dateTime);
	return `Dia ${day} de ${month}, às ${time}`;
}