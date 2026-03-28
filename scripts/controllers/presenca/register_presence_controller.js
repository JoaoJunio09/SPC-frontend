import { rendererCardSteps } from "../../renderers/presence/card_steps_renderer.js";
import { loadTemplate } from "../../utils/template_loader.js";
import { EtapaService } from "../../services/etapa_service.js";

export const dom = {
	get containerListStep() {
		return document.querySelector("#listSteps");
	},
	get toogleAccordion() {
		return document.querySelector("#toggle-accordion");
	}
};

export async function init() {
	await loadTemplate("../../../templates/presence/card_steps.html");
	await renderSteps();
}

async function renderSteps() {
	const steps = await EtapaService.findByNameCommunityOrParish(sessionStorage.getItem('nameCommunityOrParish'));
	rendererCardSteps(steps, dom.containerListStep);
}

export async function handleListCatechumens(stepId) {
	console.log(stepId);
}