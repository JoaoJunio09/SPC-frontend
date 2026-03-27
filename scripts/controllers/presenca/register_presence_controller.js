import { EtapaService } from "../../services/etapa_service.js";

export const dom = {
	__containerListStep: document.querySelector("#listSteps"),
	toogleAccordion: document.querySelector("#toggle-accordion"),
};

export async function init() {
	await renderSteps();
}

async function renderSteps() {
	const steps = await EtapaService.findByNameCommunityOrParish(sessionStorage.getItem('nameCommunityOrParish'));
	console.log(steps);

	// CRIAR TEMPLATES PARA RENDERIZAR TURMAS.
}