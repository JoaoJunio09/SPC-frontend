import { EtapaService } from "../../services/etapa_service.js";
import { CatequizandoService } from "../../services/catequizando_service.js";

// Mock de dados para demonstração
const turmasMock = [
  { id: 1, nome: "1ª Etapa - Sábado", catequista: "Luciana" },
  { id: 2, nome: "1ª Etapa - Domingo", catequista: "Juliana" },
  { id: 3, nome: "Pré-Crisma", catequista: "Stella" }
];

const catequizandosMock = [
  { id: 101, nome: "Maria Oliveira", turmaId: 1, turmaNome: "1ª Etapa - Sábado", catequista: "Luciana" },
  { id: 102, nome: "João Pereira", turmaId: 1, turmaNome: "1ª Etapa - Sábado",catequista: "Luciana" },
  { id: 103, nome: "Ana Costa", turmaId: 2, turmaNome: "1ª Etapa - Domingo", catequista: "Juliana" },
  { id: 104, nome: "Pedro Santos", turmaId: 3, turmaNome: "Pré-Crisma", catequista: "Stella" },
  { id: 105, nome: "Lucas Souza", turmaId: 1, turmaNome: "1ª Etapa - Sábado", catequista: "Luciana" }
];

// Lista temporária em memória
let presencasSelecionadas = [];

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

function listarCatequizandos(turmaId, nomeTurma) {
    document.getElementById('accordionContent').classList.remove('open');

    const filtrados = catequizandosMock.filter(c => c.turmaId === turmaId);

    renderList(filtrados, `Turma: ${nomeTurma}`);
}

async function filtrarCatequizando() {
    const nome = document.getElementById('inputBusca').value.toLowerCase();
    if (nome.length < 2) return;

    const filtrados = await CatequizandoService.searchByFullNameCatequizando(nome);

    renderList(filtrados, "Resultados da Busca");
    document.getElementById('accordionContent').classList.remove('open');
}

function renderList(catequizandos, titulo) {
    const container = document.getElementById('listaCatequizandos');
    document.getElementById('tituloListagem').innerText = titulo;
    document.getElementById('attendanceSection').style.display = 'block';

    container.innerHTML = catequizandos.map(c => {
      const estaPresente = presencasSelecionadas.some(p => p.catequizandoId === c.id);
      const nomeTurma = turmasMock.find(t => t.id === c.turmaId)?.nome || "Catequese";

      return `
      <div class="catequizando-card">
        <div class="student-info">
          <h4>${c.fullName}</h4>
          <p>${c.etapa.etapa} | Catequista: ${c.etapa.catequista.fullName}</p>
        </div>
        <div class="attendance-controls">
          <button class="btn-toggle presente ${estaPresente ? 'active' : ''}" 
                onclick="marcarPresenca(${c.id}, '${c.nome}', '${nomeTurma}', '${c.catequista}')">
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

function atualizarUI() {
  atualizarContador();
  // Re-renderiza a lista para atualizar os estados dos botões
  const currentTitle = document.getElementById('tituloListagem').innerText;
  if (currentTitle === "Resultados da Busca") {
    filtrarCatequizando();
  } else {
    const turmaId = catequizandosMock.find(c => c.nome === listaCatequizandos.querySelector('h4')?.innerText)?.turmaId;
    if(turmaId) {
      const t = turmasMock.find(x => x.id === turmaId);
      listarCatequizandos(t.id, t.nome);
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