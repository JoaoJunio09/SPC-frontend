import { rendererMissasManager } from "../../renderers/missas_manager_renderer.js";
import { MassService } from "../../services/mass_service.js";
import { Toast } from "../../utils/toast.js";
import { Loading } from "../../utils/loading.js";
import { loadTemplate } from "../../utils/template_loader.js";
import { UtilsDate } from "../../utils/utils_date.js";
import { confirmModal } from "../../utils/confirmation.js";
import { LiturgicalCalendarService } from "../../services/liturgical_calendar_service.js";
import { verifyAuth } from "../../auth/verify_auth.js";
import { AppStore } from "../../store/appStore.js";
import { Exceptions } from "../../exceptions/exceptions.js";
import { MessageModal } from "../../utils/modal_message.js";

let global_variables = {
	id: null,
	massSelectedId: null,
};

const dom = {
	grid: document.getElementById('massesGrid'),
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

	try {
		await fillInOptionsSelectMasses();

		renderizarMissas();
	}
	catch (err) {
		if (err instanceof Exceptions.DataCouldNotBeRenderedException) {
			MessageModal.show({
				type: 'error',
				title: 'Erro',
				message: err.message
			});
		}
		else {
			Toast.showToast({ message: 'Não foi possível processar as Informações', type: 'error' });
		}
	}
	finally {
		Loading.hideLoading();
	}	
});

dom.grid.addEventListener('click', async (e) => {
	const btnRemove = e.target.closest('.missa-card .btn-remove');
	if (btnRemove) {
		await remove(e);
	}

	const btnEdit = e.target.closest('.missa-card .btn-edit');
	if (btnEdit) {
		await openModal(e);
	}
});

dom.selectLiturgicalCalendar.addEventListener('change', async (e) => {
	try {
		const value = e.target.value;
		const massSelected = await LiturgicalCalendarService.getAll({title: value});
		document.querySelector(".date-register").value = massSelected[0].date;
		global_variables.massSelectedId = massSelected[0].id;
	}
	catch (err) {
		Toast.showToast({ message: 'Não foi possível selecionar a data automaticamnte', type: 'error' });
	}
});

dom.btnOpenModal.addEventListener('click', (e) => {
	openModal(e);
});

dom.btnCancel.addEventListener('click', () => {
	closeModal();
});

dom.form.onsubmit = async (e) => {
	try {
		e.preventDefault();

		const dateTime = `${dom.form.querySelector("#date").value}T${dom.form.querySelector("#time").value}`;

		let mass = {
			id: global_variables.id,
			title: dom.form.querySelector("#title").value,
			dateTime: dateTime,
			location: dom.selectLocation.value,
			nameCommunityOrParish: sessionStorage.getItem('communityOrParish'),
			massOfLiturgicalCalendarId: global_variables.massSelectedId,
		};

		if (global_variables.id !== null) {	
			await MassService.update(mass)
				.then(() => { Toast.showToast({ message: 'Atualizado com sucesso', type: 'success' }) })
				.catch(() => { Toast.showToast({ message: 'Erro ao atualizar Missa', type: 'error' }) });
			MassService.clearCache();
		} 
		else {
			await MassService.create(mass)
				.then(() => { Toast.showToast({ message: 'Criado com sucesso', type: 'success' }) })
				.catch((e) => { Toast.showToast({ message: 'Erro ao registrar Missa', type: 'error' }) });
			MassService.clearCache();
		}

		renderizarMissas();
		closeModal();
	}
	catch (err) {
		if (err instanceof Exceptions.DataCouldNotBeRenderedException) {
			MessageModal.show({
				type: 'error',
				title: 'Erro',
				message: err.message
			});
		}
		else {
			Toast.showToast({ message: 'Não foi possível processar as Informações', type: 'error' });
		}
	}
};

async function fillInOptionsSelectMasses() {
	const datesOfLiturgicalCalendar = await LiturgicalCalendarService.getAll({});

	datesOfLiturgicalCalendar.forEach(masse_of_calendar => {
		dom.selectLiturgicalCalendar.innerHTML += `
			<option value="${masse_of_calendar.title}">${masse_of_calendar.title}</option>
		`;
	});

	sessionStorage.getItem('communityOrParish') === 'SAO_SEBASTIAO'
		? dom.selectLocation.innerHTML = `<option value="MATRIZ">Matriz</option>`
		: dom.selectLocation.innerHTML = `<option value="CAPELA_DO_DIVINO">Capela do Divino</option>`;
}

async function renderizarMissas() {
	try {
		const communityOrParish = sessionStorage.getItem('nameCommunityOrParish');
		const missas = await MassService.getAll({communityOrParish: communityOrParish});
			
		rendererMissasManager(missas, dom.grid);
	}
	catch (err) {
		throw new Exceptions.DataCouldNotBeRenderedException("Erro ao carregar dados de Missas");
	}
}

async function remove(e) {
	const missaId = Number.parseInt(e.target.closest('.missa-card').dataset.id);

	if (await confirmModal("Deseja remover Missa?")) {
		await MassService.delete(missaId)
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

	const missa = await MassService.getById(global_variables.id);

	dom.form.querySelector("#title").value = missa.title;
	dom.form.querySelector("#date").value = UtilsDate.formatDateTimeThisMissaForDate(missa.dateTime);
	dom.form.querySelector("#time").value = UtilsDate.formatDateTimeThisMissaForTime(missa.dateTime);
}