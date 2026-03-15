import { CatequizandoService } from '../../services/catequizando_service.js';
import { CatequistaService } from '../../services/catequista_service.js';
import { EtapaService } from '../../services/etapa_service.js';
import { MissaService } from '../../services/missa_service.js';
import { PresencaService } from '../../services/presenca_service.js';
import { MessageModal } from '../../utils/modal_message.js';
import { Toast } from '../../utils/toast.js';
import { Loading } from '../../utils/loading.js';
import { loadTemplate } from '../../utils/template_loader.js';

const dom = {
	filter_step: document.getElementById("filtro-etapa"),
	filter_catechist: document.getElementById("filtro-catequista"),
};

document.addEventListener('DOMContentLoaded', async () => {
	await loadTemplate("../../../templates/loading.html");

	Loading.showLoading();

	try {
		const [catechists, steps] = await Promise.all([
			CatequistaService.findAllCatequistas(),
			EtapaService.findAllEtapa()
		]);

		loadStepsAndCatechistsInTheFilter(catechists, steps);
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

function loadStepsAndCatechistsInTheFilter(catechists, steps) {
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