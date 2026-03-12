import { confirmModal } from '../../utils/confirmation.js';

// Dados Mockados (Simulando banco de dados)
const turmasMock = [
	{ id: 1, nome: "1ª Etapa - Sábado", catequista: "Luciana" },
	{ id: 2, nome: "1ª Etapa - Domingo", catequista: "Juliana" },
	{ id: 3, nome: "Pré-Crisma", catequista: "Stella" }
];

const catequizandosMock = [
	{ id: 101, nome: "Maria Oliveira", turmaId: 1, catequista: "Luciana", status: 'ausente' },
	{ id: 102, nome: "João Pereira", turmaId: 1, catequista: "Luciana", status: 'ausente' },
	{ id: 103, nome: "Ana Costa", turmaId: "1ª Etapa", catequista: "Juliana", status: 'ausente' },
	{ id: 104, nome: "Pedro Santos", turmaId: 3, catequista: "Stella", status: 'ausente' },
	{ id: 105, nome: "Lucas Souza", turmaId: 1, catequista: "Luciana", status: 'ausente' }
];

let listaAtual = [];

export function initPresenca() {
    renderizarTurmas();
    window.toggleAccordion = toggleAccordion;
    window.listarCatequizandos = listarCatequizandos;
    window.marcarPresenca = marcarPresenca;
    window.marcarAusencia = marcarAusencia;
    window.filtrarCatequizando = filtrarCatequizando;
    window.confirmarRegistro = confirmarRegistro;
    window.resetarPagina = resetarPagina;
}

function renderizarTurmas() {
    const container = document.getElementById('listaTurmas');
    container.innerHTML = turmasMock.map(t => `
        <div class="turma-card">
            <h4>${t.nome}</h4>
            <p>Catequista: ${t.catequista}</p>
            <button class="btn-list-students" onclick="listarCatequizandos(${t.id}, '${t.nome}')">
                Listar Catequizandos
            </button>
        </div>
    `).join('');
}

function toggleAccordion() {
    const content = document.getElementById('accordionContent');
    const icon = document.getElementById('accordion-icon');
    content.classList.toggle('open');
    icon.style.transform = content.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
}

function listarCatequizandos(turmaId, nomeTurma) {
    // 1. Fecha accordion
    const content = document.getElementById('accordionContent');
    content.classList.remove('open');
    
    // 2. Filtra dados
    listaAtual = catequizandosMock.filter(c => c.turmaId === turmaId).map(c => ({...c}));
    
    // 3. Atualiza Título e Exibe Seção
    document.getElementById('tituloListagem').innerText = `Turma: ${nomeTurma}`;
    renderizarLista();
    document.getElementById('attendanceSection').style.display = 'block';
}

function filtrarCatequizando() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    if (termo.length < 2) {
        if (listaAtual.length === 0) document.getElementById('attendanceSection').style.display = 'none';
        return;
    }

    // Busca global em todos os catequizandos
    listaAtual = catequizandosMock.filter(c => c.nome.toLowerCase().includes(termo)).map(c => ({...c}));
    document.getElementById('tituloListagem').innerText = `Resultados da Busca`;
    renderizarLista();
    document.getElementById('attendanceSection').style.display = 'block';
    
    // Fecha accordion se estiver aberto
    document.getElementById('accordionContent').classList.remove('open');
}

function renderizarLista() {
    const container = document.getElementById('listaCatequizandos');
    container.innerHTML = listaAtual.map(c => `
        <div class="catequizando-card" id="card-${c.id}">
            <div class="student-info">
                <h4>${c.nome}</h4>
                <p>${c.turmaId} | Catequista: ${c.catequista}</p>
            </div>
            <div class="attendance-controls">
                <button class="btn-toggle presente ${c.status === 'presente' ? 'active' : ''}" 
                        onclick="marcarPresenca(${c.id})">
                    <i data-lucide="check"></i> Presença
                </button>
                <button class="btn-toggle ausente ${c.status === 'ausente' ? 'active' : ''}" 
                        onclick="marcarAusencia(${c.id})">
                    Ausência
                </button>
            </div>
        </div>
    `).join('');
    if(window.lucide) lucide.createIcons();
}

function marcarPresenca(id) {
    const index = listaAtual.findIndex(c => c.id === id);
    listaAtual[index].status = 'presente';
    renderizarLista();
}

function marcarAusencia(id) {
    const index = listaAtual.findIndex(c => c.id === id);
    listaAtual[index].status = 'ausente';
    renderizarLista();
}

async function confirmarRegistro() {
    const confirmed = await confirmModal("Deseja confirmar o registro de presença para estes catequizandos?");
    
    if (confirmed) {
        console.log("Registrando no banco de dados:", listaAtual);
        // Aqui iria a chamada de API (ex: Firestore)
        
        alert("Presença registrada com sucesso!");
        resetarPagina();
    }
}

function resetarPagina() {
    listaAtual = [];
    document.getElementById('inputBusca').value = '';
    document.getElementById('attendanceSection').style.display = 'none';
    document.getElementById('accordionContent').classList.remove('open');
    document.getElementById('accordion-icon').style.transform = 'rotate(0deg)';
}