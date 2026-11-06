document.addEventListener('DOMContentLoaded', () => {
  const atual = location.pathname.replace(/\/$/, '/index.html');
  document.querySelectorAll('.main-nav .nav-link').forEach(link => {
    const destino = new URL(link.href, location.href).pathname;
    const ativo = destino === atual;
    link.classList.toggle('active', ativo);
    if (ativo) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
});
