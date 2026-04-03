import { Toast } from "../../utils/toast.js";
import { CatequistaService } from '../../services/catequista_service.js';

const dom = {
	btnLogin: document.querySelector(".btn-login"),
	selectCatechists: document.querySelector('#select-catechists'),
};

const arrays = { catechists: [] };

document.addEventListener('DOMContentLoaded', async () => {
	await fillInSelectForCatechistsName();
});

dom.btnLogin.addEventListener('click', () => {
	login();
});

async function fillInSelectForCatechistsName() {
	arrays.catechists = await CatequistaService.findAllCatequistas();
	arrays.catechists.map(catechist => {
		dom.selectCatechists.innerHTML += `
			<option value="${catechist.firstName} ${catechist.lastName}">${catechist.firstName} ${catechist.lastName}</option>
		`;
	})
}

async function login() {
	try {
		const accessCode = document.querySelector("#access-code").value;
		const catechistFullNameSelected = document.querySelector("#select-catechists").value;
		let catechist = null;
		let nameOfTheCommunityOrParish = null;

		accessCode == 0
			? nameOfTheCommunityOrParish = "SAO_SEBASTIAO"
			: nameOfTheCommunityOrParish = "DIVINO_ESPIRITO_SANTO";

		arrays.catechists.forEach(c => {
			let fullName = c.firstName+" "+c.lastName;
			if (fullName === catechistFullNameSelected) {
				if (c.communityOrParish !== nameOfTheCommunityOrParish) {
					throw new Error('Catequista Inválido');
				}
				catechist = c;
			}
		});

		if (nameOfTheCommunityOrParish === null || catechist === null) {
			throw new Error('Informe todos os dados');
		}

		sessionStorage.setItem('nameCommunityOrParish', nameOfTheCommunityOrParish);
		sessionStorage.setItem('catechist', JSON.stringify(catechist));

		location.href = 'index.html';
	}
	catch (err) {
		Toast.showToast({ message: err.message, type: 'error' });
	}
}