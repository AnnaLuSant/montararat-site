
const CHAVE_CARRINHO = "montararat_carrinho";

const moeda = valor =>
  Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

function obterCarrinho() {
  try {
    const dados = JSON.parse(
      localStorage.getItem(CHAVE_CARRINHO) || "[]"
    );
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function salvarCarrinho(carrinho) {
  localStorage.setItem(
    CHAVE_CARRINHO,
    JSON.stringify(carrinho)
  );
}

function adicionarAoCarrinho(evento) {
  evento.preventDefault();

  const form = evento.currentTarget;
  const tipo = document.querySelector(
    'input[name="valor"]:checked'
  )?.value || "Lanche";

  const nome = form.dataset.produto;
  const precoBase = Number(
    tipo === "Combo"
      ? form.dataset.precoCombo
      : form.dataset.precoLanche
  );

  if (!nome || !Number.isFinite(precoBase) || precoBase <= 0) {
    alert("Não foi possível identificar o preço do produto.");
    return;
  }

  const extras = [];
  let precoExtras = 0;

  form.querySelectorAll('input[name="extra[]"]:checked')
    .forEach(campo => {
      const nomeExtra = campo.dataset.nome;
      const preco = Number(campo.dataset.preco);

      if (!nomeExtra || !Number.isFinite(preco) || preco < 0) {
        return;
      }

      const detalhe = campo.closest("p");
      const seletor = detalhe?.querySelector("select");

      const complemento = seletor
        ? ` - ${seletor.selectedOptions[0].textContent.trim()}`
        : "";

      extras.push({
        nome: nomeExtra + complemento,
        preco
      });

      precoExtras += preco;
    });

  const refrigerante = tipo === "Combo"
    ? form.querySelector("#refrigerante")?.selectedOptions[0]?.textContent.trim() || "Não selecionado"
    : "Não incluso";

  const observacoes = form.querySelector(
    '[name="observacoes"]'
  )?.value.trim() || "";

  const item = {
    id: crypto.randomUUID(),
    nome,
    tipo,
    refrigerante,
    extras,
    observacoes,
    precoUnitario: precoBase + precoExtras,
    quantidade: 1
  };

  const carrinho = obterCarrinho();
  carrinho.push(item);
  salvarCarrinho(carrinho);

  alert(`${tipo} ${nome} adicionado ao carrinho!`);
  window.location.href = "/pages/carrinho.html";
}

function alterarQuantidade(id, variacao) {
  const carrinho = obterCarrinho();
  const item = carrinho.find(produto => produto.id === id);

  if (!item) return;

  item.quantidade += variacao;

  if (item.quantidade <= 0) {
    removerItem(id);
    return;
  }

  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

function removerItem(id) {
  const carrinho = obterCarrinho().filter(
    produto => produto.id !== id
  );

  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

function renderizarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  const totalElemento = document.getElementById("total-carrinho");

  if (!lista || !totalElemento) return;

  lista.replaceChildren();

  const carrinho = obterCarrinho();
  let total = 0;

  if (carrinho.length === 0) {
    const mensagem = document.createElement("p");
    mensagem.textContent = "Seu carrinho está vazio.";
    lista.appendChild(mensagem);
  }

  carrinho.forEach(item => {
    const subtotal = item.precoUnitario * item.quantidade;
    total += subtotal;

    const card = document.createElement("article");
    card.className = "card p-3 mb-3";

    const titulo = document.createElement("h3");
    titulo.textContent = `${item.tipo} ${item.nome}`;

    const detalhes = document.createElement("p");
    const extras = item.extras.map(extra => extra.nome).join(", ");

    detalhes.textContent = [
      item.tipo === "Combo"
        ? `Refrigerante: ${item.refrigerante}`
        : "",
      extras ? `Extras: ${extras}` : "",
      item.observacoes
        ? `Observações: ${item.observacoes}`
        : ""
    ].filter(Boolean).join(" | ");

    const preco = document.createElement("p");
    preco.textContent = `Subtotal: ${moeda(subtotal)}`;


    const controles = document.createElement("div");
    controles.className = "controle-quantidade";

    // BOTÃO DIMINUIR
    const menos = document.createElement("button");
    menos.type = "button";
    menos.className = "btn-quantidade-menos";
    menos.textContent = "−";
    menos.setAttribute("aria-label", "Diminuir quantidade");

    menos.onclick = () => {
      alterarQuantidade(item.id, -1);
    };

    // CONTADOR
    const quantidade = document.createElement("span");
    quantidade.className = "quantidade-valor";
    quantidade.textContent = item.quantidade;

    // BOTÃO AUMENTAR
    const mais = document.createElement("button");
    mais.type = "button";
    mais.className = "btn-quantidade-mais";
    mais.textContent = "+";
    mais.setAttribute("aria-label", "Aumentar quantidade");

    mais.onclick = () => {
      alterarQuantidade(item.id, 1);
    };

    // ADICIONAR ELEMENTOS
    controles.append(menos, quantidade, mais);

    card.append(titulo, detalhes, preco, controles);
    lista.appendChild(card);
  });

  totalElemento.textContent = moeda(total);

  const botaoPagamento = document.getElementById("ir-pagamento");
  if (botaoPagamento) {
    botaoPagamento.disabled = carrinho.length === 0;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("form-pedido");

  if (formulario && formulario.dataset.produto) {
    formulario.addEventListener("submit", adicionarAoCarrinho);
  }

  renderizarCarrinho();
});
