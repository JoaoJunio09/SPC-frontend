const BASE_URL = "http://localhost:8080"; // "https://spc-springboot-production.up.railway.app";

const FIND_ALL_ETAPAS_URL = `${BASE_URL}/api/etapas/v1`;
const FIND_BY_ID_ETAPA_URL = `${BASE_URL}/api/etapas/v1/{etapaId}`;
const FIND_BY_NAME_COMMUNITY_OR_PARISH_ETAPA_URL = `${BASE_URL}/api/etapas/v1/find-by?communityOrParish={nameCmmunityOrParish}`;
const CREATE_ETAPA_URL = `${BASE_URL}/api/etapas/v1`;
const UPDATE_ETAPA_URL = `${BASE_URL}/api/etapas/v1`;
const DELETE_ETAPA_URL = `${BASE_URL}/api/etapas/v1/{etapaId}`;

async function findAll() {
	const response = await fetch(FIND_ALL_ETAPAS_URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter etapas [findAll]");
	}

	return await response.json();
}

async function findById(etapaId) {
	const url = FIND_BY_ID_ETAPA_URL.replace('{etapaId}', etapaId);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter etapa [findById]");
	}

	return await response.json();
}

async function findByNameCommunityOrParish(nameCmmunityOrParish) {
	const url = FIND_BY_NAME_COMMUNITY_OR_PARISH_ETAPA_URL.replace('{nameCmmunityOrParish}', nameCmmunityOrParish);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter etapas [findByNameCommunityOrParish]");
	}

	return await response.json();
}

async function create(etapa) {
	const response = await fetch(CREATE_ETAPA_URL, {
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(etapa)
	});

	if (!response.ok) {
		throw new Error("Erro ao salvar etapa [create]");
	}

	return await response.json();
}

async function update(etapa) {
	const response = await fetch(UPDATE_ETAPA_URL, {
		'method': 'PUT',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(etapa)
	});

	if (!response.ok) {
		throw new Error("Erro ao atualizar etapa [update]");
	}

	return await response.json();
}

async function deleteEtapa(etapaId) {
	const url = DELETE_ETAPA_URL.replace('{etapaId}', etapaId);
	const response = await fetch(url, {
		'method': 'DELETE',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter etapa [findById]");
	}

	return response.status;
}

export const EtapaService = {
	findAllEtapa: findAll,
	findByIdEtapa: findById,
	findByNameCommunityOrParish: findByNameCommunityOrParish,
	createEtapa: create,
	updateEtapa: update,
	deleteEtapa: deleteEtapa
};