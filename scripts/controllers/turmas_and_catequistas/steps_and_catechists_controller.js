import { rendererCardCatechists } from '../../renderers/card_catechists_renderer.js';
import { rendererCardSteps } from '../../renderers/card_steps_renderer.js';
import { CatequistaService } from '../../services/catequista_service.js';
import { EtapaService } from '../../services/etapa_service.js';
import { Loading } from '../../utils/loading.js';
import { loadTemplate } from '../../utils/template_loader.js';
import { Toast } from '../../utils/toast.js';

class Step {

};

class Catechist {
	id = null;
	firstName = null;
	lastName = null;

	setData(firstName, lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
	}

	async edit() {
		try {
			getDataCatechist(this.id, true);
			
			await CatequistaService.updateCatequista({
				id: this.id,
				firstName: this.firstName,
				lastName: this.lastName
			})
			.then(() => {
				Toast.showToast({ 
					message: 'Editado com sucesso', 
					type: 'success' 
				});

				setTimeout(() => location.reload(), 2500);
			});
		}
		catch (e) {
			Toast.showToast({ 
				message: 'Não foi possível editar os dados da(o) Catequista', 
				type: 'error' 
			});
		}
	}

	async save(data) {

	}
};

const objects = {
	catechist: new Catechist(),
};

const lists = {
	catechists: [],
	steps: []
};

const dom = {
	listCatechists: document.querySelector("#lista-catequistas"),
	listSteps: document.querySelector("#lista-turmas"),
	listCatechumensOfSteps: document.querySelector("#lista-alunos-modal"),
	editCatechist: {
		modalEditCatechist: document.querySelector("#modalEditCatequista"),
		btnSave: document.querySelector("#modalEditCatequista").querySelector(".btn-save"),
		btnCancel: document.querySelector("#modalEditCatequista").querySelector(".btn-cancel"),
	}
}

dom.editCatechist.btnCancel.addEventListener('click', () => {
	closeModalEditCatechist()
});

dom.editCatechist.btnSave.addEventListener('click', () => {
	objects.catechist.edit();
});

document.addEventListener('DOMContentLoaded', async () => {
	await loadTemplate("../../../templates/loading.html");
	await loadTemplate("../../../templates/turmas_and_catequistas/card_catechists_template.html");
	await loadTemplate("../../../templates/turmas_and_catequistas/card_steps_template.html");

	Loading.showLoading();

	try {
		const [catechists, steps] = await Promise.all([
			CatequistaService.findAllCatequistas(),
			EtapaService.findAllEtapa()
		]);

		lists.catechists = catechists;
		lists.steps = steps;

		loadCatechistsAndSteps(catechists, steps);
	}
	catch (e) {
		Toast.showToast({ 
			message: 'Não foi possível carregar os Catequistas e as Turmas', 
			type: 'error' 
		});
	}
	finally {
		Loading.hideLoading();
	}
});

function loadCatechistsAndSteps(catechists, steps) {
	rendererCardCatechists(catechists, dom.listCatechists);
	rendererCardSteps(steps, dom.listSteps);

	initializeButtonsCatechists();
}

function initializeButtonsCatechists() {
	const btnsEdit = document.querySelectorAll(".btn-edit-catechist");
	const btnsChange = document.querySelectorAll(".btn-change-catechist");
	const btnsRemove = document.querySelectorAll(".btn-remove-catechist");

	btnsEdit.forEach(
		btn => btn.addEventListener('click', async (e) => await openModalEditCatechist(e))
	);

	btnsChange.forEach(
		btn => btn.addEventListener('click', async (e) => changeStepCatechist(e))
	);

	btnsRemove.forEach(
		btn => btn.addEventListener('click', async (e) => removeCatechist(e))
	);
}

async function getDataCatechist(id, save) {
	if (save) {
		objects.catechist.setData(
			document.querySelector("#edit-first-name-catechist").value,
			document.querySelector("#edit-last-name-catechist").value
		);
	}
	else {
		const catechist = await CatequistaService.findByIdCatequista(id);
		objects.catechist.id = catechist.id;
		document.querySelector("#edit-first-name-catechist").value = catechist.firstName;
		document.querySelector("#edit-last-name-catechist").value = catechist.lastName;
	}
}

function changeStepCatechist(e) {
	const id = e.target.closest('.card')?.getAttribute('data-id');
}

function removeCatechist(e) {
	const id = e.target.closest('.card')?.getAttribute('data-id');
}

async function openModalEditCatechist(e) {
	const id = e.target.closest('.card')?.getAttribute('data-id');
	dom.editCatechist.modalEditCatechist.style.display = 'flex';
	await getDataCatechist(id, false);
}

function closeModalEditCatechist() {
	dom.editCatechist.modalEditCatechist.style.display = 'none';
}