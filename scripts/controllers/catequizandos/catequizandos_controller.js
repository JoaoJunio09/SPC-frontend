import { CatequizandoService } from '../../services/catequizando_service.js';
import { EtapaService } from '../../services/etapa_service.js';
import { Toast } from '../../utils/toast.js';
import { Loading } from '../../utils/loading.js';
import { loadTemplate } from '../../utils/template_loader.js';
import { rendererCatechuments } from '../../renderers/catechuments_renderer.js';
import { formatStep } from '../../utils/format_step.js';
import { verifyAuth } from '../../auth/verify_auth.js';

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
	verifyAuth();

	await loadTemplate("../../../templates/loading.html");
	await loadTemplate("../../../templates/catechumens_template.html");

	Loading.showLoading();

	try {
		console.log(sessionStorage.getItem('nameCommunityOrParish'))
		const steps = await EtapaService.findByNameCommunityOrParish(sessionStorage.getItem('nameCommunityOrParish'));
		loadCatechistsAndStepsInTheFilter(steps);
	}
	catch (e) {
		console.log(e);
		Toast.showToast({ 
			message: 'Não foi possível carregar os dados de filtragem', 
			type: 'error' 
		});

		// setTimeout(() => {
		// 	window.location.href = '../../../index.html';
		// }, 5000);
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

	Loading.showLoading();
	await filter()
		.then(() => Loading.hideLoading())
		.catch(err => showToast({
			message: 'Erro ao filtrar catequizandos',
			type: 'error'
		}));
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

function loadCatechistsAndStepsInTheFilter(steps) {

	let array_names_catechists = [];

	steps.forEach(step => {
		if (step.catequistas.length === 1) {
			step.catequistas.forEach(catechist => {
				dom.filter_step_and_catechist.innerHTML += `
					<option value="${step.etapa}-${catechist.firstName}">
						${formatStep(step.etapa)} - ${catechist.firstName+" "+catechist.lastName}
					</option>
				`;
			});
		}
		else if (step.catequistas.length > 1) {
			step.catequistas.forEach(catechist => {
				array_names_catechists.push(catechist.firstName);
			});

			const [value, textOption] = defineValueAndOptionOfCatechists(array_names_catechists, step);

			dom.filter_step_and_catechist.innerHTML += `
				<option value="${value}">
					${textOption}
				</option>
			`;
		};
	});
}

function defineValueAndOptionOfCatechists(names, step) {
	let value = "";
	let textOption = "";

	for (let i = 0; i < names.length; i++) {
		if (i === 0) {
			textOption = formatStep(step.etapa) + " - ";
			value += `${step.etapa}-${names[0]}`;
		}

		names.length - i === 1 
			? textOption += `${names[i]}`
			: textOption += `${names[i]} & `;
	}

	return [value, textOption];
}