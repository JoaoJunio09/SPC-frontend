import { EtapaService } from "../../services/etapa_service.js";
import { CatequizandoService } from "../../services/catequizando_service.js";

// Lista temporária em memória
let presencasSelecionadas = [];
let catequizandos = [];

document.addEventListener('DOMContentLoaded', async () => {

});

export function initPresenca() {
  // Carrega do sessionStorage caso o usuário volte da página de confirmação
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
  const turmas = await EtapaService.findAllEtapa();

  const container = document.getElementById('listaTurmas');
  container.innerHTML = turmas.map(t => `
    <div class="turma-card" data-id="${t.id}">
      <h4>${t.etapa}</h4>
      <p>Catequista: ${t.catequista.fullName}</p>
      <button class="btn-list-students" onclick="listarCatequizandos(${t.id}, '${t.etapa}')">
        Listar Catequizandos
      </button>
    </div>
  `).join('');
}

function toggleAccordion() {
  const content = document.getElementById('accordionContent');
  content.classList.toggle('open');
}

async function listarCatequizandos(etapaId, nomeTurma) {
  document.getElementById('accordionContent').classList.remove('open');

	catequizandos = await CatequizandoService.findByEtapaIdCatequizando(etapaId);

  renderList(catequizandos, `Turma: ${nomeTurma}`);
}

async function filtrarCatequizando() {
  const nome = document.getElementById('inputBusca').value.toLowerCase();
  if (nome.length < 2) return;

  catequizandos = await CatequizandoService.searchByFullNameCatequizando(nome);

  renderList(catequizandos, "Resultados da Busca");
  document.getElementById('accordionContent').classList.remove('open');
}

function renderList(catequizandos, titulo) {
  const container = document.getElementById('listaCatequizandos');
  document.getElementById('tituloListagem').innerText = titulo;
  document.getElementById('attendanceSection').style.display = 'block';

  container.innerHTML = catequizandos.map(c => {
    const estaPresente = presencasSelecionadas.some(p => p.catequizandoId === c.id);

    return `
    <div class="catequizando-card" data-id="${c.id}" data-etapa-id="${c.etapa.id}">
      <div class="student-info">
        <h4>${c.fullName}</h4>
        <p>${c.etapa.etapa} | Catequista: ${c.etapa.catequista.fullName}</p>
      </div>
      <div class="attendance-controls">
        <button class="btn-toggle presente ${estaPresente ? 'active' : ''}" 
              onclick="marcarPresenca(${c.id}, '${c.fullName}', '${c.etapa.etapa}', '${c.etapa.catequista.fullName}')">
          <i data-lucide="check"></i> Presença
        </button>
        <button class="btn-toggle ausente ${!estaPresente ? 'active' : ''}" 
              onclick="marcarAusencia(${c.id})">
          Ausência
        </button>
      </div>
    </div>
  `}).join('');
  if(window.lucide) lucide.createIcons();
}

function marcarPresenca(id, nome, turma, catequista) {
  if (!presencasSelecionadas.some(p => p.catequizandoId === id)) {
    presencasSelecionadas.push({ catequizandoId: id, nome, turma, catequista });
  }
  atualizarUI();
}

function marcarAusencia(id) {
  presencasSelecionadas = presencasSelecionadas.filter(p => p.catequizandoId !== id);
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
		const etapaId = catequizandos.find(c => c.fullName === catequizandoName).etapa.id;
    if(etapaId) {
      const etapa = await EtapaService.findByIdEtapa(etapaId);
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
		alert("Selecione ao menos um catequizando presente.");
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