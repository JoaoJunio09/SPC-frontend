import { rendererMissasManager } from "../../renderers/missas_manager_renderer.js";
import { MissaService } from "../../services/missa_service.js";
import { Toast } from "../../utils/toast.js";
import { Loading } from "../../utils/loading.js";
import { loadTemplate } from "../../utils/template_loader.js";
import { UtilsDate } from "../../utils/utils_date.js";
import { confirmModal } from "../../utils/confirmation.js";

let id = null;

const dom = {
	grid: document.getElementById('missasGrid'),
	modal: document.getElementById('missaModal'),
	form: document.getElementById('missaForm'),
	btnOpenModal: document.getElementById('btnOpenModal'),
	btnCancel: document.getElementById('btnCancel'),
};

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
		id: id,
		title: dom.form.querySelector("#title").value,
		dateTime: dateTime,
	};

	if (id !== null) {	
		await MissaService.updateMissa(missa)
			.then(() => { Toast.showToast({ message: 'Atualizado com sucesso', type: 'success' }) })
			.catch(() => { Toast.showToast({ message: 'Erro ao atualizar Missa', type: 'error' }) });
	} 
	else {
		await MissaService.createMissa(missa)
			.then(() => { Toast.showToast({ message: 'Criado com sucesso', type: 'success' }) })
			.catch(() => { Toast.showToast({ message: 'Erro ao registrar Missa', type: 'error' }) });
	}

	renderizarMissas();
	closeModal();
};

document.addEventListener('DOMContentLoaded', async () => {
	await loadTemplate("../../../templates/missa_manager_template.html");
	await loadTemplate("../../../templates/loading.html");

	Loading.showLoading();

	renderizarMissas().finally(() => Loading.hideLoading());
});

async function renderizarMissas() {
	const missas = await MissaService.findAllMissa()
		.catch(() => { Toast.showToast({ message: 'Erro ao carregar as informações', type: 'error' }) });

	rendererMissasManager(missas, dom.grid);
	initializeButtons();
}

function initializeButtons() {
	document.querySelectorAll(".btn-edit").forEach(btn => {
		btn.addEventListener('click', (e) => { 
			openModal(e);
		});
	});

	document.querySelectorAll(".btn-remove").forEach(btn => {
		btn.addEventListener('click', async (e) => { 
			await remove(e);
		});
	});
}

async function remove(e) {
	const missaId = Number.parseInt(e.target.closest('.missa-card').dataset.id);

	if (await confirmModal("Deseja remover Missa?")) {
		await MissaService.deleteMissa(missaId)
			.then(() => {
				renderizarMissas();
				Toast.showToast({ message: 'Missa removida com sucesso', type: 'sucecss' });
			})
			.catch((e) => {
				Toast.showToast({ message: 'Não foi possível remover Missa', type: 'error' }) ;
			})
	}
}

async function getData(e) {
	id = Number.parseInt(e.target.closest('.missa-card').dataset.id);
	const missa = await MissaService.findByIdMissa(id);

	dom.form.querySelector("#title").value = missa.title;
	dom.form.querySelector("#date").value = UtilsDate.formatDateTimeThisMissaForDate(missa.dateTime);
	dom.form.querySelector("#time").value = UtilsDate.formatDateTimeThisMissaForTime(missa.dateTime);
}

async function openModal(e) {
	if (e.target.closest('.missa-card') === null) {
		id = null;
	} else {
		getData(e);
	}
	dom.modal.style.display = 'flex';
}

function closeModal() {
	dom.modal.style.display = 'none';
}