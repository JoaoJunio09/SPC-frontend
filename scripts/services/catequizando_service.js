const BASE_URL = "http://localhost:8080";

const FIND_ALL_CATEQUIZANDOS_URL = `${BASE_URL}/api/catequizandos/v1`;
const FIND_BY_ID_CATEQUIZANDO_URL = `${BASE_URL}/api/catequizandos/v1/{catequizandoId}`;
const FIND_BY_ETAPA_ID_CATEQUIZANDO_URL = `${BASE_URL}/api/catequizandos/v1/findByEtapaId/{etapaId}`;
const SEARCH_BY_FULLNAME_CATEQUIZANDO_URL = `${BASE_URL}/api/catequizandos/v1/search-by?firstName={firstName}`;
const CREATE_CATEQUIZANDO_URL = `${BASE_URL}/api/catequizandos/v1`;
const UPDATE_CATEQUIZANDO_URL = `${BASE_URL}/api/catequizandos/v1`;
const DELETE_CATEQUIZANDO_URL = `${BASE_URL}/api/catequizandos/v1/{catequizandoId}`;

async function findAll() {
	const response = await fetch(FIND_ALL_CATEQUIZANDOS_URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter catequizandos [findAll]");
	}

	return await response.json();
}

async function findById(catequizandoId) {
	const url = FIND_BY_ID_CATEQUIZANDO_URL.replace('{catequizandoId}', catequizandoId);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter catequizando [findById]");
	}

	return await response.json();
}

async function findByEtapaId(etapaId) {
	const url = FIND_BY_ETAPA_ID_CATEQUIZANDO_URL.replace('{etapaId}', etapaId);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter catequizando [findByEtapaId]");
	}

	return await response.json();
}

async function searchByFirstName(firstName) {
	const url = SEARCH_BY_FULLNAME_CATEQUIZANDO_URL.replace('{firstName}', firstName);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter catequizandos [searchByFirstName");
	}

	return await response.json();
}


async function create(catequizando) {
	const response = await fetch(CREATE_CATEQUIZANDO_URL, {
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(catequizando)
	});

	if (!response.ok) {
		throw new Error("Erro ao salvar catequizando [create]");
	}

	return await response.json();
}

async function update(catequizando) {
	const response = await fetch(UPDATE_CATEQUIZANDO_URL, {
		'method': 'PUT',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(catequizando)
	});

	if (!response.ok) {
		throw new Error("Erro ao atualizar catequizando [update]");
	}

	return await response.json();
}

async function deleteCatequizando(catequizandoId) {
	const url = DELETE_CATEQUIZANDO_URL.replace('{catequizandoId}', catequizandoId);
	const response = await fetch(url, {
		'method': 'DELETE',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter catequizando [findById]");
	}

	return response.status;
}

export const CatequizandoService = {
	findAllCatequizando: findAll,
	findByIdCatequizando: findById,
	findByEtapaIdCatequizando: findByEtapaId,
	searchByFirstNameCatequizando: searchByFirstName,
	createCatequizando: create,
	updateCatequizando: update,
	deleteCatequizando: deleteCatequizando
};