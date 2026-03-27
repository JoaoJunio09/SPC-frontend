import { Toast } from "../../utils/toast.js";

const btnLogin = document.querySelector(".btn-login");

btnLogin.addEventListener('click', () => {
	login();
});

async function login() {
	const accessCode = document.querySelector("#access-code").value;
	let nameOfTheCommunityOrParish = "";

	if (accessCode == 0){
		nameOfTheCommunityOrParish = "SAO_SEBASTIAO";
	}
	else if (accessCode == 1) {
		nameOfTheCommunityOrParish = "DIVINO_ESPIRITO_SANTO";
	}
	else {
		Toast.showToast({ message: 'Digite um código válido', type: 'error' });
		return;
	}

	sessionStorage.setItem('nameCommunityOrParish', nameOfTheCommunityOrParish);

	if (nameOfTheCommunityOrParish !== "") location.href = 'index.html';
}