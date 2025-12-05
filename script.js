document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved user preference, if any, on load of the website
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    themeToggleBtn.addEventListener('click', function () {
        // if set via local storage previously
        if (localStorage.getItem('color-theme')) {
            if (localStorage.getItem('color-theme') === 'light') {
                htmlElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            } else {
                htmlElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            }
        } else {
            // if NOT set via local storage previously
            if (htmlElement.classList.contains('dark')) {
                htmlElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                htmlElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }
    });

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
    // document.querySelector('header h1').textContent = header.title; // Replaced by logo
    document.querySelector('header p').textContent = header.subtitle;
}

function renderDiagnostico(diagnostico) {
    const container = document.getElementById('diagnostico-cards');
    container.innerHTML = `
        <div class="bg-white p-6 border-l-4 border-meso-black shadow-sm dark:bg-gray-800 dark:border-white">
            <h3 class="font-bold text-meso-black mb-2 dark:text-white">Missão</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">${diagnostico.missao}</p>
        </div>
        <div class="bg-white p-6 border-l-4 border-meso-black shadow-sm dark:bg-gray-800 dark:border-white">
            <h3 class="font-bold text-meso-black mb-2 dark:text-white">Visão 2026</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">${diagnostico.visao}</p>
        </div>
        <div class="bg-white p-6 border-l-4 border-meso-black shadow-sm dark:bg-gray-800 dark:border-white">
            <h3 class="font-bold text-meso-black mb-2 dark:text-white">Valores</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">${diagnostico.valores}</p>
        </div>
    `;

    const swotContainer = document.getElementById('swot-grid');
    swotContainer.innerHTML = `
        <div class="p-4 bg-gray-50 border border-gray-200 rounded-none dark:bg-gray-800 dark:border-gray-700">
            <h4 class="font-bold text-meso-black mb-2 dark:text-white"><i class="fas fa-plus-circle text-green-600"></i> Forças</h4>
            <ul class="list-disc pl-5 text-sm space-y-1 text-gray-600 dark:text-gray-300">
                ${diagnostico.swot.forcas.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
        <div class="p-4 bg-gray-50 border border-gray-200 rounded-none dark:bg-gray-800 dark:border-gray-700">
            <h4 class="font-bold text-meso-black mb-2 dark:text-white"><i class="fas fa-minus-circle text-red-600"></i> Fraquezas</h4>
            <ul class="list-disc pl-5 text-sm space-y-1 text-gray-600 dark:text-gray-300">
                ${diagnostico.swot.fraquezas.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
        <div class="p-4 bg-gray-50 border border-gray-200 rounded-none dark:bg-gray-800 dark:border-gray-700">
            <h4 class="font-bold text-meso-black mb-2 dark:text-white"><i class="fas fa-lightbulb text-meso-blue"></i> Oportunidades</h4>
            <ul class="list-disc pl-5 text-sm space-y-1 text-gray-600 dark:text-gray-300">
                ${diagnostico.swot.oportunidades.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
        <div class="p-4 bg-gray-50 border border-gray-200 rounded-none dark:bg-gray-800 dark:border-gray-700">
            <h4 class="font-bold text-meso-black mb-2 dark:text-white"><i class="fas fa-exclamation-triangle text-orange-500"></i> Ameaças</h4>
            <ul class="list-disc pl-5 text-sm space-y-1 text-gray-600 dark:text-gray-300">
                ${diagnostico.swot.ameacas.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `;
}

function renderObjetivos(objetivos) {
    const container = document.getElementById('objetivos-grid');
    container.innerHTML = objetivos.map(obj => `
        <div class="bg-white p-6 rounded-none shadow-sm border-t-4 border-${obj.cor}-500 card dark:bg-gray-800 dark:border-${obj.cor}-400">
            <div class="text-3xl font-bold text-meso-black mb-2 dark:text-white">${obj.valor}</div>
            <h3 class="font-bold text-sm uppercase text-gray-500 mb-2 dark:text-gray-400">${obj.titulo}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">${obj.descricao}</p>
        </div>
    `).join('');
}

function renderGantt(ganttData) {
    const container = document.querySelector('.mermaid');
    container.textContent = ganttData;

    // Determine theme based on current mode
    const isDark = document.documentElement.classList.contains('dark');
    const theme = isDark ? 'dark' : 'neutral';

    // Re-run mermaid with correct theme
    import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs')
        .then(mermaid => {
            mermaid.default.initialize({
                startOnLoad: true,
                theme: theme,
                themeVariables: {
                    fontFamily: 'Open Sans',
                    primaryColor: '#3860BE',
                    primaryTextColor: '#fff',
                    primaryBorderColor: '#3860BE',
                    lineColor: '#3860BE',
                    secondaryColor: '#000000',
                    tertiaryColor: '#fff'
                }
            });
            mermaid.default.init(undefined, container);
        });
}

function renderSazonalidade(sazonalidade) {
    const container = document.getElementById('sazonalidade-container');
    container.innerHTML = sazonalidade.map(estacao => `
        <div class="border rounded-none overflow-hidden shadow-sm dark:border-gray-700">
            <div class="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center dark:bg-gray-800 dark:border-gray-700">
                <h3 class="font-bold text-lg text-meso-black dark:text-white">${estacao.estacao}</h3>
                <span class="bg-white border border-gray-200 text-meso-black text-xs px-2 py-1 rounded-full uppercase font-bold dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">${estacao.tag}</span>
            </div>
            <div class="p-6 bg-white grid grid-cols-1 md:grid-cols-2 gap-6 dark:bg-gray-900">
                <div>
                    <h4 class="font-bold text-sm text-gray-400 uppercase mb-2 dark:text-gray-500">Foco Comercial</h4>
                    <ul class="list-disc pl-5 text-sm space-y-1 text-gray-700 dark:text-gray-300">
                        ${estacao.foco_comercial.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold text-sm text-gray-400 uppercase mb-2 dark:text-gray-500">Ações de Treinamento</h4>
                    <ul class="list-disc pl-5 text-sm space-y-1 text-gray-700 dark:text-gray-300">
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
        <tr class="border-b dark:border-gray-700">
            <td class="px-4 py-2 font-medium dark:text-gray-200">${risco.risco}</td>
            <td class="px-4 py-2 text-${risco.cor_impacto}-600 font-bold dark:text-${risco.cor_impacto}-400">${risco.impacto}</td>
            <td class="px-4 py-2 dark:text-gray-300">${risco.mitigacao}</td>
        </tr>
    `).join('');
}

function renderKPIs(kpis) {
    const container = document.getElementById('kpis-list');
    container.innerHTML = kpis.map(kpi => `
        <li class="flex items-start">
            <i class="fas fa-check-circle text-meso-blue mt-1 mr-2 dark:text-blue-400"></i>
            <span class="dark:text-gray-300">${kpi}</span>
        </li>
    `).join('');
}
