import { MissaService } from "../../services/missa_service.js";
import { UtilsDate } from "../../utils/utils_date.js";
import { loadTemplate } from "../../utils/template_loader.js";
import { Loading } from "../../utils/loading.js";
import { Toast } from "../../utils/toast.js";

export const eventos = {};

export const dom = {
	modal: document.getElementById('calendarModal'),
	monthGrid: document.getElementById('monthGrid'),
	eventContainer: document.getElementById('eventContainer'),
	weekGrid: document.querySelector("#weekGrid"),
	btnOpenCalender: document.querySelector("#btn-open-calendar"),
	btnCloseCalender: document.querySelector("#btn-close-calendar"),
};

function renderWeekDays(missas) {
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
			carregarEvento(dateString);
		}

		// evento click
		card.addEventListener("click", () => {
			document
			.querySelectorAll(".day-card")
			.forEach(c => c.classList.remove("active-day"));

			card.classList.add("active-day");

			carregarEvento(dateString);
		});

		dom.weekGrid.appendChild(card);
	}
}

export async function carregarEvento(data) {
	const missas = await MissaService.findAllMissa()
		.catch(() => { Toast.showToast({ message: 'Erro ao carregar as informações', type: 'error' }) })
		.finally(() => { Loading.hideLoading() });

	dom.eventContainer.innerHTML = '';
	let thereIsMassToday = false;
	
	missas.forEach(missa => {
		
		if (UtilsDate.formatDateTimeThisMissaForDate(missa.dateTime) === data) {
			if (document.querySelector('.no-event-message')) {
				document.querySelector('.no-event-message').style.display = 'none';
			}

			let day = missa.dateTime.slice(8, 10);
			let month = missa.dateTime.slice(5, 7);
			let date = `${day} de ${UtilsDate.returnsMonthAsAString(month)}`;

			const event_card = document.createElement('div');
			event_card.classList.add('event-card');
			event_card.classList.add('missa-card');
			event_card.setAttribute('missa-id', missa.id)
			event_card.innerHTML = `
				<div>
					<div class="card-header">
						<span class="badge">Missa</span>
						<h2>Missa: ${missa.title}</h2>
					</div>
					<div class="card-body">
						<div class="info-item">
							<span class="label">Dia:</span>
							<span class="value">${date}</span>
						</div>
						<div class="info-item">
							<span class="label">Horário:</span>
							<span class="value">19h na Matriz</span>
						</div>
					</div>
					<button class="btn-primary" id="btn-register-attendance">Registrar Presença</button>
				</div>	
			`;

			dom.eventContainer.appendChild(event_card);
			thereIsMassToday = true;
		}
	});

	if (!thereIsMassToday) {
		const year = new Date().getFullYear();
		const month = String(new Date().getMonth()+1).padStart(2,'0');
		const dayNum = String(new Date().getDate()).padStart(2,'0');
		const dateString = `${year}-${month}-${dayNum}`;

		if (data === dateString) {
			dom.eventContainer.innerHTML = `
				<div class="no-event-message">
					<p>Não há missa hoje</p>
				</div>
			`;
		} 
		else {			
			dom.eventContainer.innerHTML = `
				<div class="no-event-message">
					<p>Não há missa na data ${data}</p>
				</div>
			`;
		}
	}

	initializeButtons();
}

document.addEventListener('DOMContentLoaded', async () => {
	await loadTemplate("../../../templates/loading.html");

	Loading.showLoading();

	const missas = await MissaService.findAllMissa()
		.catch(() => { Toast.showToast({ message: 'Erro ao carregar as informações', type: 'error' }) })
		.finally(() => { Loading.hideLoading() });

	renderWeekDays(missas);

	const active = document.querySelector(".day-card.active-day");

	if(active){
		carregarEvento(active.getAttribute("data-date"));
	}
});

function initializeButtons() {
	document.querySelectorAll('#btn-register-attendance').forEach(btn => {
		btn.addEventListener('click', (e) => {
			localStorage.setItem('missaId', e.target.closest('.event-card').getAttribute('missa-id'));
			window.location.href = '../../../registrarPresenca.html';
		});
	});
}