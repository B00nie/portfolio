// ---------- Estrelas em volta da foto ----------
// Cada item: [posição x em %, posição y em %, tamanho em px], relativo à foto.
const ESTRELAS = [
    [-13, 16, 14], [-5, 40, 9], [-16, 58, 18], [-7, 80, 10],
    [10, -5, 11], [84, -4, 16],
    [103, 14, 10], [97, 33, 20], [111, 50, 9], [101, 72, 13],
];

document.querySelectorAll('.foto__estrelas').forEach((caixa) => {
    ESTRELAS.forEach(([x, y, tamanho], i) => {
        const estrela = document.createElement('span');
        estrela.className = 'foto__estrela';
        estrela.style.cssText =
            `left:${x}%;top:${y}%;--tamanho:${tamanho}px;` +
            `--duracao:${1.6 + (i % 4) * 0.5}s;--atraso:-${(i * 0.37) % 2}s`;
        caixa.append(estrela);
    });
});

// ---------- Projetos vindos do GitHub ----------
const USUARIO = 'B00nie';
const QUANTIDADE = 6;
// Para escolher quais aparecem (e em que ordem), coloque os nomes aqui.
// Ex.: ['Front-SPI-2026', 'backend-SPI']. Vazio = os mais recentes.
const DESTAQUES = [];

function criarProjeto(repo) {
    const link = document.createElement('a');
    link.className = 'projetos__item';
    link.href = repo.html_url;

    const partes = [
        ['projetos__nome', repo.name],
        ['projetos__descricao', repo.description || ''],
        ['projetos__linguagem', repo.language || ''],
    ];
    partes.forEach(([classe, texto]) => {
        const parte = document.createElement('span');
        parte.className = classe;
        parte.textContent = texto;
        link.append(parte);
    });

    const item = document.createElement('li');
    item.append(link);
    return item;
}

async function carregarProjetos() {
    const lista = document.querySelector('.projetos__lista');
    if (!lista) return;

    try {
        const resposta = await fetch(
            `https://api.github.com/users/${USUARIO}/repos?per_page=100&sort=pushed`
        );
        if (!resposta.ok) return;

        let repos = (await resposta.json()).filter((repo) => !repo.fork);
        if (DESTAQUES.length) {
            repos = DESTAQUES
                .map((nome) => repos.find((repo) => repo.name === nome))
                .filter(Boolean);
        }
        repos = repos.slice(0, QUANTIDADE);

        // Se algo der errado, o link fixo que já está no HTML continua lá.
        if (repos.length) lista.replaceChildren(...repos.map(criarProjeto));
    } catch {
        // Sem internet ou limite da API: mantém o link fixo.
    }
}

carregarProjetos();
