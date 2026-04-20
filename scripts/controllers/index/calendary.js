import { dom } from "./index_controller.js";
import { loadEvent } from "./index_controller.js";
import { MassService } from "../../services/mass_service.js";
import { UtilsDate } from "../../utils/utils_date.js";
import { AppStore } from "../../store/appStore.js";

let currentDate = new Date();
let masses_dates = [];

document.addEventListener('DOMContentLoaded', async () => {
	const communityOrParish = sessionStorage.getItem('communityOrParish');
	masses_dates = await MassService.getMassesDatesByCommunityOrParirsh(communityOrParish);
});

function renderMonthDays() {
	dom.monthGrid.innerHTML = '';

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();

	const firstDay = new Date(year, month, 1).getDay();
	const lastDate = new Date(year, month + 1, 0).getDate();

	// Atualiza título do mês
	const monthNames = [
		"Janeiro","Fevereiro","Março","Abril","Maio","Junho",
		"Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
	];

	document.getElementById("currentMonth").innerText = `${monthNames[month]} ${year}`;

	// Espaços vazios antes do primeiro dia
	for (let i = 0; i < firstDay; i++) {
		const empty = document.createElement("div");
		monthGrid.appendChild(empty);
	}

	// Dias do mês
	for (let day = 1; day <= lastDate; day++) {

		const dateString = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

		const dayDiv = document.createElement('div');
		dayDiv.style.cursor = "pointer";
		dayDiv.setAttribute('data-date', dateString);
		dayDiv.classList.add('month-day');
		dayDiv.innerText = day;
		initializeEventDayCalendar(dayDiv);

		for (let i = 0; i < masses_dates.length; i++) {
			if (UtilsDate.formatDateTimeThisMissaForDate(masses_dates[i]) === dateString) {
				dayDiv.classList.add('missa');
			}
		}

		monthGrid.appendChild(dayDiv);
	}
}

dom.btnOpenCalender.addEventListener('click', () => {
  openCalendarModal();
});

dom.btnCloseCalender.addEventListener('click', () => {
  closeCalendarModal();
});

function openCalendarModal() {
	dom.modal.style.display = 'flex';
	renderMonthDays();
}

export function closeCalendarModal() {
	dom.modal.style.display = 'none';
}

function initializeEventDayCalendar(dayDiv) {
  dayDiv.addEventListener('click', (e) => {
    const dataSelecionada = e.target.closest('div').getAttribute('data-date');
    loadEvent(dataSelecionada, AppStore.getPresences(), AppStore.getMasses());
    closeCalendarModal();
  });
}

const btnPrev = document.querySelectorAll(".btn-nav-month")[0];
const btnNext = document.querySelectorAll(".btn-nav-month")[1];

btnPrev.addEventListener("click", () => {
	currentDate.setMonth(currentDate.getMonth() - 1);
	renderMonthDays();
});

btnNext.addEventListener("click", () => {
	currentDate.setMonth(currentDate.getMonth() + 1);
	renderMonthDays();
});

// Fechar modal ao clicar fora
window.onclick = function(event) {
	if (event.target == dom.modal) closeCalendarModal();
}