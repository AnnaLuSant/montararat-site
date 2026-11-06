
var WHATSAPP = "5511999999999"; // troque pelo número da lanchonete (DDI + DDD + número)
var ITEMS = [
  {id:"burger", cat:"Lanches", name:"Burger", desc:"Hambúrguer, queijo, alface, tomate e molho da casa", price:2200, e:"🍔"},
  {id:"xbacon", cat:"Lanches", name:"X-Bacon", desc:"Hambúrguer, queijo, bacon crocante e maionese", price:2600, e:"🥓"},
  {id:"misto", cat:"Lanches", name:"Misto Quente", desc:"Presunto e queijo na chapa", price:1200, e:"🥪"},
  {id:"batata", cat:"Porções", name:"Batata Frita", desc:"Porção grande, serve duas pessoas", price:2400, e:"🍟"},
  {id:"pastel", cat:"Porções", name:"Pastel de Queijo", desc:"Massa fina, frito na hora", price:800, e:"🥟"},
  {id:"laranja", cat:"Bebidas", name:"Suco de Laranja", desc:"Natural, 400 ml", price:900, e:"🍊"},
  {id:"refri", cat:"Bebidas", name:"Refrigerante Lata", desc:"350 ml, gelado", price:600, e:"🥤"},
  {id:"pudim", cat:"Sobremesas", name:"Pudim de Leite", desc:"Fatia generosa com calda de caramelo", price:1000, e:"🍮"},
  {id:"acai", cat:"Sobremesas", name:"Açaí na Tigela", desc:"300 ml com banana e granola", price:1600, e:"🍇"}
];
var CATS = ["Todos","Lanches","Porções","Bebidas","Sobremesas"];
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
    return '<div class="item"><div class="emoji" aria-hidden="true">'+i.e+'</div>'+
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
