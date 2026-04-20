const BASE_URL_DEV = "http://localhost:8080"; 
const BASE_URL_PROD = "https://spc-springboot-production.up.railway.app";

let api = `${BASE_URL_PROD}/api/steps/v1`;

async function getAll({
	communityOrParish
}) {
	const URL = paramsAssembly(communityOrParish, api);
	const response = await fetch(URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter etapas [getAll]");
	}

	return await response.json();
}

function paramsAssembly(communityOrParish, api) {
	let params = new Map();

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

async function getById(stepId) {
	const URL = `${api}/${stepId}`;
	const response = await fetch(URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter etapa [getById]");
	}

	return await response.json();
}

async function create(step) {
	const response = await fetch(api, {
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(step)
	});

	if (!response.ok) {
		throw new Error("Erro ao salvar etapa [create]");
	}

	return await response.json();
}

async function update(step) {
	const response = await fetch(api, {
		'method': 'PUT',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(step)
	});

	if (!response.ok) {
		throw new Error("Erro ao atualizar etapa [update]");
	}

	return await response.json();
}

async function deleteStep(stepId) {
	const URL = `${api}/${stepId}`;
	const response = await fetch(URL, {
		'method': 'DELETE',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter etapa [delete]");
	}

	return response.status;
}

export const StepService = {
	getAll,
	getById,
	create,
	update,
	delete: deleteStep
};