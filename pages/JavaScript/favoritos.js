var WHATSAPP = "5511996188936"; 
var ITEMS = [
  {id:"burger", cat:"Lanches", name:"Burger", desc:"Pão ciabata, burguer 180g, bacon, Catupiry, mussarela maionese da casa, alface americana, picles, tomate e cebola roxa. Acompanha batata crinckle e uma bebida a sua escolha.", price:3500, image:"../assets/img/burguer.jpeg"},
  {id:"cheddar", cat:"Lanches", name:"Cheddar", desc:"Pão australiano, burguer de 180g, cheddar, cheddar cremoso cebola caramelizada. Acompanha batata crinckle e uma bebida a sua escolha.", price:3400, image:"../assets/img/cheddar.jpeg"},
  {id:"costela", cat:"Lanches", name:"Costela", desc:"Pão australiano, burguer 180g, cebola empanada, bacon, cheddar, barbecue, cebola caramelizada e alface americana Acompanha batata crinckle e uma bebida a sua escolha.", price:3500, image:"../assets/img/costela.jpeg"},
  {id:"frango", cat:"Lanches", name:"Frango", desc:"Pão de brioche, burguer de frango 200g, bacon Catupiry, mussarela, maionese da casa, alface americana, tomate e cebola roxa. Acompanha batata crinckle e uma bebida a sua escolha.", price:3500, image:"../assets/img/frango.jpeg"},
  {id:"linguiça", cat:"Lanches", name:"Linguiça", desc:"Pão de brioche com gergelim, burguer de linguiça 180g, bacon, Catupiry, mussarela, maionese da casa, alface americana, tomate e cebola roxa Acompanha batata crinckle e uma bebida a sua escolha.", price:3500, image:"../assets/img/linguica.jpeg"},
  {id:"salmão", cat:"Lanches", name:"Salmão", desc:"Pão australiano, burguer de salmão 150g, cream cheese, cebolinha e rúcula. Acompanha batata crinckle e uma bebida a sua escolha.", price:4000, image:"../assets/img/salmao.jpeg"},
  {id:"vegetariano", cat:"Lanches", name:"Vegetariano", desc:"Pão australiano, queijo coalho 200g, maionese da casa, rúcula e tomate seco. Acompanha batata crinckle e uma bebida a sua escolha.", price:3900, image:"../assets/img/vegetariano.jpeg"},
  {id:"coxinha", cat:"Porções", name:"Coxinha", desc:"Massa fina, recheada com frango desfiado", price:800, image:"../assets/img/coxinha.jpeg"},
  {id:"nuggets", cat:"Porções", name:"Nuggets", desc:"Porção de nuggets, servida com maionese", price:1600, image:"../assets/img/nuggets.jpeg"},
  {id:"batata", cat:"Porções", name:"Batata Frita Grande", desc:"Porção grande, servida com ketchup e maionese", price:1200, image:"../assets/img/batatas.jpeg"},
  {id:"milkshake", cat:"Sobremesas", name:"Milk-shake", desc:"300 ml com sorvete batido com leite, Nutella de decoração,amendoim em cima e chantile.", price:1500, image:"../assets/img/milshake.jpeg"},
  {id:"milkshake2", cat:"Sobremesas", name:"Milk-shake de Nutella", desc:"300 ml de sorvete com leite e Nutella ", price:1000, image:"../assets/img/milkshakeChoco.png"},
];
var CATS = ["Todos","Lanches","Porções","Sobremesas"];
var favs = {};
var tab = "menu";
var cat = "Todos";

try {
  var saved = localStorage.getItem("lanchonete-favoritos");
  if (saved) favs = JSON.parse(saved) || {};
} catch (e) { favs = {}; }

function save(){
  try { localStorage.setItem("lanchonete-favoritos", JSON.stringify(favs)); } catch (e) {}
}
function brl(c){ return "R$ " + (c/100).toFixed(2).replace(".", ","); }
function byId(id){ return ITEMS.filter(function(i){ return i.id === id; })[0]; }
function favIds(){ return Object.keys(favs).filter(function(id){ return byId(id); }); }

function renderMenu(){
  var chips = CATS.map(function(c){
    return '<button class="chip" data-cat="'+c+'" aria-pressed="'+(c===cat)+'">'+c+'</button>';
  }).join("");
  var rows = ITEMS.filter(function(i){ return cat==="Todos" || i.cat===cat; }).map(function(i){
    var on = !!favs[i.id];
    return '<div class="item"><div class="emoji"><img src="'+i.image+'" alt=""></div>'+
      '<div class="info"><h3>'+i.name+'</h3><p>'+i.desc+'</p><span class="price">'+brl(i.price)+'</span></div>'+
      '<button class="heart" data-heart="'+i.id+'" aria-pressed="'+on+'" aria-label="'+(on?"Remover dos favoritos: ":"Adicionar aos favoritos: ")+i.name+'">'+(on?"♥":"♡")+'</button></div>';
  }).join("");
  return '<div class="chips">'+chips+'</div>'+rows;
}

function renderFav(){
  var ids = favIds();
  if (!ids.length){
    return '<div class="empty"><div class="big" aria-hidden="true">♡</div><h2>Nenhum favorito ainda</h2>'+
      '<p>Toque no coração dos itens do cardápio para montar sua comanda.</p>'+
      '<button data-go="menu">Ver cardápio</button></div>';
  }
  var total = 0, msg = "Olá! Quero pedir:%0A";
  var lines = ids.map(function(id){
    var i = byId(id), q = favs[id], s = i.price*q;
    total += s;
    msg += q+"x "+encodeURIComponent(i.name)+"%0A";
    return '<div class="line"><div class="nm">'+i.name+'</div>'+
      '<div class="step"><button data-dec="'+id+'" aria-label="Diminuir '+i.name+'">−</button><span>'+q+'</span><button data-inc="'+id+'" aria-label="Aumentar '+i.name+'">+</button></div>'+
      '<div class="sum">'+brl(s)+'</div></div>';
  }).join("");
  msg += "%0ATotal: "+encodeURIComponent(brl(total));
  return '<div class="ticket"><h2>Minha comanda</h2><p class="sub">Seus favoritos, prontos para pedir.</p>'+lines+
    '<div class="total"><span>Total</span><span>'+brl(total)+'</span></div></div>'+
    '<a class="cta" href="https://wa.me/'+WHATSAPP+'?text='+msg+'" target="_blank" rel="noopener">Pedir pelo WhatsApp</a>'+
    '<button class="link" data-clear="1">Limpar favoritos</button>';
}

function render(){
  document.getElementById("count").textContent = favIds().length;
  document.getElementById("tab-menu").setAttribute("aria-selected", tab==="menu");
  document.getElementById("tab-fav").setAttribute("aria-selected", tab==="fav");
  document.getElementById("view").innerHTML = tab==="menu" ? renderMenu() : renderFav();
}

document.addEventListener("click", function(ev){
  var t = ev.target.closest("button");
  if (!t) return;
  if (t.id === "tab-menu") tab = "menu";
  else if (t.id === "tab-fav") tab = "fav";
  else if (t.dataset.go) tab = t.dataset.go;
  else if (t.dataset.cat) cat = t.dataset.cat;
  else if (t.dataset.heart){
    var id = t.dataset.heart;
    if (favs[id]) delete favs[id]; else favs[id] = 1;
    save();
  }
  else if (t.dataset.inc){ favs[t.dataset.inc] += 1; save(); }
  else if (t.dataset.dec){
    var d = t.dataset.dec;
    favs[d] -= 1;
    if (favs[d] < 1) delete favs[d];
    save();
  }
  else if (t.dataset.clear){ favs = {}; save(); }
  else return;
  render();
});

render();
