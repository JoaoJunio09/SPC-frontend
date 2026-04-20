import { CatechumenService } from '../../services/catechumen_service.js';
import { StepService } from '../../services/step_service.js';
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
	catechistId: null,
	stepId: null
}

document.addEventListener('DOMContentLoaded', async () => {
	verifyAuth();

	await loadTemplate("../../../templates/loading.html");
	await loadTemplate("../../../templates/catechumens_template.html");

	Loading.showLoading();

	try {
		const communityOrParish = sessionStorage.getItem('communityOrParish');
		const steps = await StepService.getAll({communityOrParish: communityOrParish});
		loadCatechistsAndStepsInTheFilter(steps);
	}
	catch (e) {
		Toast.showToast({ 
			message: 'Não foi possível carregar os dados de filtragem', 
			type: 'error' 
		});

		setTimeout(() => {
			window.location.href = '../../../index.html';
		}, 5000);
	}
	finally {
		Loading.hideLoading();
	}
});

dom.filter_step_and_catechist.addEventListener('input', async (e) => {
	const value = e.target.value.split('-');
	const step_value_id = value[0];
	const catechist_value_id = value[1];

	filter_variables.catechistId = catechist_value_id;
	filter_variables.stepId = step_value_id;

	Loading.showLoading();

	await filter()
		.then(() => Loading.hideLoading())
		.catch(err => showToast({
			message: 'Erro ao filtrar catequizandos',
			type: 'error'
		}));
});

async function filter() {
	if (filter_variables.catechistId === "" || filter_variables.stepId === "") {
		return;
	}

	const catechumens = await CatechumenService.getAll({stepId: filter_variables.stepId, catechistId: filter_variables.catechistId});

	await rendererCatechuments(dom.emptyStateInitial, dom.table, dom.tbody, catechumens);
}

function loadCatechistsAndStepsInTheFilter(steps) {
	let array_names_catechists_and_id = [];

	steps.forEach(step => {
		if (step.catechists.length === 1) {
			step.catechists.forEach(catechist => {
				dom.filter_step_and_catechist.innerHTML += `
					<option value="${step.id}-${catechist.id}">
						${formatStep(step.stepName)} - ${catechist.firstName+" "+catechist.lastName}
					</option>
				`;
			});
		}
		else if (step.catechists.length > 1) {
			step.catechists.forEach(catechist => {
				array_names_catechists_and_id.push({name: catechist.firstName, id: catechist.id});
			});

			const [value, textOption] = defineValueAndOptionOfCatechists(array_names_catechists_and_id, step);

			dom.filter_step_and_catechist.innerHTML += `
				<option value="${value}">
					${textOption}
				</option>
			`;
		};
	});
}

function defineValueAndOptionOfCatechists(namesAndId, step) {
	let value = "";
	let textOption = "";

	for (let i = 0; i < namesAndId.length; i++) {
		if (i === 0) {
			textOption = formatStep(step.stepName) + " - ";
			value += `${step.id}-${namesAndId[0].id}`;
		}

		namesAndId.length - i === 1 
			? textOption += `${namesAndId[i].name}`
			: textOption += `${namesAndId[i].name} & `;
	}

	return [value, textOption];
}