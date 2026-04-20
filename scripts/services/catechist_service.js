const BASE_URL_DEV = "http://localhost:8080";
const BASE_URL_PROD = "https://spc-springboot-production.up.railway.app";

let api = `${BASE_URL_PROD}/api/catechists/v1`;

async function getAll({
	stepId,
	fullName,
	communityOrParish
}) {
	const URL = paramsAssembly(stepId, fullName, communityOrParish, api);
	const response = await fetch(URL, {
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

function paramsAssembly(stepId, fullName, communityOrParish, api) {
	let params = new Map();

	if (stepId !== undefined) params.set('stepId', stepId);
	if (fullName !== undefined) params.set('fullName', fullName);
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
	const response = await fetch(URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter catequista [getById]");
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

async function deleteCatechist(id) {
	const URL = `${api}/${id}`;
	const response = await fetch(URL, {
		'method': 'DELETE'
	});

	if (!response.ok) {
		throw new Error("Erro ao deletar catequista [delete]");
	}

	return response.status;
}

export const CatechistService = {
	getAll,
	getById,
	create,
	create,
	delete: deleteCatechist
};