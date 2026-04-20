const BASE_URL_DEV = "http://localhost:8080";
const BASE_URL_PROD = "https://spc-springboot-production.up.railway.app";

let api = `${BASE_URL_PROD}/api/catechumens/v1`;

async function getAll({
	fullName,
	stepId,
	catechistId,
	communityOrParish
}) {
	const URL = paramsAssembly(fullName, stepId, catechistId, communityOrParish, api);
	const response = await fetch(URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter catequizandos [getAll]");
	}

	return await response.json();
}

function paramsAssembly(fullName, stepId, catechistId, communityOrParish, api) {
	let params = new Map();

	if (fullName !== undefined) params.set('fullName', fullName);
	if (stepId !== undefined) params.set('stepId', stepId);
	if (catechistId !== undefined) params.set('catechistId', catechistId);
	if (communityOrParish !== undefined) params.set('communityOrParish', communityOrParish);

	api = addParamsToRequest(params, api);
	api = removeLastCaracterOfApi(api);

	return api;
}

function addParamsToRequest(params, api) {
	if (params.size === 0) return api;

	api += `?`;

	if (params.size === 1) {
		for (let [key, value] of params) {
			api += `${key}=${value}`;
		}
		return api;
	}

	for (let [key, value] of params) {
		api += `${key}=${value}&`;
	}

	return api;
}

function removeLastCaracterOfApi(api) {
	if (api.slice(-1) === "&") {
		api = api.slice(0, -1);
	}
	return api;
}

async function getById(id) {
	const URL = `${api}/${id}`;
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter catequizando [getById]");
	}

	return await response.json();
}

async function findByStepId(etapaId) {
	const url = FIND_BY_ETAPA_ID_AND_NAME_COMMUNITY_OR_PARISH_URL.replace('{id}', etapaId);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter catequizandos [findByEtapaIdAndNameCommunityOrParish]");
	}

	return await response.json();
}

async function create(catechumen) {
	const response = await fetch(api, {
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(catechumen)
	});

	if (!response.ok) {
		throw new Error("Erro ao salvar catequizando [create]");
	}

	return await response.json();
}

async function update(catechumen) {
	const response = await fetch(api, {
		'method': 'PUT',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(catechumen)
	});

	if (!response.ok) {
		throw new Error("Erro ao atualizar catequizando [update]");
	}

	return await response.json();
}

async function deleteCatechumen(id) {
	const URL = `${api}/${id}`;
	const response = await fetch(url, {
		'method': 'DELETE'
	});

	if (!response.ok) {
		throw new Error("Erro ao obter catequizando [delete]");
	}

	return response.status;
}

export const CatechumenService = {
	getAll,
	getById,
	create,
	update,
	delete: deleteCatechumen
};