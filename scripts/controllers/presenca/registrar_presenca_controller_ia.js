import { EtapaService } from "../../services/etapa_service.js";
import { CatequizandoService } from "../../services/catequizando_service.js";
import { Toast } from "../../utils/toast.js";
import { formatStep } from "../../utils/format_step.js";

let presencasSelecionadas = [];
let catequizandos = [];

export function initPresenca() {
  const salvas = sessionStorage.getItem("presencasSelecionadas");
  if (salvas) {
    presencasSelecionadas = JSON.parse(salvas);
    atualizarContador();
  }

  renderTurmas();
  window.toggleAccordion = toggleAccordion;
  window.listarCatequizandos = listarCatequizandos;
  window.marcarPresenca = marcarPresenca;
  window.marcarAusencia = marcarAusencia;
  window.filtrarCatequizando = filtrarCatequizando;
  window.irParaRevisao = irParaRevisao;
  window.resetarPagina = resetarPagina;
}

async function renderTurmas() {
  const turmas = await EtapaService.findByNameCommunityOrParish(sessionStorage.getItem('nameCommunityOrParish'));

  const container = document.getElementById('listaTurmas');

  turmas.forEach(turma => {
    let catechistName = "";

    if (turma.catequistas.length === 1) {
      catechistName = turma.catequistas[0].firstName+" "+turma.catequistas[0].lastName;
    }
    else {
      for (let i = 0; i < turma.catequistas.length; i++) {
        turma.catequistas.length - i === 1 
          ? catechistName += `${turma.catequistas[i].firstName}`
          : catechistName += `${turma.catequistas[i].firstName} e `;
      }
    }

    container.innerHTML += `
      <div class="turma-card" data-id="${turma.id}">
        <h4>${formatStep(turma.etapa)}</h4>
        <p>Catequista: ${catechistName}</p>
        <button class="btn-list-students" onclick="listarCatequizandos(${turma.id}, '${turma.etapa}')">
          Listar Catequizandos
        </button>
      </div>
    `;
  });
}

function toggleAccordion() {
  const content = document.getElementById('accordionContent');
  content.classList.toggle('open');
}

async function listarCatequizandos(etapaId, nomeTurma) {
  document.getElementById('accordionContent').classList.remove('open');

	catequizandos = await CatequizandoService.findByEtapaIdAndNameCommunityOrParish(etapaId, sessionStorage.getItem('nameCommunityOrParish'));
  console.log(catequizandos)
  renderList(catequizandos, `Turma: ${formatStep(nomeTurma)}`);
}

async function filtrarCatequizando() {
  const firstName = document.getElementById('inputBusca').value.toLowerCase();
  if (firstName.length < 1) return;

  catequizandos = await CatequizandoService.searchByFirstNameCatequizando(firstName);

  renderList(catequizandos, "Resultados da Busca");
  document.getElementById('accordionContent').classList.remove('open');
}

function renderList(catequizandos, titulo) {
  const container = document.getElementById('listaCatequizandos');
  document.getElementById('tituloListagem').innerText = titulo;
  document.getElementById('attendanceSection').style.display = 'block';

  catequizandos.forEach(catequizando => {
    let catechistName = "";

    if (catequizando.etapa.catequistas.length === 1) {
      catechistName = catequizando.etapa.catequistas[0].firstName+" "+catequizando.etapa.catequistas[0].lastName;
    }
    else {
      for (let i = 0; i < catequizando.etapa.catequistas.length; i++) {
        catequizando.etapa.catequistas.length - i === 1 
          ? catechistName += `${catequizando.etapa.catequistas[i].firstName}`
          : catechistName += `${catequizando.etapa.catequistas[i].firstName} e `;
      }
    }

    const estaPresente = presencasSelecionadas.some(p => p.catequizandoId === catequizando.id);

    container.innerHTML += `
      <div class="catequizando-card" data-id="${catequizando.id}" data-etapa-id="${catequizando.etapa.id}">
        <div class="student-info">
          <h4>${catequizando.firstName+" "+catequizando.lastName}</h4>
          <p>${formatStep(catequizando.etapa.etapa)} | Catequista: ${catechistName}</p>
        </div>
        <div class="attendance-controls">
          <button class="btn-toggle presente ${estaPresente ? 'active' : ''}" 
                onclick="marcarPresenca(${catequizando.id}, ${localStorage.getItem('missaId')}, '${catequizando.firstName}', '${catequizando.etapa.etapa}', '${catechistName}')">
            <i data-lucide="check"></i> Presença
          </button>
          <button class="btn-toggle ausente ${!estaPresente ? 'active' : ''}" 
                onclick="marcarAusencia(${catequizando.id})">
            Ausência
          </button>
        </div>
      </div>
    `;
  });

  if(window.lucide) lucide.createIcons();
}

function marcarPresenca(id, missaId, catequizandoName, etapaName, catequistaName) {
  if (!presencasSelecionadas.some(p => p.catequizandoId === id)) {
    presencasSelecionadas.push({ 
      catequizandoId: id, 
      missaId: missaId, 
      status: 'PRESENTE', 
      justification: null, 
      catequizandoName: catequizandoName,
      etapaName: etapaName,
      catequistaName: catequistaName
    });
  }
  atualizarUI();
}

function marcarAusencia(id) {
  presencasSelecionadas = presencasSelecionadas.filter(p => p.catequizandoId !== id);
  console.log(presencasSelecionadas)
  atualizarUI();
}

async function atualizarUI() {
  atualizarContador();
  const currentTitle = document.getElementById('tituloListagem').innerText;
  if (currentTitle === "Resultados da Busca") {
    filtrarCatequizando();
  } 
	else {
		const catequizandoName = document.querySelector('#listaCatequizandos').querySelector('h4').innerText;

		const etapa = catequizandos.find(c => c.firstName+" "+c.lastName === catequizandoName).etapa;

    if(etapa.id) {
      // const etapa = await CatequizandoService.findByEtapaIdAndNameCommunityOrParish(etapa.id, sessionStorage.getItem('nameCommunityOrParish'));
      listarCatequizandos(etapa.id, etapa.etapa);
    }
  }
}

function atualizarContador() {
  const el = document.getElementById('countSelected');
  if(el) el.innerText = presencasSelecionadas.length;
}

function irParaRevisao() {
  if (presencasSelecionadas.length === 0) {
		Toast.showToast({
      message: 'Selecione ao menos 1 catequizando',
      type: 'info'
    });
		return;
  }
  sessionStorage.setItem("presencasSelecionadas", JSON.stringify(presencasSelecionadas));
  window.location.href = 'confirmarPresenca.html';
}

function resetarPagina() {
  presencasSelecionadas = [];
  sessionStorage.removeItem("presencasSelecionadas");
  location.reload();
}