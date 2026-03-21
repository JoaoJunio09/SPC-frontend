const BASE_URL = "http://localhost:8080";

const FIND_ALL_MISSAS_URL = `${BASE_URL}/api/missas/v1`;
const FIND_BY_ID_MISSA_URL = `${BASE_URL}/api/missas/v1/{missaId}`;
const FIND_BY_OCCURRED_TO_THIS_TODAY_MISSAS_URL = `${BASE_URL}/api/missas/v1/findByOccurredToThisToday`;
const FIND_ALL_MASSES_DATES_URL = `${BASE_URL}/api/missas/v1/findAllMassesDates`;
const CREATE_MISSA_URL = `${BASE_URL}/api/missas/v1`;
const UPDATE_MISSA_URL = `${BASE_URL}/api/missas/v1`;
const DELETE_MISSA_URL = `${BASE_URL}/api/missas/v1/{missaId}`;

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

async function findAllMassesDates() {
	const response = await fetch(FIND_ALL_MASSES_DATES_URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter missas [findAllMassesDates]");
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
	findByOccurredToThisTodayMissa: findByOccurredToThisToday,
	findAllMassesDates: findAllMassesDates,
	createMissa: create,
	updateMissa: update,
	deleteMissa: deleteMissa
};