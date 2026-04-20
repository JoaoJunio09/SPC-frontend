import { MassService } from "../../services/mass_service.js";
import { PresenceService } from "../../services/presence_service.js";

document.querySelector('.btn-logout').addEventListener('click', () => {
	clearAllCaches();
	sessionStorage.setItem('nameCommunityOrParish', '');
	location.href = 'login.html';
});

function clearAllCaches() {
	MassService.clearCache();
	PresenceService.clearCache();
}