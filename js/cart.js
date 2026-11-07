// Prices and names are always looked up from the venue data.

let cartSeatIds = [];

function isInCart(seatId) {
  return cartSeatIds.includes(seatId);
}

// Returns true if the seat was added, false if it was not allowed
function addToCart(seatId) {
  const seat = getSeat(seatId);
  if (!seat || seat.unavailable || isInCart(seatId)) {
    return false;
  }
  cartSeatIds.push(seatId);
  return true;
}

function removeFromCart(seatId) {
  cartSeatIds = cartSeatIds.filter((id) => id !== seatId);
}

function getCartSeatIds() {
  return [...cartSeatIds];
}

function getCartTotal() {
  return cartSeatIds.reduce((total, id) => total + CATEGORIES[getSeat(id).category].price, 0);
}

// Draws the cart list, ticket count and total.
function renderCart(elements) {
  elements.list.innerHTML = "";

  cartSeatIds.forEach((seatId) => {
    elements.list.appendChild(createCartItem(getSeat(seatId)));
  });

  elements.count.textContent = cartSeatIds.length;
  elements.total.textContent = formatPrice(getCartTotal());
  elements.empty.hidden = cartSeatIds.length > 0;
}

function createCartItem(seat) {
  const category = CATEGORIES[seat.category];

  const item = document.createElement("li");
  item.className = "cart-item";

  const info = document.createElement("div");
  info.innerHTML = `<strong>Row ${seat.row} · Seat ${seat.number}</strong><br><span class="muted">${category.name}</span>`;

  const price = document.createElement("span");
  price.className = "cart-price";
  price.textContent = formatPrice(category.price);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "btn btn-small";
  removeButton.textContent = "Remove";
  removeButton.dataset.seatId = seat.id;
  removeButton.setAttribute("aria-label", `Remove Row ${seat.row} Seat ${seat.number}`);

  item.append(info, price, removeButton);
  return item;
}
