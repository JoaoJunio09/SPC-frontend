import { rendererMissasManager } from "../../renderers/missas_manager_renderer.js";
import { MassService } from "../../services/mass_service.js";
import { Toast } from "../../utils/toast.js";
import { Loading } from "../../utils/loading.js";
import { loadTemplate } from "../../utils/template_loader.js";
import { UtilsDate } from "../../utils/utils_date.js";
import { confirmModal } from "../../utils/confirmation.js";
import { LiturgicalCalendarService } from "../../services/liturgical_calendar.js";
import { verifyAuth } from "../../auth/verify_auth.js";
import { AppStore } from "../../store/appStore.js";

let global_variables = {
	id: null,
	massSelectedId: null,
};

const dom = {
	grid: document.getElementById('missasGrid'),
	modal: document.getElementById('missaModal'),
	form: document.getElementById('missaForm'),
	btnOpenModal: document.getElementById('btnOpenModal'),
	btnCancel: document.getElementById('btnCancel'),
	selectLiturgicalCalendar: document.querySelector("#title"),
	selectLocation: document.querySelector("#location"),
};

document.addEventListener('DOMContentLoaded', async () => {
	verifyAuth();

	await loadTemplate("../../../templates/missa_manager_template.html");
	await loadTemplate("../../../templates/loading.html");

	Loading.showLoading();

	await fillInOptionsSelectMasses();

	renderizarMissas().finally(() => Loading.hideLoading());
});

dom.selectLiturgicalCalendar.addEventListener('change', async (e) => {
	const value = e.target.value;
	const massSelected = await LiturgicalCalendarService.findByTitle(value);
	document.querySelector(".date-register").value = massSelected.date;
	global_variables.massSelectedId = massSelected.id;
});

dom.btnOpenModal.addEventListener('click', (e) => {
	openModal(e);
});

dom.btnCancel.addEventListener('click', () => {
	closeModal();
});

dom.form.onsubmit = async (e) => {
	e.preventDefault();

	const dateTime = `${dom.form.querySelector("#date").value}T${dom.form.querySelector("#time").value}`;

	let missa = {
		id: global_variables.id,
		title: dom.form.querySelector("#title").value,
		dateTime: dateTime,
		location: dom.selectLocation.value,
		nameCommunityOrParish: sessionStorage.getItem('nameCommunityOrParish'),
		massOfLiturgicalCalendarId: global_variables.massSelectedId,
	};

	if (global_variables.id !== null) {	
		await MassService.updateMissa(missa)
			.then(() => { Toast.showToast({ message: 'Atualizado com sucesso', type: 'success' }) })
			.catch(() => { Toast.showToast({ message: 'Erro ao atualizar Missa', type: 'error' }) });
		MassService.clearCache();
	} 
	else {
		await MassService.createMissa(missa)
			.then(() => { Toast.showToast({ message: 'Criado com sucesso', type: 'success' }) })
			.catch((e) => console.log(e));
		MassService.clearCache();
	}

	renderizarMissas();
	closeModal();
};

async function fillInOptionsSelectMasses() {
	const datesOfLiturgicalCalendar = await LiturgicalCalendarService.findAll();

	datesOfLiturgicalCalendar.forEach(masse_of_calendar => {
		dom.selectLiturgicalCalendar.innerHTML += `
			<option value="${masse_of_calendar.title}">${masse_of_calendar.title}</option>
		`;
	});

	sessionStorage.getItem('nameCommunityOrParish') === 'SAO_SEBASTIAO'
		? dom.selectLocation.innerHTML = `<option value="MATRIZ">Matriz</option>`
		: dom.selectLocation.innerHTML = `<option value="CAPELA_DO_DIVINO">Capela do Divino</option>`;
}

async function renderizarMissas() {
	const missas = await MassService.findByNameCommunityOrParish(sessionStorage.getItem('nameCommunityOrParish'))
		.catch(() => {
			Toast.showToast({ message: 'Erro ao carregar as informações', type: 'error' }) 
		});
		
	rendererMissasManager(missas, dom.grid);
	initializeButtons();
}

function initializeButtons() {
	document.querySelectorAll(".btn-edit").forEach(btn =>	btn.addEventListener('click', (e) => {openModal(e)}));

	document.querySelectorAll(".btn-remove").forEach(btn =>  btn.addEventListener('click', async (e) => {await remove(e)}));
}

async function remove(e) {
	const missaId = Number.parseInt(e.target.closest('.missa-card').dataset.id);

	if (await confirmModal("Deseja remover Missa?")) {
		await MassService.deleteMissa(missaId)
			.then(() => {
				renderizarMissas();
				Toast.showToast({ message: 'Missa removida com sucesso', type: 'success' });
			})
			.catch((e) => {
				Toast.showToast({ message: 'Não foi possível remover Missa', type: 'error' }) ;
			});
		
		MassService.clearCache();
		renderizarMissas();
	}
}

async function openModal(e) {
	if (e.target.closest('.missa-card') === null) {
		global_variables.id = null;
	} else {
		getData(e);
	}
	dom.modal.style.display = 'flex';
}

function closeModal() {
	dom.modal.style.display = 'none';
}

async function getData(e) {
	global_variables.id = Number.parseInt(e.target.closest('.missa-card').dataset.id);
	global_variables.massSelectedId = Number.parseInt(e.target.closest('.missa-card').dataset.liturgicalCalendarId);

	const missa = await MassService.findByIdMissa(global_variables.id);

	dom.form.querySelector("#title").value = missa.title;
	dom.form.querySelector("#date").value = UtilsDate.formatDateTimeThisMissaForDate(missa.dateTime);
	dom.form.querySelector("#time").value = UtilsDate.formatDateTimeThisMissaForTime(missa.dateTime);
}