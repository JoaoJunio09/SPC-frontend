import { CatequizandoService } from '../../services/catequizando_service.js';
import { CatequistaService } from '../../services/catequista_service.js';
import { EtapaService } from '../../services/etapa_service.js';
import { MessageModal } from '../../utils/modal_message.js';
import { Toast } from '../../utils/toast.js';
import { Loading } from '../../utils/loading.js';
import { loadTemplate } from '../../utils/template_loader.js';
import { rendererCatechuments } from '../../renderers/catechuments_renderer.js';
import { formatStep } from '../../utils/format_step.js';

const dom = {
	filter_step_and_catechist: document.getElementById("filter-step-and-catechist"),
	table: document.getElementById("tabela-dados"),
	tbody: document.getElementById("tabela-dados").querySelector('tbody'),
	emptyStateInitial: document.getElementById("estado-vazio-filtros"),
};

const filter_variables = {
	catechist_value: "",
	step_value: ""
}

document.addEventListener('DOMContentLoaded', async () => {
	await loadTemplate("../../../templates/loading.html");
	await loadTemplate("../../../templates/catechumens_template.html");

	// Loading.showLoading();

	try {
		const [catechists, steps] = await Promise.all([
			CatequistaService.findAllCatequistas(),
			EtapaService.findAllEtapa()
		]);

		loadCatechistsAndStepsInTheFilter(catechists, steps);
	}
	catch (e) {
		// setTimeout(() => {
		// 	window.location.href = '../../../index.html';
		// }, 5000);
		
		// Toast.showToast({ 
		// 	message: 'Não foi possível carregar os dados de filtragem', 
		// 	type: 'error' 
		// });
	}
	finally {
		Loading.hideLoading();
	}
});

dom.filter_step_and_catechist.addEventListener('input', async (e) => {
	const value = e.target.value.split('-');
	const step_value = value[0];
	const catechist_value = value[1];

	filter_variables.catechist_value = catechist_value;
	filter_variables.step_value = step_value;
	await filter();
});

async function filter() {
	if (filter_variables.catechist_value === "" || filter_variables.step_value === "") {
		return;
	}

	const catechist = filter_variables.catechist_value;
	const step = filter_variables.step_value;

	const catechumens = await CatequizandoService.filterCatechumensByCatechistNameAndStep(catechist, step);

	await rendererCatechuments(dom.emptyStateInitial, dom.table, dom.tbody, catechumens);
}

function loadCatechistsAndStepsInTheFilter(catechists, steps) {
	steps.forEach(step => {
		catechists.forEach(catechist => {
			if (catechist.stepOfCatechistResponseDTO.id === step.id) {
				dom.filter_step_and_catechist.innerHTML += `
					<option value="${step.etapa}-${catechist.firstName}">${formatStep(step.etapa)} - ${catechist.firstName+" "+catechist.lastName}</option>
				`;
			}
		});
	});
}