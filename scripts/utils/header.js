function toggleMenu() {
	const nav = document.getElementById('mainNav');
	const btn = document.getElementById('btnMenu');
	
	// Alterna a classe 'open' que controla o CSS
	nav.classList.toggle('open');

	// Atualiza o texto do botão para dar feedback visual
	if (nav.classList.contains('open')) {
		btn.innerHTML = '✕ FECHAR';
	} else {
		btn.innerHTML = '☰ MENU';
	}
}

function initSystem() {
	const systemNameLogin = document.querySelector(".system-title p");
	const welcome = document.querySelector('.welcome');
	if (sessionStorage.getItem('nameCommunityOrParish') === "SAO_SEBASTIAO") {
		systemNameLogin.innerHTML = 'Paróquia <strong>São Sebastião</strong>';
	}
	else {
		systemNameLogin.innerHTML = 'Capela <strong>Divino Espírito Santo</strong>';
	}

	const catechist = JSON.parse(sessionStorage.getItem('catechist'));

	if (welcome) {
		welcome.innerHTML = `Olá, <strong>${catechist.firstName}</strong>`;
	}
}

document.querySelector("#btnMenu").addEventListener('click', () => {
	toggleMenu();
});

document.addEventListener('DOMContentLoaded', initSystem);