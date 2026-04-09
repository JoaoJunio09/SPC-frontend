import { MassService } from "../../services/mass_service.js";
import { PresencaService } from "../../services/presenca_service.js";

document.querySelector('.btn-logout').addEventListener('click', () => {
	clearAllCaches();
	sessionStorage.setItem('nameCommunityOrParish', '');
	location.href = 'login.html';
});

function clearAllCaches() {
	MassService.clearCache();
	PresencaService.clearCache();
}