import { MissaService } from "../../services/missa_service.js";
import { UtilsDate } from "../../utils/utils_date.js";
import { loadTemplate } from "../../utils/template_loader.js";
import { Loading } from "../../utils/loading.js";
import { Toast } from "../../utils/toast.js";
import { verifyAuth } from "../../auth/verify_auth.js";
import { PresencaService } from "../../services/presenca_service.js";
import { rendererCardMass } from "../../renderers/index/card_mass_renderer.js";
import { AppStore } from "../../store/appStore.js";

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
		const [masses, presences] = await Promise.all([
			MissaService.findByNameCommunityOrParish(sessionStorage.getItem('nameCommunityOrParish')),
			PresencaService.findAllPresenca()
		]);
		
		renderWeekDays(masses, presences);
	}
	catch (err) {
		console.log(err)
		Toast.showToast({ message: 'Erro ao carregar as informações', type: 'error' });
	}
	finally {
		Loading.hideLoading();
	}
});

function renderWeekDays(missas, presences) {
	const today = new Date();

	const day = today.getDay();
	const diffToMonday = day === 0 ? -6 : 1 - day;

	const monday = new Date(today);
	monday.setDate(today.getDate() + diffToMonday);

	const diasSemana = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];

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
			<span class="day-name">${diasSemana[i]}</span>
			<span class="day-num">${dayNum}</span>
		`;

		missas.forEach(missa => {
			if (UtilsDate.formatDateTimeThisMissaForDate(missa.dateTime) === dateString) {
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
			carregarEvento(dateString, presences, missas);
		}

		// evento click
		card.addEventListener("click", () => {
			document
			.querySelectorAll(".day-card")
			.forEach(c => c.classList.remove("active-day"));

			card.classList.add("active-day");

			carregarEvento(dateString, presences, missas);
		});

		dom.weekGrid.appendChild(card);
	}
}

export async function carregarEvento(date, presences, masses) {
	rendererCardMass(masses, presences, date, dom.eventContainer);
	initializeButtons();
}

function initializeButtons() {
	document.querySelectorAll('#btn-register-attendance').forEach(btn => {
		btn.addEventListener('click', (e) => {
			sessionStorage.setItem('missaId', e.target.closest('.event-card').getAttribute('missa-id'));
			sessionStorage.setItem('missaDoCalendarioLiturgico', e.target.closest('.event-card').querySelector('.card-header h2').textContent);
			window.location.href = '../../../registrarPresenca.html';
		});
	});
}