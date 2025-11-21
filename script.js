// --- SELEÇÃO DE ELEMENTOS E VARIÁVEIS GLOBAIS ---
// Seleciona os elementos do HTML que serão manipulados pelo script.
let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector("Header input");
let botaoBusca = document.querySelector("#botao-busca");
// Array que guardará os dados carregados do data.json para evitar recarregamentos.
let dados = [];

// --- FUNÇÕES ---

/**
 * Remove acentos de uma string para facilitar a busca.
 * Ex: "história" se torna "historia".
 */
function removerAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Função principal que carrega os dados (se necessário),
 * filtra os resultados com base na busca do usuário e chama a renderização.
 */
async function buscarDados() {
    // Carrega os dados do arquivo JSON apenas na primeira vez que a função é executada.
    if (dados.length === 0) {
        try {
            let resposta = await fetch("data.json");
            dados = await resposta.json();
        } catch (error) {
            console.log("Falha ao carregar dados:", error);
            return; // Interrompe se houver erro.
        }
    }

    // Normaliza o termo de busca (minúsculas e sem acentos).
    const termoBusca = removerAcentos(campoBusca.value.toLowerCase());

    // Adiciona ou remove uma classe para mudar o layout com base na busca.
    if (termoBusca.trim() !== '') {
        cardContainer.classList.add('search-results');
    } else {
        cardContainer.classList.remove('search-results');
    }
    // Filtra os dados verificando se o termo de busca aparece no título ou na descrição.
    const dadosFiltrados = dados.filter(dado => removerAcentos(dado.titulo.toLowerCase()).includes(termoBusca) || removerAcentos(dado.descricao.toLowerCase()).includes(termoBusca));
    renderizarCards(dadosFiltrados);
}

/**
 * Limpa a tela e exibe os cards correspondentes aos dados fornecidos.
 */
function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards antigos.
    // Cria e adiciona um novo card no container para cada item nos dados.
    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
            <h2>${dado.titulo}</h2>
            <p>${dado.descricao}</p>
            <a href="${dado.link}" target="_blank">Ver mais</a>
        `
        cardContainer.appendChild(article);
    }
}

// --- EVENTOS ---

// Adiciona um evento de clique ao botão de busca para chamar a função buscarDados.
botaoBusca.addEventListener("click", buscarDados);

// Adiciona um evento que escuta as teclas pressionadas no campo de busca.
campoBusca.addEventListener("keydown", function(event) {
    // Se a tecla pressionada for "Enter", a função de busca é chamada.
    if (event.key === "Enter") {
        buscarDados();
    }
});

// --- ESTILOS DINÂMICOS ---

/**
 * Adiciona estilos CSS na página para o efeito de hover nos cards.
 * Esta é uma alternativa para quando não se tem um arquivo CSS separado.
 */
function adicionarEstilosHover() {
    const style = document.createElement('style');
    style.textContent = `
        .card {
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out;
        }
        .card:hover {
            background-color: #FFD700; /* Amarelo original vibrante */
            color: #000000; /* Deixa TODO o texto preto para máximo contraste */
            transform: translateY(-5px); /* Efeito de levantar o card */
            box-shadow: 0 8px 16px rgba(0,0,0,0.2); /* Sombra para dar profundidade */
        }
        .card:hover a, .card:hover h2 {
            color: #000000; /* Garante que título e link também fiquem pretos */
        }
    `;
    document.head.appendChild(style);
}
// Chama a função buscarDados assim que o script é carregado para exibir os cards iniciais.
buscarDados();
adicionarEstilosHover();