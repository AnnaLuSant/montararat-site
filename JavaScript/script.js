/*Automatização do nav*/

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".main-nav .nav-link");
    const paginaAtual = window.location.pathname;

    links.forEach(link => {
        const caminhoLink = new URL(link.href).pathname;

        link.classList.toggle("active", caminhoLink === paginaAtual);
    });
});