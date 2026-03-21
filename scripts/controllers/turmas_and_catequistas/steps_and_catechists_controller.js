import { rendererCardCatechists } from '../../renderers/steps_and_catechists/card_catechists_renderer.js';
import { rendererCardSteps } from '../../renderers/steps_and_catechists/card_steps_renderer.js';
import { rendererCardViewCatechumens } from '../../renderers/steps_and_catechists/card_view_catechumens_renderer.js';
import { CatequistaService } from '../../services/catequista_service.js';
import { EtapaService } from '../../services/etapa_service.js';
import { CatequizandoService } from '../../services/catequizando_service.js';
import { Loading } from '../../utils/loading.js';
import { loadTemplate } from '../../utils/template_loader.js';
import { Toast } from '../../utils/toast.js';

class TheCatechistDataIsNull extends Error {
	constructor(message) {
		super(message);
		this.name = "TheCatechistDataIsNull";
	}
}

class Catechist {
	id = null;
	firstName = null;
	lastName = null;

	setData(firstName, lastName) {
		if (firstName === "" || lastName === "") {
			throw new TheCatechistDataIsNull("Preencha todas as informações");
		}
		this.firstName = firstName;
		this.lastName = lastName;
	}

	toJSON() {
		return {
			id: this.id,
			firstName: this.firstName,
			lastName: this.lastName
		}
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
		btnEdit: document.querySelector("#modalEditCatequista").querySelector(".btn-save"),
		btnCancel: document.querySelector("#modalEditCatequista").querySelector(".btn-cancel"),
	}
}

dom.editCatechist.btnCancel.addEventListener('click', () => {
	closeModalEditCatechist();
});

dom.editCatechist.btnEdit.addEventListener('click', async () => {
	await editCatechist();
});

document.addEventListener('DOMContentLoaded', async () => {
	await loadTemplate("../../../templates/loading.html");
	await loadTemplate("../../../templates/steps_and_catechists/card_catechists_template.html");
	await loadTemplate("../../../templates/steps_and_catechists/card_steps_template.html");
	await loadTemplate("../../../templates/steps_and_catechists/card_view_catechumens.html");
	await loadTemplate("../../../templates/steps_and_catechists/card_catechumens.html");

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
	initializeButtonsSteps();
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

function initializeButtonsSteps() {
	const btnsViewCatechumens = document.querySelectorAll(".btn-view-catechumens");

	btnsViewCatechumens.forEach(
		btn => btn.addEventListener('click', async (e) => await viewCatechumens(e))
	);
}

async function viewCatechumens(e) {
	const catechistName = e.target.closest('.card').getAttribute('catechist-firstName');
	const step = e.target.closest('.card').getAttribute('step');

	const catechumens = await CatequizandoService.filterCatechumensByCatechistNameAndStep(catechistName, step);

	rendererCardViewCatechumens(catechumens, step);
}

async function editCatechist() {
	try {
		getDataCatechist();

		await CatequistaService.updateCatequista(objects.catechist.toJSON());
		lists.catechists = await CatequistaService.findAllCatequistas();

		dom.listCatechists.innerHTML = "";
		loadCatechistsAndSteps(lists.catechists, lists.steps);

		Toast.showToast({
			message: 'Atualizado com sucesso',
			type: 'success'
		});

		closeModalEditCatechist();
	}
	catch (e) {
		if (e instanceof TheCatechistDataIsNull) {
			Toast.showToast({ 
				message: e.message, 
				type: 'error' 
			});
		}
	}
}

function getDataCatechist() {
	const firstName = document.querySelector("#edit-first-name-catechist").value;
	const lastName = document.querySelector("#edit-last-name-catechist").value
	
	objects.catechist.setData(
		firstName,
		lastName
	);
}

async function fillCatechistForm(id) {
	const catechist = await CatequistaService.findByIdCatequista(id);

	objects.catechist.id = catechist.id;

	document.querySelector("#edit-first-name-catechist").value = catechist.firstName;
	document.querySelector("#edit-last-name-catechist").value = catechist.lastName;
}

async function openModalEditCatechist(e) {
	dom.editCatechist.modalEditCatechist.style.display = 'flex';
	const id = e.target.closest('.card')?.getAttribute('data-id');
	await fillCatechistForm(id);
}

function closeModalEditCatechist() {
	dom.editCatechist.modalEditCatechist.style.display = 'none';
}