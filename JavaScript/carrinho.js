// Lê a comanda (se estiver vazia, começa com lista vazia)
function lerCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

// Guarda a comanda
function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Pega o que o cliente escolheu no formulário e anota
function adicionarAoCarrinho(evento) {
  evento.preventDefault(); // impede o envio normal do formulário

  const form = document.getElementById("form-pedido");

  const item = {
    produto: document.title,
    tipo: document.querySelector('input[name="valor"]:checked').value,
    refrigerante: form.refrigerante.value,
    extras: [...form.querySelectorAll('input[name="extra[]"]:checked')]
      .map((extra) => extra.parentElement.textContent.trim()),
    observacoes: form.observacoes.value,
  };

  const carrinho = lerCarrinho();
  carrinho.push(item);
  salvarCarrinho(carrinho);

  alert("Adicionado ao carrinho!");
}

// Só liga o botão se o formulário existir nesta página
const formPedido = document.getElementById("form-pedido");
if (formPedido) {
  formPedido.addEventListener("submit", adicionarAoCarrinho);
}