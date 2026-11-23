"use strict";

$("#open-search").onclick = () => openDialog("#search-dialog");
$("#footer-bag").onclick = () => $("#open-bag").click();

if (page === "home") {
  $("#home-new").innerHTML = [33,34,40,43].map((id) => productCard(products[id])).join("");
}

if (page === "lookbook") {
  $(".lookbook-grid").innerHTML = looks.map((look) => `<article class="lookbook-card">
    <button class="lookbook-image" type="button" aria-label="View ${look.name}" data-view="${look.id}"><img src="${model(look.id)}" alt="${look.name} styled head to toe" loading="lazy"></button>
    <div class="lookbook-copy">
      <p class="eyebrow">${categories[look.group]}</p><h3>${look.name}</h3><p>${look.description}</p>
      <div class="card-footer"><strong>${money(look.price)}</strong><button class="text-button" type="button" data-bundle="${look.id}">Shop the look</button></div>
    </div>
  </article>`).join("");
}

if (page === "offers") {
  const budgetButtons = $$("[data-budget]");
  function renderOfferTabs() {
    budgetButtons.forEach((button) => {
      button.setAttribute("aria-pressed",String(button.dataset.budget === priceFilter.value));
    });
  }
  budgetButtons.forEach((button) => {
    button.onclick = () => {
      clearFilters();
      priceFilter.value = button.dataset.budget;
      renderCatalog();
      renderOfferTabs();
    };
  });
  priceFilter.addEventListener("change",renderOfferTabs);
  $("#reset-filters").addEventListener("click",renderOfferTabs);
  renderOfferTabs();
}
