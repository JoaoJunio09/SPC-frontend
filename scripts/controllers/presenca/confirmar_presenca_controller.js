import { confirmModal } from '../../utils/confirmation.js';
import { PresencaService } from '../../services/presenca_service.js';
import { MessageModal } from '../../utils/modal_message.js';

export async function initConfirmacao() {
  const dados = sessionStorage.getItem("presencasSelecionadas");
  const presentes = dados ? JSON.parse(dados) : [];

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
          <h4>${p.catequizandoName}</h4>
          <p>${p.etapaName} • Catequista: ${p.catequistaName}</p>
        </div>
        <div class="review-badge">Presente</div>
      </div>
    `).join('');
  }

  btnSubmit.onclick = async () => {
    const confirmed = await confirmModal(`Deseja confirmar o registro de presença para os ${presentes.length} catequizandos listados?`);
    
    if (!confirmed) return;

    try {
      const requests = presentes.map(async presenca => {
        await PresencaService.createPresenca(presenca)
      });

      await Promise.all(requests);

      MessageModal.show({ 
        type: 'success', 
        title: 'Sucesso', 
        message: 'Presenças foram registradas com sucesso' 
      });

      sessionStorage.removeItem("presencasSelecionadas");

      setTimeout(() => {
        window.location.href = "registrarPresenca.html";
      }, 4500);
    }
    catch (e) {
      MessageModal.show({ 
        type: 'error', 
        title: 'Falha na conexão', 
        message: 'Não foi possível registrar presença dos catequizandos' 
      });

      console.log(e);
    }
  }
}