        const API_URL = 'http://localhost:3001/equipamentos';

        async function carregarEquipamentos() {
            const res = await fetch(API_URL);
            const dados = await res.json();
            const tbody = document.getElementById('tabelaCorpo');
            tbody.innerHTML = '';

            dados.forEach(item => {
                tbody.innerHTML += `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.nome}</td>
                        <td>${item.tipo}</td>
                        <td>${item.marca}</td>
                        <td>${item.problema_relatado}</td>
                        <td>${item.status}</td>
                        <td>
                            <button onclick="deletar(${item.id})">Excluir</button>
                        </td>
                    </tr>
                `;
            });
        }

        document.getElementById('formEquipamento').addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                nome: document.getElementById('nome').value,
                tipo: document.getElementById('tipo').value,
                marca: document.getElementById('marca').value,
                problema_relatado: document.getElementById('problema').value,
                status: document.getElementById('status').value
            };

            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            e.target.reset();
            carregarEquipamentos();
        });

        async function deletar(id) {
            if (confirm('Deseja realmente excluir este equipamento?')) {
                await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                carregarEquipamentos();
            }
        }
carregarEquipamentos();