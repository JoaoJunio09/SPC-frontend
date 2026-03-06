/* MANTENDO A LÓGICA JS ORIGINAL CONFORME SOLICITADO */
        let catequistas = [
            { id: 1, nome: "João Pereira", turma: "PRIMEIRA ETAPA" },
            { id: 2, nome: "Maria Souza", turma: "CRISMA" },
            { id: 3, nome: "Antônio Silva", turma: "EUCARISTIA" }
        ];

        const turmasDisponiveis = ["PRIMEIRA ETAPA", "SEGUNDA ETAPA", "EUCARISTIA", "PRÉ-CRISMA", "CRISMA"];

        const catequizandos = [
            { nome: "Pedro Rocha", nascimento: "12/05/2012", presencas: 15, missasAteHoje: 20, totalMissasAno: 52, turma: "PRIMEIRA ETAPA" },
            { nome: "Ana Clara", nascimento: "20/08/2012", presencas: 18, missasAteHoje: 20, totalMissasAno: 52, turma: "PRIMEIRA ETAPA" },
            { nome: "Lucas Lima", nascimento: "05/01/2013", presencas: 10, missasAteHoje: 20, totalMissasAno: 52, turma: "PRIMEIRA ETAPA" },
            { nome: "Mariana Costa", nascimento: "15/03/2009", presencas: 19, missasAteHoje: 20, totalMissasAno: 52, turma: "CRISMA" },
            { nome: "Gabriel Santos", nascimento: "30/11/2008", presencas: 14, missasAteHoje: 20, totalMissasAno: 52, turma: "CRISMA" }
        ];

        function init() {
            renderCatequistas();
            renderTurmas();
        }

        function renderCatequistas() {
            const container = document.getElementById('lista-catequistas');
            container.innerHTML = '';
            catequistas.forEach(c => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${c.nome}</h3>
                    <p>Turma: <span class="tag-turma">${c.turma}</span></p>
                    <div class="card-actions">
                        <button class="btn btn-edit" onclick="prepareEdit(${c.id})">EDITAR</button>
                        <button class="btn btn-change" onclick="prepareChangeTurma(${c.id})">ALTERAR TURMA</button>
                        <button class="btn btn-remove" onclick="removeCatequista(${c.id})">REMOVER</button>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function renderTurmas() {
            const container = document.getElementById('lista-turmas');
            container.innerHTML = '';
            turmasDisponiveis.forEach(t => {
                const responsavel = catequistas.find(c => c.turma === t);
                const nomeResp = responsavel ? responsavel.nome : "Sem catequista definido";
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${t}</h3>
                    <p>Responsável: <strong>${nomeResp}</strong></p>
                    <button class="btn btn-view" onclick="viewAlunos('${t}')">VISUALIZAR CATEQUIZANDOS</button>
                `;
                container.appendChild(card);
            });
        }

        function openModal(id) { document.getElementById(id).style.display = 'flex'; }
        function closeModal(id) { document.getElementById(id).style.display = 'none'; }

        function saveNewCatequista() {
            const nome = document.getElementById('add-nome').value;
            const turma = document.getElementById('add-turma').value;
            if(!nome) return;
            catequistas.push({ id: Date.now(), nome, turma });
            document.getElementById('add-nome').value = '';
            closeModal('modalAddCatequista');
            renderCatequistas();
            renderTurmas();
        }

        function prepareEdit(id) {
            const c = catequistas.find(x => x.id === id);
            document.getElementById('edit-id').value = c.id;
            document.getElementById('edit-nome').value = c.nome;
            openModal('modalEditCatequista');
        }

        function updateCatequista() {
            const id = parseInt(document.getElementById('edit-id').value);
            const nome = document.getElementById('edit-nome').value;
            const index = catequistas.findIndex(x => x.id === id);
            catequistas[index].nome = nome;
            closeModal('modalEditCatequista');
            renderCatequistas();
            renderTurmas();
        }

        function prepareChangeTurma(id) {
            const c = catequistas.find(x => x.id === id);
            document.getElementById('change-id').value = c.id;
            document.getElementById('change-turma-select').value = c.turma;
            openModal('modalChangeTurma');
        }

        function updateTurma() {
            const id = parseInt(document.getElementById('change-id').value);
            const turma = document.getElementById('change-turma-select').value;
            const index = catequistas.findIndex(x => x.id === id);
            catequistas[index].turma = turma;
            closeModal('modalChangeTurma');
            renderCatequistas();
            renderTurmas();
        }

        function removeCatequista(id) {
            if(confirm("Deseja remover este catequista?")) {
                catequistas = catequistas.filter(c => c.id !== id);
                renderCatequistas();
                renderTurmas();
            }
        }

        function viewAlunos(turmaNome) {
            const listaContainer = document.getElementById('lista-alunos-modal');
            document.getElementById('view-turma-title').innerText = `Catequizandos: ${turmaNome}`;
            listaContainer.innerHTML = '';
            const filtrados = catequizandos.filter(a => a.turma === turmaNome);

            if(filtrados.length === 0) {
                listaContainer.innerHTML = '<p style="text-align:center; padding: 20px; color: #64748B;">Nenhum aluno cadastrado nesta turma.</p>';
            } else {
                filtrados.forEach(aluno => {
                    const percAtual = Math.round((aluno.presencas / aluno.missasAteHoje) * 100);
                    const percTotal = Math.round((aluno.presencas / aluno.totalMissasAno) * 100);
                    const item = document.createElement('div');
                    item.className = 'catequizando-item';
                    item.innerHTML = `
                        <div class="catequizando-header">
                            <span class="catequizando-name">${aluno.nome}</span>
                            <span class="catequizando-dob">${aluno.nascimento}</span>
                        </div>
                        <div class="progress-container">
                            <div class="progress-label"><span>Presença Atual</span><strong>${percAtual}%</strong></div>
                            <div class="progress-bar"><div class="progress-fill bg-green" style="width: ${percAtual}%"></div></div>
                        </div>
                        <div class="progress-container">
                            <div class="progress-label"><span>Presença Total Ano</span><strong>${percTotal}%</strong></div>
                            <div class="progress-bar"><div class="progress-fill bg-orange" style="width: ${percTotal}%"></div></div>
                        </div>
                    `;
                    listaContainer.appendChild(item);
                });
            }
            openModal('modalViewCatequizandos');
        }

        window.onload = init;