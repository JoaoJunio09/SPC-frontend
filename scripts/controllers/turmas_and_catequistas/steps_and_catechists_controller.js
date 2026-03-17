import { rendererCardCatechists } from '../../renderers/card_catechists_renderer.js';
import { rendererCardSteps } from '../../renderers/card_steps_renderer.js';
import { CatequistaService } from '../../services/catequista_service.js';
import { EtapaService } from '../../services/etapa_service.js';
import { Loading } from '../../utils/loading.js';
import { loadTemplate } from '../../utils/template_loader.js';
import { Toast } from '../../utils/toast.js';

const dom = {
	listCatechists: document.querySelector("#lista-catequistas"),
	listSteps: document.querySelector("#lista-turmas"),
	listCatechumensOfSteps: document.querySelector("#lista-alunos-modal"),
}

document.addEventListener('DOMContentLoaded', async () => {
	await loadTemplate("../../../templates/loading.html");
	await loadTemplate("../../../templates/turmas_and_catequistas/card_catechists_template.html");
	await loadTemplate("../../../templates/turmas_and_catequistas/card_steps_template.html");

	// Loading.showLoading();

	try {
		const [catechists, steps] = await Promise.all([
			CatequistaService.findAllCatequistas(),
			EtapaService.findAllEtapa()
		]);

		loadCatechistsAndSteps(catechists, steps);
	}
	catch (e) {
		console.log(e)
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
}