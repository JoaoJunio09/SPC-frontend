import { Toast } from "../../utils/toast.js";

const btnLogin = document.querySelector(".btn-login");

btnLogin.addEventListener('click', () => {
	login();
});

async function login() {
	const accessCode = document.querySelector("#access-code").value;
	let nameOfTheCommunityOrParish = "";

	if (accessCode < 1 || accessCode > 2) {
		Toast.showToast({ message: 'Digite um código válido', type: 'error' });
	};

	if (accessCode == 1){
		nameOfTheCommunityOrParish = "SAO_SEBASTIAO";
	} 
	
	if (accessCode == 2) {
		nameOfTheCommunityOrParish = "DIVINO_ESPIRITO_SANTO";
	}

	localStorage.setItem('nameCommunityOrParish', nameOfTheCommunityOrParish);

	if (nameOfTheCommunityOrParish !== "") location.href = 'index.html';
}