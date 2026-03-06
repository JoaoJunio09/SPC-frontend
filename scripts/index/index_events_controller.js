/**
 * Objeto de Eventos Simulados
 */
const eventos = {
    "2026-03-09": null,
    "2026-03-10": null,
    "2026-03-11": null,
    "2026-03-12": null,
    "2026-03-13": null,
    "2026-03-14": {
        tipo: "missa",
        titulo: "Missa da Catequese",
        diaExtenso: "14 de março de 2026",
        horario: "19h00 na Matriz"
    },
    "2026-03-15": {
        tipo: "missa",
        titulo: "Domingo de Ramos",
        diaExtenso: "26 de março de 2026", // Mantido conforme exemplo do usuário
        horario: "19h00 na Matriz"
    }
};

// Referências do DOM
const modal = document.getElementById('calendarModal');
const monthGrid = document.getElementById('monthGrid');
const eventContainer = document.getElementById('eventContainer');
const dayCards = document.querySelectorAll('.day-card');
const btnOpenCalender = document.querySelector("#btn-open-calendar");
const btnCloseCalender = document.querySelector("#btn-close-calendar");

btnOpenCalender.addEventListener('click', () =>{
  openCalendarModal();
});

btnCloseCalender.addEventListener('click', () => {
  closeCalendarModal();
});

/**
 * Mapeamento de nomes de dias para exibição na mensagem de ausência
 */
const diasDaSemanaNomes = {
    "2026-03-09": "segunda-feira, 09 de março",
    "2026-03-10": "terça-feira, 10 de março",
    "2026-03-11": "quarta-feira, 11 de março",
    "2026-03-12": "quinta-feira, 12 de março",
    "2026-03-13": "sexta-feira, 13 de março",
    "2026-03-14": "sábado, 14 de março",
    "2026-03-15": "domingo, 15 de março"
};

/**
 * Função para atualizar a seção de detalhes do evento
 */
function carregarEvento(data) {
    const evento = eventos[data];
    
    // Limpa o container
    eventContainer.innerHTML = '';

    if (evento) {
        // Se houver evento, renderiza o card
        eventContainer.innerHTML = `
            <div class="event-card missa-card">
                <div class="card-header">
                    <span class="badge">Evento de Hoje</span>
                    <h2>Missa: ${evento.titulo}</h2>
                </div>
                <div class="card-body">
                    <div class="info-item">
                        <span class="label">Dia:</span>
                        <span class="value">${evento.diaExtenso}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Horário:</span>
                        <span class="value">${evento.horario}</span>
                    </div>
                </div>
                <button class="btn-primary">Registrar Presença</button>
            </div>
        `;
    } else {
        // Se NÃO houver evento, mostra a mensagem simples
        eventContainer.innerHTML = `
            <div class="no-event-message">
                <p>Não há missa em ${diasDaSemanaNomes[data]}.</p>
            </div>
        `;
    }
}

/**
 * Gerencia a troca de estados (visual e dados) ao clicar em um dia
 */
dayCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove classe ativa de todos
        dayCards.forEach(c => c.classList.remove('active-day'));
        
        // Adiciona classe ativa no clicado
        card.classList.add('active-day');
        
        // Carrega o evento correspondente à data do card
        const dataSelecionada = card.getAttribute('data-date');
        carregarEvento(dataSelecionada);
    });
});

/**
 * Lógica do Modal (Mantida)
 */
function openCalendarModal() {
    modal.style.display = 'flex';
    renderMonthDays();
}

function closeCalendarModal() {
    modal.style.display = 'none';
}

let currentDate = new Date();

function renderMonthDays() {
    monthGrid.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // Atualiza título do mês
    const monthNames = [
        "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
        "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
    ];

    document.getElementById("currentMonth").innerText =
        `${monthNames[month]} ${year}`;

    // Espaços vazios antes do primeiro dia
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        monthGrid.appendChild(empty);
    }

    // Dias do mês
    for (let day = 1; day <= lastDate; day++) {

        const dateString =
            `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

        const dayDiv = document.createElement('div');
        dayDiv.style.cursor = "pointer";
        dayDiv.setAttribute('data-date', dateString);
        dayDiv.classList.add('month-day');
        dayDiv.innerText = day;
        initializeEventDayCalendar(dayDiv);

        if (eventos[dateString]) {
            if (eventos[dateString].tipo === "missa") {
                dayDiv.classList.add("missa");
            }
        }

        monthGrid.appendChild(dayDiv);
    }
}

function initializeEventDayCalendar(dayDiv) {
  dayDiv.addEventListener('click', (e) => {
    const dataSelecionada = e.target.closest('div').getAttribute('data-date');
    carregarEvento(dataSelecionada);
    closeCalendarModal();
  });
}

const btnPrev = document.querySelectorAll(".btn-nav-month")[0];
const btnNext = document.querySelectorAll(".btn-nav-month")[1];

btnPrev.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderMonthDays();
});

btnNext.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderMonthDays();
});

// Fechar modal ao clicar fora
window.onclick = function(event) {
    if (event.target == modal) closeCalendarModal();
}

/**
 * Inicialização
 */
document.addEventListener('DOMContentLoaded', () => {
    // Carrega o evento do dia que estiver marcado como 'active-day' inicialmente
    const defaultActive = document.querySelector('.day-card.active-day');
    if (defaultActive) {
      carregarEvento(defaultActive.getAttribute('data-date'));
    }
});