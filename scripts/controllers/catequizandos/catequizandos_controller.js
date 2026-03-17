import { CatequizandoService } from '../../services/catequizando_service.js';
import { CatequistaService } from '../../services/catequista_service.js';
import { EtapaService } from '../../services/etapa_service.js';
import { MissaService } from '../../services/missa_service.js';
import { PresencaService } from '../../services/presenca_service.js';
import { MessageModal } from '../../utils/modal_message.js';
import { Toast } from '../../utils/toast.js';
import { Loading } from '../../utils/loading.js';
import { loadTemplate } from '../../utils/template_loader.js';
import { rendererCatechuments } from '../../renderers/catechuments_renderer.js';

const dom = {
	filter_step: document.getElementById("filtro-etapa"),
	filter_catechist: document.getElementById("filtro-catequista"),
	table: document.getElementById("tabela-dados"),
	tbody: document.getElementById("tabela-dados").querySelector('tbody'),
	emptyStateInitial: document.getElementById("estado-vazio-filtros"),
};

const filter_variables = {
	catechist_value: "",
	step_value: ""
}

dom.filter_step.addEventListener('input', async (e) => {
	filter_variables.step_value = e.target.value;
	await filter();
});

dom.filter_catechist.addEventListener('input', async (e) => {
	filter_variables.catechist_value = e.target.value;
	await filter();
});

document.addEventListener('DOMContentLoaded', async () => {
	await loadTemplate("../../../templates/loading.html");
	await loadTemplate("../../../templates/catechumens_template.html");

	Loading.showLoading();

	try {
		const [catechists, steps] = await Promise.all([
			CatequistaService.findAllCatequistas(),
			EtapaService.findAllEtapa()
		]);

		loadCatechistsAndStepsInTheFilter(catechists, steps);
	}
	catch (e) {
		setTimeout(() => {
			window.location.href = '../../../index.html';
		}, 5000);
		
		Toast.showToast({ 
			message: 'Não foi possível carregar os dados de filtragem', 
			type: 'error' 
		});
	}
	finally {
		Loading.hideLoading();
	}
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

export async function proccessTheFrequencyOfCatechumens(catechumen) {
	const masses = await MissaService.findAllMissa();
	const massesToThisToday = await MissaService.findByOccurredToThisTodayMissa();
	const presencesOfCatechumen = await PresencaService.findByCatechumenIdPresenca(catechumen.id);

	const totalMasses = masses.length;
	const totalMassesToThisToday = massesToThisToday.length;
	const attendanceAtMasses = presencesOfCatechumen.length;

	return calculateFrequency(totalMasses, totalMassesToThisToday, attendanceAtMasses);
}

function calculateFrequency(totalMasses, totalMassesToThisToday, attendanceAtMasses) {

	const frequencyActual = (attendanceAtMasses * 100) / totalMassesToThisToday;
	const frequencyTotal = (attendanceAtMasses * 100) / totalMasses;;

	return [frequencyActual, frequencyTotal];
}

function loadCatechistsAndStepsInTheFilter(catechists, steps) {
	catechists.forEach(catechist => {
		dom.filter_catechist.innerHTML += `
			<option value="${catechist.firstName}">${catechist.firstName}</option>
		`;
	});

	steps.forEach(step => {
		dom.filter_step.innerHTML += `
			<option value="${step.etapa}">${step.etapa}</option>
		`;
	});
}