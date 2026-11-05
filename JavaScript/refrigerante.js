const opcoes = document.querySelectorAll('input[name="valor"]');
const refrigerante = document.getElementById("refrigerante");

function atualizarRefrigerante() {
  const escolhido = document.querySelector('input[name="valor"]:checked');

  if (escolhido.value === "Combo") {
    refrigerante.disabled = false;
  } else {
    refrigerante.disabled = true;
    refrigerante.value = "nenhum";
  }
}

opcoes.forEach((opcao) => {
  opcao.addEventListener("change", atualizarRefrigerante);
});

atualizarRefrigerante();