const menuButton = document.querySelector("[data-menu-button]");
const siteNav = document.querySelector("[data-site-nav]");
const header = document.querySelector("[data-header]");
const playerSearch = document.querySelector("[data-player-search]");
const playerCards = [...document.querySelectorAll(".player-card")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const squadViewButtons = [...document.querySelectorAll("[data-squad-view]")];
const squadPanels = [...document.querySelectorAll("[data-squad-panel]")];
const visibleCount = document.querySelector("[data-visible-count]");
const fixtureRefresh = document.querySelector("[data-fixture-refresh]");
const fixtureList = document.querySelector("[data-fixture-list]");
const productCards = [...document.querySelectorAll("[data-product-card]")];
const cartItems = document.querySelector("[data-cart-items]");
const cartMail = document.querySelector("[data-cart-mail]");
const clearCart = document.querySelector("[data-clear-cart]");

let activePosition = "all";
const cart = [];

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
  let count = 0;

  playerCards.forEach((card) => {
    const cardPosition = card.dataset.position || "";
    const cardName = normalizeText(card.dataset.name || card.textContent || "");
    const matchesPosition = activePosition === "all" || cardPosition === activePosition;
    const matchesSearch = !query || cardName.includes(query);

    const visible = matchesPosition && matchesSearch;
    card.hidden = !visible;
    if (visible) count += 1;
  });

  if (visibleCount) visibleCount.textContent = String(count);
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

if (squadViewButtons.length) {
  squadViewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.squadView;
      squadViewButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      squadPanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.squadPanel === view));
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

const renderCart = () => {
  if (!cartItems || !cartMail) return;

  if (!cart.length) {
    cartItems.innerHTML = "<p>اختر قميصاً ومقاساً لإعداد طلب مبدئي.</p>";
    cartMail.href = "mailto:info@example.com?subject=Al-Salt%20SC%20Jersey%20Order";
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item, index) => `
        <div class="cart-item">
          <strong>${index + 1}. ${item.product}</strong>
          <span>المقاس: ${item.size}</span>
        </div>
      `,
    )
    .join("");

  const orderLines = cart.map((item, index) => `${index + 1}. ${item.product} - Size ${item.size}`).join("%0A");
  cartMail.href = `mailto:info@example.com?subject=Al-Salt%20SC%20Jersey%20Order&body=Hello,%0AI would like to request:%0A${orderLines}%0A%0AName:%0APhone:%0ACity:`;
};

if (productCards.length) {
  productCards.forEach((card) => {
    const button = card.querySelector("[data-add-product]");
    const size = card.querySelector("[data-size]");

    button?.addEventListener("click", () => {
      cart.push({
        product: card.dataset.product || "Jersey",
        size: size?.value || "L",
      });
      renderCart();
    });
  });
}

clearCart?.addEventListener("click", () => {
  cart.length = 0;
  renderCart();
});

renderCart();
