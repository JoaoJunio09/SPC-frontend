import { rendererCardSteps } from "../../../renderers/presence/register/card_steps_renderer.js";
import { rendererCardCatechumens } from "../../../renderers/presence/register/card_catechumens_renderer.js";
import { loadTemplate } from "../../../utils/template_loader.js";
import { Toast } from "../../../utils/toast.js";
import { StepService } from "../../../services/step_service.js";
import { CatechumenService } from "../../../services/catechumen_service.js";
import { PresenceService } from "../../../services/presence_service.js";
import { MassService } from "../../../services/mass_service.js";
import { Loading } from "../../../utils/loading.js";

const isSearch = {
	is: null,
	content: null
};

export const arrays = { catechumens: [], catechumensPresent: [], catechumensWithBlockAbsenceButton: [] };

export const dom = {
	get containerListStep() 			 {return document.querySelector('#listSteps')},
	get containerListCatechumens() {return document.querySelector('#listCatechumens')},
	get toogleAccordion()          {return document.querySelector('#toggle-accordion')},
	get accordionContent()         {return document.querySelector('#accordionContent')},
	get countSelected() 				   {return document.querySelector('#countSelected')},
	get reset() 									 {return document.querySelector('#reset')},
	get search() 									 {return document.querySelector("#inputSearch")},
	get actionsFooter() 				   {return document.querySelector('#actions-footer')}
}; 

export async function init() {
	await loadTemplate("../../../../templates/presence/register/card_steps_template.html");
	await loadTemplate("../../../../templates/presence/register/card_catechumens_template.html");
	await loadTemplate("../../../../templates/loading.html");
	await renderSteps();

	Loading.showLoading();

	await checksExistinsPresence().then(() => Loading.hideLoading());

	if (sessionStorage.getItem('catechumensPresent') !== null) {
		if (sessionStorage.getItem('catechumensPresent').length > 0) {
			arrays.catechumensPresent = JSON.parse(sessionStorage.getItem('catechumensPresent'));
			dom.countSelected.innerText = arrays.catechumensPresent.length;
		}
	}
}

export async function checksExistinsPresence() {
	const titleMass = sessionStorage.getItem('massOfCalendarLiturgical');
	const catechumensIsPresent = await PresenceService.getAll({titleMass: titleMass});
	
	if (catechumensIsPresent) {
		arrays.catechumensWithBlockAbsenceButton = catechumensIsPresent;
	}
}

async function renderSteps() {
	const communityOrParish = sessionStorage.getItem('communityOrParish');
	const steps = await StepService.getAll({communityOrParish: communityOrParish});
	rendererCardSteps(steps, dom.containerListStep);
}

export async function handleListCatechumens(stepId) {
	arrays.catechumens = await CatechumenService.getAll({stepId: stepId});

	dom.accordionContent.style.maxHeight = dom.accordionContent.scrollHeight  + "px";
	requestAnimationFrame(() => { dom.accordionContent.style.maxHeight = "0px" });
	
	await checksExistinsPresence();

	isSearch.is = null;
	isSearch.content = null;

	rendererCardCatechumens(arrays.catechumens, dom.containerListCatechumens, isSearch);
}

export async function search(fullName) {
	arrays.catechumens = await CatechumenService.getAll({fullName: fullName});

	isSearch.is = true;
	isSearch.content = fullName;

	rendererCardCatechumens(arrays.catechumens, dom.containerListCatechumens, isSearch);
}

export async function proceedReview() {
	await checksExistinsPresence();
	if (arrays.catechumensPresent.length === 0) {
		Toast.showToast({
      message: 'Selecione ao menos 1 catequizando',
      type: 'info'
    });
		return;
	}
	sessionStorage.setItem("catechumensPresent", JSON.stringify(arrays.catechumensPresent));
  window.location.href = 'confirmarPresenca.html';
}

export function markPresence(catechumenJSON) {
	const catechumen = JSON.parse(catechumenJSON);
	const isPresent = arrays.catechumensPresent.some(catechumenPresent => catechumenPresent.id === catechumen.id);

	if (isPresent) {
		return false;
	}
	else {
		arrays.catechumensPresent.push(catechumen);
		sessionStorage.setItem('catechumensPresent', arrays.catechumensPresent);
		rendererCardCatechumens(arrays.catechumens, dom.containerListCatechumens, isSearch);
		return true;
	}
}

export function markAbsence(catechumenJSON) {
	const catechumen = JSON.parse(catechumenJSON);
	arrays.catechumensPresent = arrays.catechumensPresent.filter(
		c => c.id !== catechumen.id
	);
	sessionStorage.setItem('catechumensPresent', arrays.catechumensPresent);
	rendererCardCatechumens(arrays.catechumens, dom.containerListCatechumens, isSearch);
	return true;
}