const BASE_URL_PROD = "https://spc-springboot-production.up.railway.app";
const BASE_URL_DEV = "http://localhost:8080";

const FIND_ALL_CATEQUISTAS_URL = `${BASE_URL_DEV}/api/catequistas/v1`;
const FIND_BY_ID_CATEQUISTA_URL = `${BASE_URL_DEV}/api/catequistas/v1/{catequistaId}`;
const FIND_BY_ETAPA_ID_CATEQUISTA_URL = `${BASE_URL_DEV}/api/catequistas/v1/findByEtapaId/{etapaId}`;
const CREATE_CATEQUISTA_URL = `${BASE_URL_DEV}/api/catequistas/v1`;
const UPDATE_CATEQUISTA_URL = `${BASE_URL_DEV}/api/catequistas/v1`;
const DELETE_CATEQUISTA_URL = `${BASE_URL_DEV}/api/catequistas/v1/{catequistaId}`;

async function findAll() {
	const response = await fetch(FIND_ALL_CATEQUISTAS_URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter catequistas [findAll]");
	}

	return await response.json();
}

async function findById(catequistaId) {
	const url = FIND_BY_ID_CATEQUISTA_URL.replace('{catequistaId}', catequistaId);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter catequista [findById]");
	}

	return await response.json();
}

async function findByEtapaId(etapaId) {
	const url = FIND_BY_ETAPA_ID_CATEQUISTA_URL.replace('{etapaId}', etapaId);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter catequista [findByEtapaId]");
	}

	return await response.json();
}

async function create(catequista) {
	const response = await fetch(CREATE_CATEQUISTA_URL, {
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(catequista)
	});

	if (!response.ok) {
		throw new Error("Erro ao salvar catequista [create]");
	}

	return await response.json();
}

async function update(catequista) {
	const response = await fetch(UPDATE_CATEQUISTA_URL, {
		'method': 'PUT',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(catequista)
	});

	if (!response.ok) {
		throw new Error("Erro ao atualizar catequista [update]");
	}

	return await response.json();
}

async function deleteCatequista(catequistaId) {
	const url = DELETE_CATEQUISTA_URL.replace('{catequistaId}', catequistaId);
	const response = await fetch(url, {
		'method': 'DELETE',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao deletar catequista [delete]");
	}

	return response.status;
}

export const CatequistaService = {
	findAllCatequistas: findAll,
	findByIdCatequista: findById,
	findByEtapaIdCatequista: findByEtapaId,
	createCatequista: create,
	updateCatequista: update,
	deleteCatequista: deleteCatequista
};