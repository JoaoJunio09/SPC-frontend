import { MissaService } from "../../services/missa_service.js";
import { UtilsDate } from "../../utils/utils_date.js";
import { loadTemplate } from "../../utils/template_loader.js";
import { Loading } from "../../utils/loading.js";
import { Toast } from "../../utils/toast.js";
import { verifyAuth } from "../../auth/verify_auth.js";
import { PresencaService } from "../../services/presenca_service.js";
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
		const [masses, presences] = await Promise.all([
			MissaService.findByNameCommunityOrParish(sessionStorage.getItem('nameCommunityOrParish')),
			PresencaService.findAllPresenca()
		]);
		
		renderWeekDays(masses, presences);
	}
	catch (err) {
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

	const active = document.querySelector(".day-card.active-day");

	if (active) {
		carregarEvento(active.getAttribute("data-date"));
	}

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
			carregarEvento(dateString, presences);
		}

		// evento click
		card.addEventListener("click", () => {
			document
			.querySelectorAll(".day-card")
			.forEach(c => c.classList.remove("active-day"));

			card.classList.add("active-day");

			carregarEvento(dateString, presences);
		});

		dom.weekGrid.appendChild(card);
	}
}

export async function carregarEvento(date, presences) {
	const masses = await MissaService.findByNameCommunityOrParish(sessionStorage.getItem('nameCommunityOrParish'))
		.catch(() => { Toast.showToast({ message: 'Erro ao carregar as informações', type: 'error' }) })
		.finally(() => { Loading.hideLoading() });
	rendererCardMass(masses, presences, date, dom.eventContainer);
	initializeButtons();

	// dom.eventContainer.innerHTML = '';
	// let thereIsMassToday = false;

	// let verifyRegisteredPresence = false;
	
	// missas.forEach(async missa => {
	// 	if (UtilsDate.formatDateTimeThisMissaForDate(missa.dateTime) === data) {
	// 		if (document.querySelector('.no-event-message')) {
	// 			document.querySelector('.no-event-message').style.display = 'none';
	// 		}

	// 		let day = missa.dateTime.slice(8, 10);
	// 		let month = missa.dateTime.slice(5, 7);
	// 		let date = `${day} de ${UtilsDate.returnsMonthAsAString(month)}`;

	// 		const event_card = document.createElement('div');

	// 		let actions_buttons_style = null;

			// if (missa.registeredAttendance == true) {
			// 	event_card.classList.add('event-card-register-presence');
			// 	actions_buttons_style = 'btn-primary-register-presence';
			// }

			// verifico no se na tabela 'presenca':
			// contém algum registro com o id da missa e do catequista logado do sistema
			// se tiver, então o catequista já registrou presença nessa missa.

			// const catechist = JSON.parse(sessionStorage.getItem('catechist'));
			// const isCatechistRegisteredPresence = await catechistRegisteredAttendance(missa.id, catechist.id)
			// 	.then(() => {
			// 		event_card.classList.add('event-card-register-presence');
			// 		actions_buttons_style = 'btn-primary-register-presence';
			// 	})

			// generateCard(missa, event_card, thereIsMassToday, actions_buttons_style, date);
	// 	}
	// });
	
	// if (verifyRegisteredPresence === true) {
	// 	if (!thereIsMassToday) {
	// 		const year = new Date().getFullYear();
	// 		const month = String(new Date().getMonth()+1).padStart(2,'0');
	// 		const dayNum = String(new Date().getDate()).padStart(2,'0');
	// 		const dateString = `${year}-${month}-${dayNum}`;

	// 		if (data === dateString) {
	// 			dom.eventContainer.innerHTML = `
	// 				<div class="no-event-message">
	// 					<p>Não há missa hoje</p>
	// 				</div>
	// 			`;
	// 		} 
	// 		else {			
	// 			dom.eventContainer.innerHTML = `
	// 				<div class="no-event-message">
	// 					<p>Não há missa na data ${data}</p>
	// 				</div>
	// 			`;
	// 		}
	// 	}
	// }

}

function generateCard(missa, event_card, thereIsMassToday, actions_buttons_style, date) {
	event_card.classList.add('event-card');
	event_card.classList.add('missa-card');
	event_card.setAttribute('missa-id', missa.id)
	event_card.innerHTML = `
		<div>
			<div class="card-header">
				<span class="badge">Missa</span>
				<h2>${missa.title}</h2>
			</div>
			<div class="card-body">
				<div class="info-item">
					<span class="label">Dia:</span>
					<span class="value">${date}</span>
				</div>
				<div class="info-item">
					<span class="label">Horário:</span>
					<span class="value">
						${UtilsDate.formatDateTimeThisMissaForTime(missa.dateTime)}h, na ${missa.location === "MATRIZ" ? "Matriz" : "Capela do Divino"}
					</span>
				</div>
			</div>
			<button class="btn-primary ${(actions_buttons_style !== null) ? actions_buttons_style : ''}" id="btn-register-attendance">
				${(actions_buttons_style !== null) ? "Presença na Missa já foi registrada" : "Registrar Presença" }
			</button>
		</div>	
	`;

	dom.eventContainer.appendChild(event_card);
	thereIsMassToday = true;
}

async function catechistRegisteredAttendance(missaId, catechistId) {
	const presences = await PresencaService.findAllPresenca();
	presences.forEach(presence => {
		if (presence.missa.id === missaId && presence.catequista.id === catechistId) {
			return true;
		}
	});
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