import { UtilsDate } from "../../utils/utils_date.js";

export function rendererCardMass(masses, presences, date, container) {
	const template = document.querySelector('#card-mass-template');
	container.innerHTML = '';

	let thereIsMassToday = false;
	
	masses.forEach(mass => {
		if (UtilsDate.formatDateTimeThisMissaForDate(mass.dateTime) === date) {
			if (document.querySelector('.no-event-message')) {
				document.querySelector('.no-event-message').style.display = 'none';
			}

			const frag = template.content.cloneNode(true);
			const card = frag.querySelector('.mass-card');
			card.setAttribute('mass-id', mass.id);

			thereIsMassToday = true;
			let day = mass.dateTime.slice(8, 10);
			let month = mass.dateTime.slice(5, 7);
			let date = `${day} de ${UtilsDate.returnsMonthAsAString(month)}`;
			
			card.querySelector('.card-header h2').textContent = mass.title;
			card.querySelector('.value-date').textContent = date;
			card.querySelector('.value-time').textContent = `${UtilsDate.formatDateTimeThisMissaForTime(mass.dateTime)}h, na ${mass.location === "MATRIZ" ? "Matriz" : "Capela do Divino"}`;

			let actions_buttons_style = null;

			const isRegisteredPresence = catechistRegisteredAttendance(presences, mass.id);

			if (isRegisteredPresence) {
				card.classList.add('event-card-register-presence');
				actions_buttons_style = 'btn-primary-register-presence';
			}

			card.querySelector('.btn-primary').classList.add(actions_buttons_style)
			
			card.querySelector('.btn-primary').textContent = `
				${(actions_buttons_style !== null) ? "Você já registrou presença na missa" : "Registrar Presença" }
			`;

			container.appendChild(card);
		}
	});

	if (!thereIsMassToday) {
		const year = new Date().getFullYear();
		const month = String(new Date().getMonth()+1).padStart(2,'0');
		const dayNum = String(new Date().getDate()).padStart(2,'0');
		const dateString = `${year}-${month}-${dayNum}`;

		if (date === dateString) {
			container.innerHTML = `
				<div class="no-event-message">
					<p>Não há missa hoje</p>
				</div>
			`;
		} 
		else {			
			container.innerHTML = `
				<div class="no-event-message">
					<p>Não há missa na data ${date}</p>
				</div>
			`;
		}
	}
}

function catechistRegisteredAttendance(presences, massId) {
	const catechist = JSON.parse(sessionStorage.getItem('catechist'));
	if (!catechist) return;

	if (!presences) return;
	
	return presences.some(p => 
		p.mass.id === massId &&
		p.catechist.id === catechist.id
	);
}