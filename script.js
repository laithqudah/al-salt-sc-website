const menuButton = document.querySelector("[data-menu-button]");
const siteNav = document.querySelector("[data-site-nav]");
const header = document.querySelector("[data-header]");
const playerSearch = document.querySelector("[data-player-search]");
const playerCards = [...document.querySelectorAll(".player-card")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const fixtureRefresh = document.querySelector("[data-fixture-refresh]");
const fixtureList = document.querySelector("[data-fixture-list]");

let activePosition = "all";

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

if (header) {
  const setHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });
}

const normalizeText = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const updatePlayerCards = () => {
  const query = normalizeText(playerSearch?.value || "");

  playerCards.forEach((card) => {
    const cardPosition = card.dataset.position || "";
    const cardName = normalizeText(card.dataset.name || card.textContent || "");
    const matchesPosition = activePosition === "all" || cardPosition === activePosition;
    const matchesSearch = !query || cardName.includes(query);

    card.hidden = !(matchesPosition && matchesSearch);
  });
};

if (playerSearch && playerCards.length) {
  playerSearch.addEventListener("input", updatePlayerCards);
}

if (filterButtons.length) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activePosition = button.dataset.filter || "all";
      filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      updatePlayerCards();
    });
  });
}

if (fixtureRefresh && fixtureList) {
  fixtureRefresh.addEventListener("click", () => {
    fixtureList.classList.add("is-updated");
    fixtureRefresh.textContent = "تم التحديث";
    fixtureRefresh.disabled = true;
  });
}
