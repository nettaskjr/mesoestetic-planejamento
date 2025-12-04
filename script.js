document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderHeader(data.header);
            renderDiagnostico(data.diagnostico);
            renderObjetivos(data.objetivos);
            renderGantt(data.gantt);
            renderSazonalidade(data.sazonalidade);
            renderRiscos(data.riscos);
            renderKPIs(data.kpis);
        })
        .catch(error => console.error('Erro ao carregar dados:', error));
});

function renderHeader(header) {
    document.querySelector('header h1').textContent = header.title;
    document.querySelector('header p').textContent = header.subtitle;
}

function renderDiagnostico(diagnostico) {
    const container = document.getElementById('diagnostico-cards');
    container.innerHTML = `
        <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
            <h3 class="font-bold text-blue-800 mb-2">Missão</h3>
            <p class="text-sm">${diagnostico.missao}</p>
        </div>
        <div class="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-600">
            <h3 class="font-bold text-teal-800 mb-2">Visão 2026</h3>
            <p class="text-sm">${diagnostico.visao}</p>
        </div>
        <div class="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-600">
            <h3 class="font-bold text-purple-800 mb-2">Valores</h3>
            <p class="text-sm">${diagnostico.valores}</p>
        </div>
    `;

    const swotContainer = document.getElementById('swot-grid');
    swotContainer.innerHTML = `
        <div class="p-4 bg-green-50 border border-green-200 rounded">
            <h4 class="font-bold text-green-700 mb-2"><i class="fas fa-plus-circle"></i> Forças</h4>
            <ul class="list-disc pl-5 text-sm space-y-1">
                ${diagnostico.swot.forcas.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
        <div class="p-4 bg-red-50 border border-red-200 rounded">
            <h4 class="font-bold text-red-700 mb-2"><i class="fas fa-minus-circle"></i> Fraquezas</h4>
            <ul class="list-disc pl-5 text-sm space-y-1">
                ${diagnostico.swot.fraquezas.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
        <div class="p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 class="font-bold text-blue-700 mb-2"><i class="fas fa-lightbulb"></i> Oportunidades</h4>
            <ul class="list-disc pl-5 text-sm space-y-1">
                ${diagnostico.swot.oportunidades.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
        <div class="p-4 bg-orange-50 border border-orange-200 rounded">
            <h4 class="font-bold text-orange-700 mb-2"><i class="fas fa-exclamation-triangle"></i> Ameaças</h4>
            <ul class="list-disc pl-5 text-sm space-y-1">
                ${diagnostico.swot.ameacas.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `;
}

function renderObjetivos(objetivos) {
    const container = document.getElementById('objetivos-grid');
    container.innerHTML = objetivos.map(obj => `
        <div class="bg-white p-6 rounded shadow border-t-4 border-${obj.cor}-500 card">
            <div class="text-3xl font-bold text-slate-800 mb-2">${obj.valor}</div>
            <h3 class="font-bold text-sm uppercase text-gray-500 mb-2">${obj.titulo}</h3>
            <p class="text-sm text-gray-600">${obj.descricao}</p>
        </div>
    `).join('');
}

function renderGantt(ganttData) {
    const container = document.querySelector('.mermaid');
    container.textContent = ganttData;
    // Re-run mermaid
    import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs')
        .then(mermaid => {
            mermaid.default.init(undefined, container);
        });
}

function renderSazonalidade(sazonalidade) {
    const container = document.getElementById('sazonalidade-container');
    container.innerHTML = sazonalidade.map(estacao => `
        <div class="border rounded-lg overflow-hidden shadow-sm">
            <div class="bg-${estacao.cor}-100 p-4 border-b border-${estacao.cor}-200 flex justify-between items-center">
                <h3 class="font-bold text-lg text-${estacao.cor}-800">${estacao.estacao}</h3>
                <span class="bg-${estacao.cor}-200 text-${estacao.cor}-800 text-xs px-2 py-1 rounded-full uppercase font-bold">${estacao.tag}</span>
            </div>
            <div class="p-6 bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 class="font-bold text-sm text-gray-500 uppercase mb-2">Foco Comercial</h4>
                    <ul class="list-disc pl-5 text-sm space-y-1 text-gray-700">
                        ${estacao.foco_comercial.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold text-sm text-gray-500 uppercase mb-2">Ações de Treinamento</h4>
                    <ul class="list-disc pl-5 text-sm space-y-1 text-gray-700">
                        ${estacao.acoes_treinamento.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `).join('');
}

function renderRiscos(riscos) {
    const tbody = document.getElementById('riscos-tbody');
    tbody.innerHTML = riscos.map(risco => `
        <tr class="border-b">
            <td class="px-4 py-2 font-medium">${risco.risco}</td>
            <td class="px-4 py-2 text-${risco.cor_impacto}-600 font-bold">${risco.impacto}</td>
            <td class="px-4 py-2">${risco.mitigacao}</td>
        </tr>
    `).join('');
}

function renderKPIs(kpis) {
    const container = document.getElementById('kpis-list');
    container.innerHTML = kpis.map(kpi => `
        <li class="flex items-start">
            <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
            <span>${kpi}</span>
        </li>
    `).join('');
}
