import { confirmModal } from '../../utils/confirmation.js';

export function initConfirmacao() {
    const dados = sessionStorage.getItem("presencasSelecionadas");
    const presentes = dados ? JSON.parse(dados) : [];
    console.log(presentes)

    const container = document.getElementById('reviewList');
    const empty = document.getElementById('emptyState');
    const btnSubmit = document.getElementById('btnSubmit');

    if (presentes.length === 0) {
        empty.style.display = 'block';
        btnSubmit.disabled = true;
        btnSubmit.style.opacity = '0.5';
    } else {
        container.innerHTML = presentes.map(p => `
            <div class="review-card">
                <div class="review-info">
                    <h4>${p.nome}</h4>
                    <p>${p.turma} • Catequista: ${p.catequista}</p>
                </div>
                <div class="review-badge">Presente</div>
            </div>
        `).join('');
    }

    btnSubmit.onclick = async () => {
        const confirmed = await confirmModal(`Deseja confirmar o registro de presença para os ${presentes.length} catequizandos listados?`);
        
        if (confirmed) {
            // Lógica de envio para o Backend
            console.log("Enviando para o backend:", presentes);
            
            // Simulação de sucesso
            alert("Presenças registradas com sucesso!");
            sessionStorage.removeItem("presencasSelecionadas");
            window.location.href = 'registrarPresenca.html';
        }
    };
}