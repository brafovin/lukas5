// Arbeitstitel der Marke – hier zentral ändern
const BRAND = "4SEASONS";

const SEASON_LABEL = {fruehling:"Frühling", sommer:"Sommer", herbst:"Herbst", winter:"Winter"};
const SEASON_ICON  = {fruehling:"🌱", sommer:"☀️", herbst:"🍂", winter:"❄️"};

// Beispielprodukte – später durch echte Produkte/Fotos ersetzen
const PRODUCTS = [
  {id:"hoodie",   name:"Essential Hoodie",   price:59,  seasons:["herbst","winter","fruehling"], color:"var(--herbst)"},
  {id:"tee",      name:"Basic T-Shirt",      price:29,  seasons:["fruehling","sommer"],          color:"var(--sommer)"},
  {id:"overshirt",name:"Overshirt",          price:79,  seasons:["fruehling","herbst"],          color:"var(--fruehling)"},
  {id:"jacket",   name:"Padded Jacket",      price:129, seasons:["winter"],                      color:"var(--winter)"},
  {id:"cap",      name:"Logo Cap",           price:24,  seasons:["fruehling","sommer"],          color:"var(--sommer)"},
  {id:"beanie",   name:"Beanie",             price:22,  seasons:["herbst","winter"],             color:"var(--winter)"},
  {id:"shorts",   name:"Summer Shorts",      price:39,  seasons:["sommer"],                      color:"var(--sommer)"},
  {id:"sweater",  name:"Knit Sweater",       price:89,  seasons:["herbst","winter"],             color:"var(--herbst)"},
];
const SIZES = ["S","M","L","XL"];

const $ = s => document.querySelector(s);
const eur = n => n.toLocaleString("de-DE",{style:"currency",currency:"EUR"});

let cart = [];
try { cart = JSON.parse(localStorage.getItem("cart")||"[]"); } catch(e){}
const saveCart = () => { try{ localStorage.setItem("cart", JSON.stringify(cart)); }catch(e){} };

const selectedSize = {}; // productId -> size

function renderGrid(season="alle"){
  const list = PRODUCTS.filter(p => season==="alle" || p.seasons.includes(season));
  $("#grid").innerHTML = list.map(p => `
    <article class="card">
      <div class="img" style="background:${p.color}">${SEASON_ICON[p.seasons[0]]}</div>
      <div class="body">
        <span class="tags">${p.seasons.map(s=>SEASON_LABEL[s]).join(" · ")}</span>
        <h3>${p.name}</h3>
        <span class="price">${eur(p.price)}</span>
        <div class="sizes">${SIZES.map(s=>`<button class="size ${selectedSize[p.id]===s?"sel":""}" data-id="${p.id}" data-size="${s}">${s}</button>`).join("")}</div>
        <button class="btn add" data-id="${p.id}">In den Warenkorb</button>
      </div>
    </article>`).join("");
}

function renderCart(){
  $("#cartCount").textContent = cart.reduce((a,i)=>a+i.qty,0);
  $("#cartItems").innerHTML = cart.length
    ? cart.map((i,idx)=>`<li><span>${i.qty}× ${i.name} (${i.size})</span><span>${eur(i.price*i.qty)} <button class="rm" data-idx="${idx}" aria-label="Entfernen">✕</button></span></li>`).join("")
    : "<li>Dein Warenkorb ist leer.</li>";
  $("#cartTotal").textContent = eur(cart.reduce((a,i)=>a+i.price*i.qty,0));
}

function toggleCart(open){
  $("#cart").classList.toggle("open", open);
  $("#cart").setAttribute("aria-hidden", String(!open));
  $("#overlay").hidden = !open;
}

document.addEventListener("click", e => {
  const t = e.target;
  if (t.matches(".chip")){
    document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
    t.classList.add("active"); renderGrid(t.dataset.season);
  } else if (t.matches(".size")){
    selectedSize[t.dataset.id] = t.dataset.size;
    t.parentElement.querySelectorAll(".size").forEach(b=>b.classList.toggle("sel", b===t));
  } else if (t.matches(".add")){
    const p = PRODUCTS.find(x=>x.id===t.dataset.id);
    const size = selectedSize[p.id];
    if(!size){ alert("Bitte zuerst eine Größe wählen."); return; }
    const ex = cart.find(i=>i.id===p.id && i.size===size);
    ex ? ex.qty++ : cart.push({id:p.id,name:p.name,price:p.price,size,qty:1});
    saveCart(); renderCart(); toggleCart(true);
  } else if (t.matches(".rm")){
    cart.splice(+t.dataset.idx,1); saveCart(); renderCart();
  }
});
$("#cartBtn").onclick = () => toggleCart(true);
$("#cartClose").onclick = $("#overlay").onclick = () => toggleCart(false);
$("#checkoutBtn").onclick = () => alert("Demo: Hier folgt später die Anbindung an Shopify/Stripe.");
$("#newsletterForm").onsubmit = e => { e.preventDefault(); $("#newsletterMsg").hidden = false; };

document.querySelectorAll("[data-brand]").forEach(el => el.textContent = BRAND);
$("#year").textContent = new Date().getFullYear();
renderGrid(); renderCart();
