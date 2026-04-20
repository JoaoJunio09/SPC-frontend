import { Toast } from "../../utils/toast.js";
import { CatechistService } from '../../services/catechist_service.js';

const dom = {
	btnLogin: document.querySelector(".btn-login"),
	selectCatechists: document.querySelector('#select-catechists'),
};

const arrays = { catechists: [] };

document.addEventListener('DOMContentLoaded', async () => {
	try {
		await fillInSelectForCatechistsName();
	}
	catch (err) {
		showToast({ message: 'Catequistas indisponíveis', type: 'info' });
	}
});

dom.btnLogin.addEventListener('click', () => {
	try {
		login();
	} 
	catch (err) {
		showToast({ message: 'Não foi possível efetuar login', type: 'error' });
	}
});

async function fillInSelectForCatechistsName() {
	arrays.catechists = await CatechistService.getAll({});
	arrays.catechists.map(catechist => {
		dom.selectCatechists.innerHTML += `
			<option value="${catechist.firstName} ${catechist.lastName}">${catechist.firstName} ${catechist.lastName}</option>
		`;
	})
}

async function login() {
	try {
		const accessCode = document.querySelector("#select-code").value;
		const catechistFullNameSelected = document.querySelector("#select-catechists").value;
		let catechist = null;
		let nameOfTheCommunityOrParish = null;

		if (accessCode === '0') {
			nameOfTheCommunityOrParish = "SAO_SEBASTIAO";
		} else if (accessCode === '1') {
			nameOfTheCommunityOrParish = "DIVINO_ESPIRITO_SANTO";
		}

		arrays.catechists.forEach(c => {
			let fullName = c.firstName+" "+c.lastName;
			if (fullName === catechistFullNameSelected) {
				if (c.communityOrParish !== nameOfTheCommunityOrParish) {
					throw new Error('Catequista Inválido');
				}
				catechist = c;
			}
		});

		if (nameOfTheCommunityOrParish !== null && catechist !== null) {
			sessionStorage.setItem('communityOrParish', nameOfTheCommunityOrParish);
			sessionStorage.setItem('catechist', JSON.stringify(catechist));

			location.href = 'index.html';
			//location.href = 'manutencao.html';
		}		
	}
	catch (err) {
		Toast.showToast({ message: err.message, type: 'error' });
	}
}