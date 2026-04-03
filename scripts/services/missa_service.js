const BASE_URL_PROD  = "https://spc-springboot-production.up.railway.app";
const BASE_URL_DEV = "http://localhost:8080";

const FIND_ALL_MISSAS_URL = `${BASE_URL_PROD}/api/missas/v1`;
const FIND_BY_ID_MISSA_URL = `${BASE_URL_PROD}/api/missas/v1/{missaId}`;
const FIND_BY_NAME_COMMUNITY_OR_PARISH_MISSAS_URL = `${BASE_URL_PROD}/api/missas/v1/find-by?communityOrParish={nameCmmunityOrParish}`;
const FIND_BY_OCCURRED_TO_THIS_TODAY_MISSAS_URL = `${BASE_URL_PROD}/api/missas/v1/findByOccurredToThisToday`;
const FIND_ALL_MASSES_DATES_BY_COMMUNITY_OR_PARISH_URL = `${BASE_URL_PROD}/api/missas/v1/find-by/masses-dates?communityOrParish={nameCmmunityOrParish}`;
const CREATE_MISSA_URL = `${BASE_URL_PROD}/api/missas/v1`;
const UPDATE_MISSA_URL = `${BASE_URL_PROD}/api/missas/v1`;
const DELETE_MISSA_URL = `${BASE_URL_PROD}/api/missas/v1/{missaId}`;

async function findAll() {
	const response = await fetch(FIND_ALL_MISSAS_URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter missas [findAll]");
	}

	return await response.json();
}

async function findById(missaId) {
	const url = FIND_BY_ID_MISSA_URL.replace('{missaId}', missaId);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter missa [findById]");
	}

	return await response.json();
}

async function findByNameCommunityOrParish(nameCmmunityOrParish) {
	const url = FIND_BY_NAME_COMMUNITY_OR_PARISH_MISSAS_URL.replace('{nameCmmunityOrParish}', nameCmmunityOrParish);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter missas [findByNameCommunityOrParish]");
	}

	return await response.json();
}

async function findByOccurredToThisToday() {
	const response = await fetch(FIND_BY_OCCURRED_TO_THIS_TODAY_MISSAS_URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter missas [findByOccurredToThisToday]");
	}

	return await response.json();
}

async function findAllMassesDatesByCommunityOrParish(nameCmmunityOrParish) {
	const url = FIND_ALL_MASSES_DATES_BY_COMMUNITY_OR_PARISH_URL.replace('{nameCmmunityOrParish}', nameCmmunityOrParish);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter missas [findAllMassesDatesByCommunityOrParish]");
	}

	return await response.json();
}

async function create(missa) {
	const response = await fetch(CREATE_MISSA_URL, {
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(missa)
	});

	if (!response.ok) {
		throw new Error("Erro ao salvar missa [create]");
	}

	return await response.json();
}

async function update(missa) {
	const response = await fetch(UPDATE_MISSA_URL, {
		'method': 'PUT',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(missa)
	});

	if (!response.ok) {
		throw new Error("Erro ao atualizar missa [update]");
	}

	return await response.json();
}

async function deleteMissa(missaId) {
	const url = DELETE_MISSA_URL.replace('{missaId}', missaId);
	const response = await fetch(url, {
		'method': 'DELETE',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter missa [findById]");
	}

	return response.status;
}

export const MissaService = {
	findAllMissa: findAll,
	findByIdMissa: findById,
	findByNameCommunityOrParish: findByNameCommunityOrParish,
	findByOccurredToThisTodayMissa: findByOccurredToThisToday,
	findAllMassesDatesByCommunityOrParish: findAllMassesDatesByCommunityOrParish,
	createMissa: create,
	updateMissa: update,
	deleteMissa: deleteMissa
};