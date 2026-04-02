const BASE_URL_PROD = "https://spc-springboot-production.up.railway.app";
const BASE_URL_DEV = "http://localhost:8080";

const FIND_ALL_PRESENCAS_URL = `${BASE_URL_DEV}/api/presencas/v1`;
const FIND_BY_ID_PRESENCA_URL = `${BASE_URL_DEV}/api/presencas/v1/{presencaId}`;
const FIND_BY_CATECHUMEN_ID_PRESENCA_URL = `${BASE_URL_DEV}/api/presencas/v1/findByCatechumenId/{catechumenId}`;
const CREATE_PRESENCA_URL = `${BASE_URL_DEV}/api/presencas/v1`;
const UPDATE_PRESENCA_URL = `${BASE_URL_DEV}/api/presencas/v1`;
const DELETE_PRESENCA_URL = `${BASE_URL_DEV}/api/presencas/v1/{presencaId}`;

async function findAll() {
	const response = await fetch(FIND_ALL_PRESENCAS_URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter presenças [findAll]");
	}

	return await response.json();
}

async function findById(presencaId) {
	const url = FIND_BY_ID_PRESENCA_URL.replace('{presencaId}', presencaId);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter presença [findById]");
	}

	return await response.json();
}

async function findByCatechumenId(catechumenId) {
	const url = FIND_BY_CATECHUMEN_ID_PRESENCA_URL.replace('{catechumenId}', catechumenId);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter presença [findByCatechumenId]");
	}

	return await response.json();
}

async function create(presenca) {
	const response = await fetch(CREATE_PRESENCA_URL, {
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(presenca)
	});

	if (!response.ok) {
		throw new Error("Erro ao salvar presença [create]");
	}

	return await response.json();
}

async function update(presenca) {
	const response = await fetch(UPDATE_PRESENCA_URL, {
		'method': 'PUT',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(presenca)
	});

	if (!response.ok) {
		throw new Error("Erro ao atualizar presença [update]");
	}

	return await response.json();
}

async function deletePresenca(presencaId) {
	const url = DELETE_PRESENCA_URL.replace('{presencaId}', presencaId);
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

export const PresencaService = {
	findAllPresenca: findAll,
	findByIdPresenca: findById,
	findByCatechumenIdPresenca: findByCatechumenId,
	createPresenca: create,
	updatePresenca: update,
	deletePresenca: deletePresenca
};