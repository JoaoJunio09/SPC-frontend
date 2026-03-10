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

document.querySelector("#btnMenu").addEventListener('click', () => {
	toggleMenu();
});