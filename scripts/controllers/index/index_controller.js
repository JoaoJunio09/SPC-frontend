import { MassService } from "../../services/mass_service.js";
import { UtilsDate } from "../../utils/utils_date.js";
import { loadTemplate } from "../../utils/template_loader.js";
import { Loading } from "../../utils/loading.js";
import { Toast } from "../../utils/toast.js";
import { verifyAuth } from "../../auth/verify_auth.js";
import { PresenceService } from "../../services/presence_service.js";
import { rendererCardMass } from "../../renderers/index/card_mass_renderer.js";

export const dom = {
	modal: document.getElementById('calendarModal'),
	monthGrid: document.getElementById('monthGrid'),
	eventContainer: document.getElementById('eventContainer'),
	weekGrid: document.querySelector("#weekGrid"),
	btnOpenCalender: document.querySelector("#btn-open-calendar"),
	btnCloseCalender: document.querySelector("#btn-close-calendar"),
};

export const arrays = {
	presences: [],
	masses: []
};

document.addEventListener('DOMContentLoaded', async () => {
	verifyAuth();
	
	await loadTemplate("../../../templates/loading.html");
	await loadTemplate("../../../templates/index/card_mass_template.html");

	Loading.showLoading();

	try {
		const communityOrParish = sessionStorage.getItem('communityOrParish');

		const [masses, presences] = await Promise.all([
			MassService.getAll({communityOrParish: communityOrParish}),
			PresenceService.getAll({})
		]);

		renderWeekDays(masses, presences);
	}
	catch (err) {
		Toast.showToast({ message: 'Erro ao carregar as Missas ou Presenças', type: 'error' });
	}
	finally {
		Loading.hideLoading();
	}
});

dom.eventContainer.addEventListener('click', (e) => {
	try {
		const btnRegisterPresence = e.target.closest('.btn-register-presence');

		if (btnRegisterPresence) {
			sessionStorage.setItem('massId', e.target.closest('.event-card').getAttribute('mass-id'));
			sessionStorage.setItem('massOfCalendarLiturgical', e.target.closest('.event-card').querySelector('.card-header h2').textContent);
			window.location.href = '../../../registrarPresenca.html';
		}
	}
	catch (err) {
		Toast.showToast({ message: 'Erro ao carregar a página', type: 'error' });
	}
});

export async function loadEvent(date, presences, masses) {
	rendererCardMass(masses, presences, date, dom.eventContainer);
}

function renderWeekDays(masses, presences) {
	const today = new Date();

	const day = today.getDay();
	const diffToMonday = day === 0 ? -6 : 1 - day;

	const monday = new Date(today);
	monday.setDate(today.getDate() + diffToMonday);

	const daysOfWeek = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];

	dom.weekGrid.innerHTML = '';

	for (let i = 0; i < 7; i++) {
		const current = new Date(monday);
		current.setDate(monday.getDate() + i);

		const year = current.getFullYear();
		const month = String(current.getMonth()+1).padStart(2,'0');
		const dayNum = String(current.getDate()).padStart(2,'0');

		const dateString = `${year}-${month}-${dayNum}`;

		const card = document.createElement('div');
		card.classList.add('day-card');
		card.setAttribute('data-date', dateString);

		card.innerHTML = `
			<span class="day-name">${daysOfWeek[i]}</span>
			<span class="day-num">${dayNum}</span>
		`;

		masses.forEach(mass => {
			if (UtilsDate.formatDateTimeThisMissaForDate(mass.dateTime) === dateString) {
				card.classList.add("has-missa");

				const indicator = document.createElement("div");
				indicator.classList.add("event-indicator");
				indicator.innerText = "Missa";

				card.appendChild(indicator);
			}
		});

		// marcar hoje
		const now = new Date();
		const todayString = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

		if(dateString === todayString) {
			card.classList.add("active-day");
			loadEvent(dateString, presences, masses);
		}

		// evento click
		card.addEventListener("click", () => {
			document
			.querySelectorAll(".day-card")
			.forEach(c => c.classList.remove("active-day"));

			card.classList.add("active-day");

			loadEvent(dateString, presences, masses);
		});

		dom.weekGrid.appendChild(card);
	}
}