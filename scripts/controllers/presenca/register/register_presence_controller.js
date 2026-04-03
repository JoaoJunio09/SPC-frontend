import { rendererCardSteps } from "../../../renderers/presence/register/card_steps_renderer.js";
import { rendererCardCatechumens } from "../../../renderers/presence/register/card_catechumens_renderer.js";
import { loadTemplate } from "../../../utils/template_loader.js";
import { Toast } from "../../../utils/toast.js";
import { EtapaService } from "../../../services/etapa_service.js";
import { CatequizandoService } from "../../../services/catequizando_service.js";
import { PresencaService } from "../../../services/presenca_service.js";
import { MissaService } from "../../../services/missa_service.js";
import { Loading } from "../../../utils/loading.js";

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

	if (sessionStorage.getItem('catechumensPresent').length > 0) {
		arrays.catechumensPresent = JSON.parse(sessionStorage.getItem('catechumensPresent'));
		dom.countSelected.innerText = arrays.catechumensPresent.length;
	}
}

async function checksExistinsPresence() {
	const massRegisteredLiturgicalCalendar = sessionStorage.getItem('missaDoCalendarioLiturgico');
	const catechumensAlreadyPresent = await PresencaService.findAllPresenca();

	catechumensAlreadyPresent.forEach(async presence => {
		const mass = await MissaService.findByIdMissa(presence.missa.id);

		if (mass.title === massRegisteredLiturgicalCalendar) {
			const catechumen = await CatequizandoService.findByIdCatequizando(presence.catequizando.id);
			arrays.catechumensWithBlockAbsenceButton.push(catechumen);
		}
	});
}

async function renderSteps() {
	const steps = await EtapaService.findByNameCommunityOrParish(sessionStorage.getItem('nameCommunityOrParish'));
	rendererCardSteps(steps, dom.containerListStep);
}

export async function handleListCatechumens(stepId) {
	arrays.catechumens = await CatequizandoService.findByStepId(stepId);

	dom.accordionContent.style.maxHeight = dom.accordionContent.scrollHeight  + "px";
	requestAnimationFrame(() => { dom.accordionContent.style.maxHeight = "0px" });
	
	await checksExistinsPresence();
	rendererCardCatechumens(arrays.catechumens, dom.containerListCatechumens);
}

export async function search(value) {
	arrays.catechumens = await CatequizandoService.searchByNameCatequizando(value);
	await checksExistinsPresence();
	rendererCardCatechumens(arrays.catechumens, dom.containerListCatechumens);
}

export function proceedReview() {
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
		rendererCardCatechumens(arrays.catechumens, dom.containerListCatechumens);
		return true;
	}
}

export function markAbsence(catechumenJSON) {
	const catechumen = JSON.parse(catechumenJSON);
	arrays.catechumensPresent = arrays.catechumensPresent.filter(
		c => c.id !== catechumen.id
	);
	sessionStorage.setItem('catechumensPresent', arrays.catechumensPresent);
	rendererCardCatechumens(arrays.catechumens, dom.containerListCatechumens);
	return true;
}