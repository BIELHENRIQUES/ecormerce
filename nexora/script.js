
/* =========================================
   NEXORA - JAVASCRIPT
========================================= */

const CHAVE_CARRINHO = "nexoraCarrinho";

/* =========================================
   ESTILOS E ANIMAÇÕES
========================================= */

const estilosInteracao = document.createElement("style");

estilosInteracao.textContent = `
    .navbar-nexora .nav-link {
        position: relative;
        transition: color 0.3s ease, transform 0.3s ease;
    }

    .navbar-nexora .nav-link::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 2px;
        width: 0;
        height: 3px;
        background: #7546cf;
        border-radius: 10px;
        transform: translateX(-50%);
        transition: width 0.3s ease;
    }

    .navbar-nexora .nav-link:hover {
        color: #7546cf;
        transform: translateY(-2px);
    }

    .navbar-nexora .nav-link:hover::after,
    .navbar-nexora .nav-link.active::after {
        width: 75%;
    }

    .btn-adicionar-carrinho {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        min-height: 48px;
        margin-top: 12px;
        padding: 12px 16px;
        border: 0;
        border-radius: 12px;
        background: linear-gradient(135deg, #7546cf, #9873e6);
        color: #fff;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(117, 70, 207, 0.18);
        transition: transform 0.25s ease,
                    box-shadow 0.25s ease,
                    background 0.25s ease;
    }

    .btn-adicionar-carrinho:hover {
        background: linear-gradient(135deg, #6035b5, #7546cf);
        transform: translateY(-3px);
        box-shadow: 0 9px 22px rgba(117, 70, 207, 0.3);
    }

    .btn-adicionar-carrinho:active {
        transform: scale(0.97);
    }

    .btn-adicionar-carrinho.adicionado {
        background: linear-gradient(135deg, #21865a, #35aa75);
        box-shadow: 0 5px 15px rgba(33, 134, 90, 0.2);
    }

    .catalogo-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .catalogo-card:hover {
        transform: translateY(-6px);
    }
`;

document.head.appendChild(estilosInteracao);

/* =========================================
   FUNÇÕES DO CARRINHO
========================================= */

function obterCarrinho() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_CARRINHO));
        return Array.isArray(dados) ? dados : [];
    } catch (erro) {
        return [];
    }
}

function salvarCarrinho(carrinho) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function converterPreco(texto) {
    return Number(
        texto
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim()
    );
}

/* =========================================
   CONTADOR DO CARRINHO
========================================= */

function atualizarContadorCarrinho() {
    const carrinho = obterCarrinho();

    const quantidade = carrinho.reduce(function (total, produto) {
        return total + Number(produto.quantidade || 0);
    }, 0);

    document.querySelectorAll("[data-contador-carrinho]").forEach(function (elemento) {
        elemento.textContent = quantidade;
    });
}

/* =========================================
   ADICIONAR PRODUTOS
========================================= */

function adicionarProduto(id, nome, preco, quantidade = 1) {
    if (!id || !nome || !Number.isFinite(Number(preco)) || Number(preco) <= 0) {
        alert("Não foi possível adicionar este produto.");
        return false;
    }

    const carrinho = obterCarrinho();

    const existente = carrinho.find(function (produto) {
        return produto.id === id;
    });

    if (existente) {
        existente.quantidade += quantidade;
    } else {
        carrinho.push({
            id: id,
            nome: nome,
            preco: Number(preco),
            quantidade: quantidade
        });
    }

    salvarCarrinho(carrinho);
    return true;
}

/* =========================================
   BOTÕES DO CATÁLOGO
========================================= */

document.querySelectorAll(".produto").forEach(function (card) {
    const linkProduto = card.querySelector('a[href*="produto.html?id="]');
    const nomeElemento = card.querySelector("h3");
    const precoElemento = card.querySelector(".produto-preco span");
    const areaBotoes = card.querySelector(".catalogo-card-info");

    if (!linkProduto || !nomeElemento || !precoElemento || !areaBotoes) {
        return;
    }

    const identificador = new URL(linkProduto.href).searchParams.get("id");

    if (!identificador) {
        return;
    }

    let botao = areaBotoes.querySelector(".btn-adicionar-carrinho");

    if (!botao) {
        botao = document.createElement("button");
        botao.type = "button";
        botao.className = "btn-adicionar-carrinho";
        botao.textContent = "Adicionar ao carrinho";
        areaBotoes.appendChild(botao);
    }

    botao.addEventListener("click", function () {
        const nome = nomeElemento.textContent.trim();
        const preco = converterPreco(precoElemento.textContent);

        const adicionado = adicionarProduto(identificador, nome, preco);

        if (!adicionado) {
            return;
        }

        botao.textContent = "Adicionado ao carrinho ✓";
        botao.classList.add("adicionado");

        setTimeout(function () {
            botao.textContent = "Adicionar ao carrinho";
            botao.classList.remove("adicionado");
        }, 1500);
    });
});

/* =========================================
   EXIBIR CARRINHO
========================================= */

const areaCarrinho = document.getElementById("carrinhoProdutos");
const resumoCarrinho = document.getElementById("resumoCarrinho");
const subtotalCarrinho = document.getElementById("subtotalCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");

function atualizarCarrinho() {
    if (!areaCarrinho) {
        return;
    }

    const carrinho = obterCarrinho();

    areaCarrinho.innerHTML = "";

    if (carrinho.length === 0) {
        areaCarrinho.innerHTML = `
            <div class="alert alert-light border p-4">
                <h4>Seu carrinho está vazio</h4>
                <p>Explore nossa loja e encontre sua próxima tecnologia.</p>
                <a href="catalogo.html" class="btn btn-primary">
                    Explorar catálogo
                </a>
            </div>
        `;

        if (resumoCarrinho) {
            resumoCarrinho.classList.add("d-none");
        }

        atualizarContadorCarrinho();
        return;
    }

    let subtotal = 0;

    carrinho.forEach(function (produto) {
        const valorProduto = produto.preco * produto.quantidade;
        subtotal += valorProduto;

        const cardProduto = document.createElement("div");
        cardProduto.className = "card shadow-sm mb-3";

        cardProduto.innerHTML = `
            <div class="card-body">
                <div class="row align-items-center">

                    <div class="col-md-5">
                        <h5 class="fw-bold"></h5>
                        <p class="text-muted mb-1">
                            ${formatarPreco(produto.preco)} cada
                        </p>
                    </div>

                    <div class="col-md-3">
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-outline-secondary"
                                data-acao="diminuir"
                                data-id="${produto.id}">
                                −
                            </button>

                            <span class="fw-bold">${produto.quantidade}</span>

                            <button class="btn btn-outline-secondary"
                                data-acao="aumentar"
                                data-id="${produto.id}">
                                +
                            </button>
                        </div>
                    </div>

                    <div class="col-md-2 mt-2 mt-md-0">
                        <strong>${formatarPreco(valorProduto)}</strong>
                    </div>

                    <div class="col-md-2 mt-2 mt-md-0">
                        <button class="btn btn-outline-danger btn-sm"
                            data-acao="remover"
                            data-id="${produto.id}">
                            Remover
                        </button>
                    </div>

                </div>
            </div>
        `;

        cardProduto.querySelector("h5").textContent = produto.nome;
        areaCarrinho.appendChild(cardProduto);
    });

    if (subtotalCarrinho) {
        subtotalCarrinho.textContent = formatarPreco(subtotal);
    }

    if (totalCarrinho) {
        totalCarrinho.textContent = formatarPreco(subtotal);
    }

    if (resumoCarrinho) {
        resumoCarrinho.classList.remove("d-none");
    }

    atualizarContadorCarrinho();
}

/* =========================================
   ALTERAR QUANTIDADE E REMOVER
========================================= */

if (areaCarrinho) {
    areaCarrinho.addEventListener("click", function (evento) {
        const botao = evento.target.closest("button[data-acao]");

        if (!botao) {
            return;
        }

        const acao = botao.dataset.acao;
        const id = botao.dataset.id;

        let carrinho = obterCarrinho();

        const produto = carrinho.find(function (item) {
            return item.id === id;
        });

        if (!produto) {
            return;
        }

        if (acao === "aumentar") {
            produto.quantidade++;
        }

        if (acao === "diminuir") {
            produto.quantidade--;

            if (produto.quantidade <= 0) {
                carrinho = carrinho.filter(function (item) {
                    return item.id !== id;
                });
            }
        }

        if (acao === "remover") {
            carrinho = carrinho.filter(function (item) {
                return item.id !== id;
            });
        }

        salvarCarrinho(carrinho);
        atualizarCarrinho();
    });
}

/* =========================================
   INICIALIZAÇÃO
========================================= */

atualizarContadorCarrinho();
atualizarCarrinho();
