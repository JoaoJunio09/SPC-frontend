import { rendererCardCatechumen } from "./card_catechumens_renderer.js";

export function rendererCardViewCatechumens(catechumens, step) {
	const template = document.getElementById("card-view-catechumens-template");
	const frag = template.content.cloneNode(true);
	const modal = frag.querySelector(".modal-overlay");
	const list = modal.querySelector("#list-catechumens");

	modal.addEventListener('click', (e) => {
		if (e.target.id === "btn-cancel") closeModal(modal);
	});

	openModal(modal, step);

	rendererCardCatechumen(list, catechumens)
		
	document.body.appendChild(modal);
}

function openModal(modal, step) {
	modal.style.display = 'flex';
	modal.querySelector('#view-steps-title').innerText = `Catequizandos: ${step}`;
}

function closeModal(modal) {
	modal.style.display = 'none';
}
// DEPOIS DE LISTAR OS CATEQUIZANDOS, DEVO ABRIR O MODAL PARA EXIBIR OS DADOS
// A PRESENÇA DO CATEQUIZANDO DEVE SER REGISTRADA APENAS 1 VEZ NO FINAL DE SEMAMA
// ISSO PORQUE, SE EU COLOCAR PRESENÇA PRA UM CATEQUIZANDO NA MISSA DO SABADO
// OS QUE NÃO VIERAM NA DO SABADO, MAS VAO VIR NA DO DOMINGO, VÃO FICAR COM AUSENCIA NO SABADO
// E PRESENÇA NO DOMINGO, E VICE-VERSA
// DEVO IMPLEMENTAR UM CÓDIGO DE IDENTIFICAÇÃO DAS MISSAS DA SEMANA (SEM SER O ID)
// PARA VERIFICAR, EX: 2 MISSAS COM O MESMO CÓDIGO (apt09b) -> SIGNIFICAM QUE FAZEM PARTE DE UM FINAL DE SEMANA, OU MELHOR:
// É A MESMA MISSA.
// O CADASTRO DE MISSA NO SISTEMA É DIFERENCIADO PELO ID, MAS A IDENTIFICAÇÃO DAS MISSAS QUE VÃO ACONTECER EM DIAS OU HORÁRIOS DIFERENTES
// DEVEM SER IDENTIFICADAS COM UM CÓDIGO DE IDENTIFICAÇÃO.
// A IDÉIA É QUE: QUANDO EU FOR REGISTRAR A PRESENÇA, DEVO VERIFICAR OS CATEQUIZANDOS QUE JÁ PARTICIPARAM DESSA MESMA MISSA
// EM OUTRO DIA, ESSA VERIFICAÇÃO VAI ACONTECER DE ACORDO COM O IDENTIFICADOR DAS MISSAS QUE SÃO IGUAIS.
// OU CATEQUIZANDOS QUE POSSUIREM PRESENÇA REGISTRADA COM O MESMO CÓDIGO IDENTIFICADOR DA MISSA QUE SERÁ REGISTRADA PRESENÇA AINDA
// ELES DEVEM SER MARCADOS COMO "PRESENTES" E TAMBÉM NÃO PODEM SER REGISTRADOS COMO PRESENTES OU AUSENTES