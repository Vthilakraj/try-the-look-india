"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const money = (amount) => inr.format(amount);
const categories = ["Everyday Casual", "Streetwear", "Office & Formal", "Festive & Wedding", "South Indian Traditional", "Activewear", "Winter & Rain", "Lounge & Essentials", "Shoes & Accessories"];
const palette = {
  Ivory:"#e9e1d0", "Sky Blue":"#92afc2", Olive:"#65634b", Charcoal:"#34383e",
  White:"#f8f8f2", Mushroom:"#8d7665", Espresso:"#4d3227", Sage:"#929c79",
  Tan:"#ae7548", Navy:"#263754", Forest:"#304f3d", "Jet Black":"#232726",
  Sand:"#bba785", Wine:"#683b4c", Mustard:"#b6904f", Slate:"#767b81", Rust:"#a65838"
};
const fits = {
  top: { sizes:["XS","S","M","L","XL","XXL"], measurement:"Chest", cm:[86,92,98,104,110,116] },
  bottom: { sizes:["28","30","32","34","36","38","40"], measurement:"Waist", cm:[71,76,81,86,91,97,102] },
  shoe: { sizes:["UK 6","UK 7","UK 8","UK 9","UK 10","UK 11"], measurement:"Foot length", cm:[24.5,25.4,26.2,27.1,27.9,28.8] },
  one: { sizes:["One size"] }
};
const products = [
  ["Everyday Cotton Tee",299,[0,7],"top",["Ivory","Navy","Jet Black"],"Cotton jersey","Relaxed crew neck"],
  ["Straight-Leg Jeans",899,[0,1],"bottom",["Sky Blue","Charcoal"],"Cotton denim","Straight leg"],
  ["Canvas Low-Tops",599,[0,1,8],"shoe",["Ivory","Jet Black"],"Canvas and rubber","Lace-up"],
  ["Utility Cargo Pants",899,[1],"bottom",["Olive","Charcoal"],"Cotton ripstop","Straight leg"],
  ["Workwear Overshirt",999,[1,6],"top",["Charcoal","Olive"],"Brushed cotton twill","Boxy fit"],
  ["Oxford Cotton Shirt",699,[2,4],"top",["White","Sky Blue"],"Cotton Oxford","Regular fit"],
  ["Tailored Blazer",2299,[2],"top",["Mushroom","Navy"],"Suiting blend","Single-breasted"],
  ["Classic Penny Loafers",1199,[2,8],"shoe",["Espresso","Jet Black"],"Faux leather","Slip-on"],
  ["Embroidered Kurta",899,[3],"top",["Sage","Wine","Navy"],"Cotton blend","Knee-length"],
  ["Cotton Pyjama Trousers",399,[3,7],"bottom",["Ivory","White"],"Cotton","Drawstring waist"],
  ["Traditional Mojaris",499,[3,8],"shoe",["Tan","Espresso"],"Faux leather","Slip-on"],
  ["Dry-Fit Training Tee",449,[5],"top",["Navy","Jet Black"],"Quick-dry polyester","Regular fit"],
  ["Tapered Track Joggers",649,[5,7],"bottom",["Charcoal","Navy"],"Stretch knit","Tapered leg"],
  ["Gold-Border Veshti",599,[4],"one",["Ivory"],"Cotton with woven border","Wrap"],
  ["Everyday Strap Sandals",499,[4,8],"shoe",["Tan","Espresso"],"Faux leather and rubber","Adjustable straps"],
  ["Fleece Pullover Hoodie",799,[1,6,7],"top",["Forest","Charcoal"],"Cotton-blend fleece","Relaxed fit"],
  ["Piqué Polo",499,[0],"top",["Forest","Navy"],"Cotton piqué","Regular fit"],
  ["Striped Casual Shirt",599,[0],"top",["Sky Blue","Sage"],"Cotton poplin","Regular fit"],
  ["Flat-Front Chinos",799,[0,2],"bottom",["Sand","Navy"],"Stretch cotton twill","Straight leg"],
  ["Cotton Chino Shorts",449,[0],"bottom",["Sand","Olive"],"Cotton twill","Above the knee"],
  ["Textured Necktie",249,[2,8],"one",["Wine","Navy"],"Textured polyester","Standard length"],
  ["Quilted Nehru Jacket",1099,[3],"top",["Ivory","Navy"],"Quilted cotton blend","Band collar"],
  ["Embroidered Sherwani",2499,[3],"top",["Wine","Navy"],"Brocade blend","Long tailored fit"],
  ["Traditional Pleated Dhoti",649,[3,4],"one",["Mustard","Ivory"],"Cotton blend","Wrap"],
  ["Running Shorts",349,[5],"bottom",["Slate","Navy"],"Quick-dry polyester","Elastic waist"],
  ["Mesh Training Shoes",1199,[5,8],"shoe",["White","Charcoal"],"Breathable mesh and rubber","Lace-up"],
  ["Ribbed Crew Sweater",799,[6],"top",["Rust","Wine"],"Soft acrylic knit","Regular fit"],
  ["Packable Rain Jacket",999,[6],"top",["Mustard","Navy"],"Water-resistant nylon shell","Regular fit"],
  ["Cotton Lounge Set",749,[7],"top",["Jet Black","Navy"],"Cotton jersey","Relaxed set"],
  ["Everyday Buckle Belt",349,[8],"bottom",["Jet Black","Espresso"],"Faux leather","Adjustable"],
  ["Cotton Baseball Cap",299,[1,5,8],"one",["Sky Blue","Navy"],"Cotton twill","Adjustable"],
  ["Canvas Crossbody Bag",499,[1,8],"one",["Tan","Charcoal"],"Canvas","Adjustable strap"],
  ["Heavyweight Boxy Tee",549,[0,1],"top",["Charcoal","Ivory"],"Heavy cotton jersey","Boxy fit"],
  ["Indigo Denim Jacket",1399,[1,6],"top",["Navy","Charcoal"],"Heavy cotton denim","Relaxed layer"],
  ["Cable Knit Sweater Vest",999,[0,6],"top",["Ivory","Forest"],"Cotton-blend cable knit","Regular fit"],
  ["Pine Corduroy Shirt",899,[0,6],"top",["Forest","Rust"],"Fine-wale corduroy","Relaxed fit"],
  ["Cropped Tailored Trousers",999,[0,2],"bottom",["Sand","Charcoal"],"Cotton suiting blend","Tapered crop"],
  ["Lace-Up Oxford Shoes",1499,[2,8],"shoe",["Jet Black","Espresso"],"Faux leather","Lace-up"],
  ["Midnight Two-Piece Suit",3799,[2],"top",["Navy","Charcoal"],"Woven suiting blend","Tailored set"],
  ["Printed Pocket Square",249,[2,8],"one",["Espresso","Wine"],"Soft twill","Square"],
  ["Ivory Occasion Kurta",999,[3],"top",["Ivory","Sage"],"Embroidered cotton","Knee-length"],
  ["Woven Nehru Vest",1099,[3],"top",["Wine","Ivory"],"Woven cotton blend","Standing collar"],
  ["Embroidered Evening Sherwani",2899,[3],"top",["Jet Black","Navy"],"Embroidered brocade blend","Long tailored fit"],
  ["Kolhapuri Leather Sandals",749,[3,4,8],"shoe",["Tan","Espresso"],"Leather","Open toe"],
  ["Sleeveless Training Top",399,[5],"top",["Charcoal","Navy"],"Quick-dry mesh","Relaxed fit"],
  ["Lightweight Sports Windbreaker",999,[5,6],"top",["Jet Black","Forest"],"Lightweight nylon","Regular fit"],
  ["Soft Cotton Lounge Joggers",649,[7],"bottom",["Ivory","Charcoal"],"Cotton blend","Relaxed leg"],
  ["Woven Gym Duffel",799,[5,8],"one",["Jet Black","Navy"],"Woven polyester","Hand and shoulder carry"]
].map(([name, price, groups, fit, colours, fabric, cut], id) => ({id,name,price,groups,fit,colours,fabric,cut}));
const looks = [
  {name:"The Everyday Edit", group:0, price:1599, items:[0,1,2], description:"An ivory tee, easy blue denim and clean canvas lows."},
  {name:"Street Utility", group:1, price:2199, items:[4,3,2], description:"A charcoal overshirt and olive cargos with canvas lows."},
  {name:"After Hours", group:2, price:4499, items:[6,5,18,7], description:"A warm neutral blazer, crisp Oxford and penny loafers."},
  {name:"Festive Ease", group:3, price:1599, items:[8,9,10], description:"A sage embroidered kurta, ivory pyjamas and tan mojaris."},
  {name:"Training Day", group:5, price:1999, items:[11,12,25], description:"Breathable navy training layers and mesh trainers."},
  {name:"The Veshti Edit", group:4, price:1599, items:[5,13,14], description:"A white cotton shirt, gold-border veshti and leather-look sandals."},
  {name:"Denim District", group:1, price:2899, items:[33,0,1,2], description:"An indigo denim jacket layered over cotton with straight-leg jeans and canvas lows."},
  {name:"Midnight Tailoring", group:2, price:5499, items:[38,5,37], description:"A midnight suit with a crisp shirt and black lace-up Oxfords."},
  {name:"Courtyard Ceremony", group:3, price:2899, items:[41,40,9,43], description:"A woven Nehru vest, ivory embroidered kurta and brown Kolhapuris."},
  {name:"Morning Miles", group:5, price:1999, items:[44,12,25], description:"A sleeveless training top, tapered joggers and mesh shoes."},
  {name:"Soft Structure", group:6, price:3499, items:[34,5,36,7], description:"An ivory cable knit over an Oxford, with tailored trousers and loafers."},
  {name:"Evening Ceremony", group:3, price:3499, items:[42,9,10], description:"A black embroidered sherwani with ivory trousers and tan mojaris."}
].map((look,id) => ({...look,id,original:look.items.reduce((sum,item) => sum + products[item].price,0)}));

const asset = (file) => "assets/" + file;
const model = (id) => asset("look-" + id + ".webp");
const photo = (id, colour = 0, view = "front") => {
  if (view === "back") return asset(`p-${id}-${colour}-back.webp`);
  return asset(`p-${id}-${colour}.webp`);
};
const swatchStyle = (colour) => `--swatch:${palette[colour]}`;
const itemImage = (item, colour = 0) => `<img src="${photo(item.id,colour)}" alt="${item.colours[colour]} ${item.name}" loading="lazy">`;
const lookupSize = (product) => fits[product.fit].sizes;
const options = (list) => list.map((value) => `<option>${value}</option>`).join("");
const colourOption = (item) => item.colours.map((value,index) => `<option value="${index}">${value}</option>`).join("");
const closeButton = '<button class="circle" type="button" data-close aria-label="Close">×</button>';
function dialogHead(id,title) {
  return `<div class="dialog-head"><h2 id="${id}">${title}</h2>${closeButton}</div>`;
}
const openDialog = (id) => {
  $$("dialog[open]").forEach((dialog) => dialog.close());
  $(id).showModal();
};
let toastTimer;
function notify(message) {
  $("#toast").textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $("#toast").textContent = ""; },2500);
}

class RunwaySection extends HTMLElement {
  index = 0;
  timer = null;
  connectedCallback() {
    this.stage = $("#stage",this);
    this.list = $("#orbit",this);
    this.pagination = $("#pagination",this);
    this.list.innerHTML = looks.map((look) => `
      <div class="figure">
        <img src="${model(look.id)}" alt="${look.name} styled head to toe" loading="${look.id < 3 ? "eager" : "lazy"}" draggable="false">
        ${look.items.map((id,position) => {
          const top = look.items.length === 4 ? [28,39,62,85][position] : [29,58,85][position];
          const left = [65,29,63,62][position];
          return `<button class="hotspot" type="button" data-product="${id}" aria-label="View ${products[id].name}" style="--top:${top}%;--left:${left}%">+</button>`;
        }).join("")}
      </div>`).join("");
    this.pagination.innerHTML = looks.map((look) => `<button type="button" data-look="${look.id}" aria-label="${look.name}"></button>`).join("");
    $("#prev",this).onclick = () => this.go(this.index - 1);
    $("#next",this).onclick = () => this.go(this.index + 1);
    $("#play",this).onclick = () => this.setPlaying(!this.timer);
    this.pagination.onclick = (event) => {
      const dot = event.target.closest("[data-look]");
      if (dot) this.go(Number(dot.dataset.look));
    };
    this.stage.addEventListener("keydown", (event) => {
      if (!["ArrowLeft","ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      this.go(this.index + (event.key === "ArrowRight" ? 1 : -1));
    });
    this.stage.addEventListener("pointerdown", (event) => {
      if (this.stage.classList.contains("is-3d")) return;
      if (event.target.closest("button") || event.button !== 0) return;
      this.start = {id:event.pointerId,x:event.clientX,y:event.clientY};
      this.stage.setPointerCapture(event.pointerId);
    });
    this.stage.addEventListener("pointerup", (event) => {
      if (this.start?.id !== event.pointerId) return;
      const x = event.clientX - this.start.x;
      const y = event.clientY - this.start.y;
      this.start = null;
      if (Math.abs(x) > 35 && Math.abs(x) > Math.abs(y)) this.go(this.index + (x < 0 ? 1 : -1));
    });
    this.stage.addEventListener("pointercancel", () => { this.start = null; });
    $("#buy-look",this).onclick = () => openBundle(this.index);
    $("#view-look",this).onclick = () => showLook(this.index);
    this.render();
  }
  setPlaying(playing) {
    clearInterval(this.timer);
    this.timer = playing ? setInterval(() => {
      if (!document.hidden && !$("dialog[open]") && !this.stage.matches(":hover") && (!this.stage.contains(document.activeElement) || document.activeElement === $("#play",this))) {
        this.index = (this.index + 1) % looks.length;
        this.render();
      }
    },5000) : null;
    const button = $("#play",this);
    button.textContent = playing ? "Ⅱ" : "▶";
    const label = playing ? "Pause outfit slideshow" : "Play outfit slideshow";
    button.setAttribute("aria-label",label);
    button.title = label;
  }
  go(index) {
    this.setPlaying(false);
    this.index = (index + looks.length) % looks.length;
    this.render();
  }
  render() {
    const look = looks[this.index];
    this.dispatchEvent(new CustomEvent("runway:look",{detail:this.index}));
    [...this.list.children].forEach((figure,index) => {
      const relative = (index - this.index + looks.length) % looks.length;
      figure.className = "figure " + ({0:"front",1:"ahead",[looks.length-1]:"back"}[relative] || "");
      figure.inert = relative !== 0;
    });
    [...this.pagination.children].forEach((dot,index) => {
      if (index === this.index) dot.setAttribute("aria-current","true");
      else dot.removeAttribute("aria-current");
    });
    $("#stage-category",this).textContent = categories[look.group];
    $("#look-number",this).textContent = `${String(look.id + 1).padStart(2,"0")} / ${String(looks.length).padStart(2,"0")}`;
    $("#look-title",this).textContent = look.name;
    $("#look-description",this).textContent = look.description;
    $("#look-products",this).innerHTML = look.items.map((id) => {
      const item = products[id];
      return `<button class="look-item" type="button" data-product="${item.id}">${itemImage(item)}
        <span><strong>${item.name}</strong><small>${money(item.price)}</small></span><span class="plus" aria-hidden="true">+</span>
      </button>`;
    }).join("");
    $("#look-price",this).textContent = money(look.price);
    $("#look-original",this).textContent = money(look.original);
    $("#look-saving",this).textContent = "Save " + money(look.original - look.price);
  }
}

const page = document.body.dataset.page || "directory";
const catalogEnabled = ["directory","collection","new","offers"].includes(page);
const group = Number(document.body.dataset.group ?? -1);
const defaultCategory = group >= 0 ? String(group) : "";
let category = defaultCategory;
let query = page === "directory" ? (new URLSearchParams(location.search).get("q") || "").trim().slice(0,90) : "";
const sortFilter = $("#sort-filter");
const catalogQuery = $("#catalog-query");
const sizeFilter = $("#size-filter");
const colourFilter = $("#colour-filter");
const priceFilter = $("#price-filter");
sizeFilter.insertAdjacentHTML("beforeend",options(Object.values(fits).flatMap(({sizes}) => sizes)));
colourFilter.insertAdjacentHTML("beforeend",options(Object.keys(palette).sort()));
$("#categories").innerHTML = ["All",...categories].map((label,index) =>
  `<button type="button" data-category="${index - 1}" aria-pressed="${index === 0}">${label}</button>`).join("");
function setCategory(value) {
  category = value;
  $$("#categories button").forEach((button) => {
    button.setAttribute("aria-pressed",String(button.dataset.category === (category || "-1")));
  });
}
function productCard(item, variant = 0) {
  return `<article class="card">
    <button type="button" data-product="${item.id}" data-colour="${variant}" aria-label="View ${item.name}">${itemImage(item,variant)}</button>
    <div class="card-content"><h3>${item.name}</h3><p>${item.colours[variant]} · ${item.colours.length} ${item.colours.length === 1 ? "colour" : "colours"}</p>
    <div class="card-footer"><strong>${money(item.price)}</strong><button class="text-button" data-product="${item.id}" data-colour="${variant}">View details</button></div></div>
  </article>`;
}
function ordered(results) {
  if (sortFilter.value === "low") return results.sort((a,b) => a.price - b.price);
  if (sortFilter.value === "high") return results.sort((a,b) => b.price - a.price);
  if (sortFilter.value === "latest") return results.sort((a,b) => b.id - a.id);
  return results;
}
function matchQuery(target) {
  const text = target.toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => text.includes(word));
}
function renderCatalog() {
  const budget = Number(priceFilter.value);
  const size = sizeFilter.value;
  const colour = colourFilter.value;
  $("#search-context").textContent = query ? "Results for “" + query + "”" : "";
  const match = (item) => (!size || lookupSize(item).includes(size)) && (!colour || item.colours.includes(colour)) &&
    matchQuery([item.name,item.fabric,item.cut,...item.colours,...item.groups.map((group) => categories[group])].join(" "));
  if (budget === 1999) {
    const results = ordered(looks.filter((look) => look.price < budget && (category === "" || look.group === Number(category)) &&
      (page !== "new" || look.id >= 6) && matchQuery([look.name,look.description,categories[look.group],...look.items.flatMap((id) => [products[id].name,...products[id].colours])].join(" ")) &&
      (!size || look.items.some((id) => lookupSize(products[id]).includes(size))) &&
      (!colour || look.items.some((id) => products[id].colours.includes(colour)))));
    $("#results-count").textContent = `${results.length} ${results.length === 1 ? "look" : "looks"}`;
    $("#catalog").innerHTML = results.map((look) => `<article class="card look-card">
      <button data-view="${look.id}" aria-label="View ${look.name}"><img src="${model(look.id)}" alt="${look.name}" loading="lazy"></button>
      <div class="card-content"><h3>${look.name}</h3><p>${categories[look.group]}</p>
      <div class="card-footer"><strong>${money(look.price)}</strong><button class="text-button" data-bundle="${look.id}">Choose sizes</button></div></div>
    </article>`).join("") || '<p class="empty">No outfits match these filters.</p>';
    return;
  }
  const results = ordered(products.filter((item) => (category === "" || item.groups.includes(Number(category))) &&
    (page !== "new" || item.id >= 32) && (!budget || item.price < budget) && match(item)));
  $("#results-count").textContent = `${results.length} ${results.length === 1 ? "item" : "items"}`;
  $("#catalog").innerHTML = results.map((item) => productCard(item,colour ? item.colours.indexOf(colour) : 0)).join("") ||
    '<p class="empty">No items match these filters.</p>';
}
$("#categories").onclick = (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  setCategory(button.dataset.category === "-1" ? "" : button.dataset.category);
  renderCatalog();
};
[sizeFilter,colourFilter,priceFilter,sortFilter].forEach((filter) => filter.addEventListener("change",renderCatalog));
function clearFilters() {
  setCategory(defaultCategory);
  query = "";
  catalogQuery.value = "";
  [sizeFilter,colourFilter,priceFilter,sortFilter].forEach((filter) => { filter.value = ""; });
}
$("#reset-filters").onclick = () => { clearFilters(); renderCatalog(); };
$(".collection .catalog-search").onsubmit = (event) => {
  event.preventDefault();
  query = catalogQuery.value.trim().slice(0,90);
  renderCatalog();
};
function sizesFor(item) {
  const { sizes,measurement,cm } = fits[item.fit];
  if (!cm) return "";
  return `<details><summary>Size guide</summary><table class="size-table">
    <thead><tr><th>Size</th><th>${measurement} (cm)</th><th>Inches</th></tr></thead>
    <tbody>${sizes.map((size,index) => `<tr><th scope="row">${size}</th><td>${cm[index]}</td><td>${(cm[index] / 2.54).toFixed(1)}</td></tr>`).join("")}</tbody>
  </table></details>`;
}
function careFor(item) {
  if (item.fit === "shoe" || [29,30,31].includes(item.id)) return "Wipe with a clean, damp cloth and air dry.";
  if ([6,21,22].includes(item.id)) return "Dry clean for best results.";
  return "Wash cold with similar colours and air dry.";
}
function sizeSelect(item) {
  return `<select name="size" required>${item.fit === "one" ? "" : '<option value="">Choose size</option>'}${options(lookupSize(item))}</select>`;
}
function openProduct(id,initialColour = 0) {
  const item = products[id];
  let colour = initialColour;
  let view = "front";
  const root = $("#product-content");
  root.innerHTML = `${dialogHead("product-title",item.name)}
    <div class="dialog-grid"><div><img class="product-photo" src="${photo(id,colour)}" alt="">
    <div class="photo-views" aria-label="Product photos">
      <button class="secondary" data-photo="front" aria-pressed="true" type="button">Front</button>
      <button class="secondary" data-photo="back" aria-pressed="false" type="button">Back</button>
      <button class="secondary" data-photo="detail" aria-pressed="false" type="button">Detail</button>
    </div></div>
    <form class="product-form"><strong class="price">${money(item.price)}</strong>
      <p>${item.fabric} · ${item.cut}</p>
      <div><strong>Colour</strong> <span class="colour-name"></span><div class="swatches" aria-label="Available colours">
        ${item.colours.map((name,index) => `<button type="button" class="swatch" data-swatch="${index}" style="${swatchStyle(name)}" title="${name}" aria-label="${name}"></button>`).join("")}
      </div></div>
      <label class="form-field">Size ${sizeSelect(item)}</label>${sizesFor(item)}
      <details><summary>Care instructions</summary><p>${careFor(item)}</p></details>
      <button class="primary" type="submit">Add to bag</button>
    </form></div>`;
  function updatePhoto() {
    const img = $(".product-photo",root);
    img.src = view === "detail" ? asset(`p-${id}-${colour}-detail.webp`) : photo(id,colour,view);
    img.alt = `${item.colours[colour]} ${item.name}, ${view} view`;
    $(".colour-name",root).textContent = item.colours[colour];
    $$("[data-swatch]",root).forEach((button,index) => button.setAttribute("aria-pressed",String(index === colour)));
    $$("[data-photo]",root).forEach((button) => button.setAttribute("aria-pressed",String(button.dataset.photo === view)));
  }
  $$("[data-swatch]",root).forEach((button) => button.onclick = () => { colour = Number(button.dataset.swatch); updatePhoto(); });
  $$("[data-photo]",root).forEach((button) => button.onclick = () => { view = button.dataset.photo; updatePhoto(); });
  $("form",root).onsubmit = (event) => {
    event.preventDefault();
    const size = new FormData(event.target).get("size");
    addToBag({kind:"item",id,variants:[{size,colour}]});
    $("#product-dialog").close();
    notify(item.name + " added to your bag");
  };
  updatePhoto();
  openDialog("#product-dialog");
}
function showLook(id) {
  const look = looks[id];
  $("#view-content").innerHTML = `${dialogHead("view-title",look.name)}<div class="dialog-grid">
    <img class="look-photo" src="${model(id)}" alt="${look.name} styled head to toe">
    <div><p>${look.description}</p><div>${look.items.map((id) => `<button class="look-item" data-product="${id}">
      ${itemImage(products[id])}<span><strong>${products[id].name}</strong><small>${money(products[id].price)}</small></span><span class="plus" aria-hidden="true">+</span></button>`).join("")}</div>
      <div class="look-total"><strong>${money(look.price)}</strong><span class="offer-pill">Save ${money(look.original - look.price)}</span></div>
      <button class="primary full-width" data-bundle="${id}">Add full look</button>
    </div></div>`;
  openDialog("#view-dialog");
}
function openBundle(id) {
  const look = looks[id];
  const root = $("#bundle-content");
  root.innerHTML = `${dialogHead("bundle-title",look.name)}<form>
    <p>Choose a colour and size for each piece.</p>
    ${look.items.map((id) => {
      const item = products[id];
      return `<div class="bundle-entry">${itemImage(item)}<div><strong>${item.name}</strong> <small>${money(item.price)}</small>
        <div class="variant-fields"><label class="form-field">Colour<select name="colour">${colourOption(item)}</select></label>
        <label class="form-field">Size${sizeSelect(item)}</label></div>
      </div></div>`;
    }).join("")}
    <div class="look-total"><div><strong>${money(look.price)}</strong><s>${money(look.original)}</s></div><span class="offer-pill">Save ${money(look.original - look.price)}</span></div>
    <button class="primary full-width" type="submit">Add full look to bag</button>
  </form>`;
  $$(".bundle-entry",root).forEach((row,index) => {
    $("[name=colour]",row).onchange = (event) => {
      const item = products[look.items[index]];
      const colour = Number(event.target.value);
      $("img",row).src = photo(item.id,colour);
      $("img",row).alt = item.colours[colour] + " " + item.name;
    };
  });
  $("form",root).onsubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const colours = data.getAll("colour");
    const variants = data.getAll("size").map((size,index) => ({size,colour:Number(colours[index])}));
    addToBag({kind:"look",id,variants});
    $("#bundle-dialog").close();
    notify(look.name + " added to your bag");
  };
  openDialog("#bundle-dialog");
}

const bagKey = "trythelook-india-bag-v1";
function readBag() {
  try {
    const saved = JSON.parse(localStorage.getItem(bagKey) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter((entry) => {
      if (!entry || !Number.isInteger(entry.id) || !Number.isInteger(entry.quantity) || entry.quantity < 1 || entry.quantity > 99) return false;
      const ids = entry.kind === "look" ? looks[entry.id]?.items : entry.kind === "item" && products[entry.id] ? [entry.id] : null;
      return ids && Array.isArray(entry.variants) && entry.variants.length === ids.length &&
        entry.variants.every((variant,index) => variant && lookupSize(products[ids[index]]).includes(variant.size) &&
          Number.isInteger(variant.colour) && products[ids[index]].colours[variant.colour]);
    });
  } catch { return []; }
}
let bag = readBag();
function saveBag() {
  try { localStorage.setItem(bagKey,JSON.stringify(bag)); } catch { /* Bag remains usable in this tab. */ }
  showBagCount();
}
function showBagCount() {
  $("#bag-count").textContent = bag.reduce((sum,entry) => sum + entry.quantity,0);
}
function addToBag(entry) {
  const row = bag.find((item) => item.kind === entry.kind && item.id === entry.id &&
    JSON.stringify(item.variants) === JSON.stringify(entry.variants));
  if (row) row.quantity = Math.min(99,row.quantity + 1);
  else bag.push({...entry,quantity:1});
  saveBag();
}
function renderBag() {
  const root = $("#bag-content");
  let total = 0;
  let savings = 0;
  root.innerHTML = dialogHead("bag-title","Your styling bag") + (bag.length ? bag.map((entry,index) => {
    const isLook = entry.kind === "look";
    const item = (isLook ? looks : products)[entry.id];
    total += item.price * entry.quantity;
    if (isLook) savings += (item.original - item.price) * entry.quantity;
    const formatVariant = (item,variant) => `${item.colours[variant.colour]} · Size ${variant.size}`;
    const variants = isLook ? `<ul>${item.items.map((id,i) => `<li>${products[id].name} · ${formatVariant(products[id],entry.variants[i])}</li>`).join("")}</ul>`
      : `<p>${formatVariant(item,entry.variants[0])}</p>`;
    return `<div class="bag-row">${isLook ? `<img src="${model(entry.id)}" alt="">` : itemImage(item,entry.variants[0].colour)}
      <div><strong>${item.name}</strong>${variants}<p>${money(item.price * entry.quantity)}</p></div>
      <div><div class="bag-actions"><button class="secondary" data-row="${index}" data-change="-1" aria-label="Decrease ${item.name} quantity">−</button>
      <span>${entry.quantity}</span><button class="secondary" data-row="${index}" data-change="1" aria-label="Increase ${item.name} quantity">+</button></div>
      <button class="text-button full-width" data-row="${index}" data-change="0">Remove</button></div>
    </div>`;
  }).join("") + `<div class="look-total"><span>Subtotal</span><strong>${money(total)}</strong></div>
    ${savings ? `<p class="bag-note">Bundle savings ${money(savings)}</p>` : ""}<p class="bag-note">Demo catalog prices</p>`
    : '<p class="empty">Your bag is empty. Add a piece or a full outfit from the runway.</p>');
}
$("#bag-content").onclick = (event) => {
  const button = event.target.closest("[data-row]");
  if (!button) return;
  const index = Number(button.dataset.row);
  const change = Number(button.dataset.change);
  if (change === 0 || bag[index].quantity + change < 1) bag.splice(index,1);
  else bag[index].quantity = Math.min(99,bag[index].quantity + change);
  saveBag();
  renderBag();
  ($(`[data-row="${index}"][data-change="${change}"]`,$("#bag-content")) || $("[data-close]",$("#bag-content"))).focus();
};
$("#open-bag").onclick = () => { renderBag(); openDialog("#bag-dialog"); };
document.addEventListener("click",(event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.hasAttribute("data-close")) button.closest("dialog").close();
  else if (button.hasAttribute("data-product")) openProduct(Number(button.dataset.product),Number(button.dataset.colour || 0));
  else if (button.hasAttribute("data-view")) showLook(Number(button.dataset.view));
  else if (button.hasAttribute("data-bundle")) openBundle(Number(button.dataset.bundle));
});
$$("dialog").forEach((dialog) => dialog.addEventListener("click",(event) => {
  if (event.target === dialog) dialog.close();
}));
if (page === "runway") customElements.define("runway-section",RunwaySection);
if (catalogEnabled) {
  setCategory(defaultCategory);
  catalogQuery.value = query;
  if (page === "new") sortFilter.value = "latest";
  if (page === "offers") priceFilter.value = "1999";
  renderCatalog();
}
showBagCount();
