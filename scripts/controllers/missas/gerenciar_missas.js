let missas = [
            {
                id: 1,
                titulo: "Domingo de Ramos",
                data: "2026-03-26",
                horario: "19:00"
            },
            {
                id: 2,
                titulo: "Missa da Catequese",
                data: "2026-03-14",
                horario: "18:00"
            }
        ];

        // Elementos DOM
        const grid = document.getElementById('missasGrid');
        const modal = document.getElementById('missaModal');
        const form = document.getElementById('missaForm');
        const btnOpenModal = document.getElementById('btnOpenModal');
        const btnCancel = document.getElementById('btnCancel');

        /**
         * Renderiza a lista de missas na tela
         */
        function renderizarMissas() {
            grid.innerHTML = '';

            if (missas.length === 0) {
                grid.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-muted);">Nenhuma missa cadastrada.</p>';
                return;
            }

            missas.forEach(missa => {
                const card = document.createElement('div');
                card.className = 'missa-card';
                
                // Formatação simples de data para visualização
                const dataFormatada = missa.data.split('-').reverse().join('/');

                card.innerHTML = `
                    <div class="missa-info">
                        <h3>${missa.titulo}</h3>
                        <p>${dataFormatada} • ${missa.horario}</p>
                    </div>
                    <div class="missa-actions">
                        <button class="btn-action btn-edit" onclick="editarMissa(${missa.id})">Editar</button>
                        <button class="btn-action btn-remove" onclick="removerMissa(${missa.id})">Remover</button>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        /**
         * Abre o modal para cadastro ou edição
         */
        function openModal(id = null) {
            modal.style.display = 'flex';
            if (id) {
                const missa = missas.find(m => m.id === id);
                document.getElementById('modalTitle').innerText = 'Editar Missa';
                document.getElementById('missaId').value = missa.id;
                document.getElementById('titulo').value = missa.titulo;
                document.getElementById('data').value = missa.data;
                document.getElementById('horario').value = missa.horario;
            } else {
                document.getElementById('modalTitle').innerText = 'Registrar Nova Missa';
                form.reset();
                document.getElementById('missaId').value = '';
            }
        }

        /**
         * Fecha o modal
         */
        function closeModal() {
            modal.style.display = 'none';
        }

        /**
         * Salva ou Atualiza uma missa
         */
        form.onsubmit = (e) => {
            e.preventDefault();
            
            const id = document.getElementById('missaId').value;
            const novaMissa = {
                id: id ? parseInt(id) : Date.now(),
                titulo: document.getElementById('titulo').value,
                data: document.getElementById('data').value,
                horario: document.getElementById('horario').value
            };

            if (id) {
                // Editar
                missas = missas.map(m => m.id === parseInt(id) ? novaMissa : m);
            } else {
                // Adicionar
                missas.push(novaMissa);
            }

            renderizarMissas();
            closeModal();
        };

        /**
         * Remove uma missa com confirmação
         */
        window.removerMissa = (id) => {
            if (confirm('Tem certeza que deseja remover esta missa?')) {
                missas = missas.filter(m => m.id !== id);
                renderizarMissas();
            }
        };

        /**
         * Prepara edição
         */
        window.editarMissa = (id) => {
            openModal(id);
        };

        // Eventos
        btnOpenModal.onclick = () => openModal();
        btnCancel.onclick = closeModal;
        window.onclick = (e) => { if (e.target === modal) closeModal(); };

        // Inicialização
        renderizarMissas();