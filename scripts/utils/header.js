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
	if (localStorage.getItem('nameCommunityOrParish') == "SAO_SEBASTIAO") {
		systemNameLogin.innerHTML = 'Paróquia <strong>São Sebastião</strong>';
	}
	else {
		systemNameLogin.innerHTML = 'Capela <strong>Divino Espírito Santo</strong>';
	}
}

document.querySelector("#btnMenu").addEventListener('click', () => {
	toggleMenu();
});

document.addEventListener('DOMContentLoaded', initSystem);