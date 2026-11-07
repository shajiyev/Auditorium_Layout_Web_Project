// This main.js starts the app and connects the venue map, the details panel and the cart.

let inspectedSeatId = null;

const detailsElements = {
  empty: document.getElementById("details-empty"),
  list: document.getElementById("details-list"),
  row: document.getElementById("detail-row"),
  seat: document.getElementById("detail-seat"),
  category: document.getElementById("detail-category"),
  area: document.getElementById("detail-area"),
  price: document.getElementById("detail-price"),
  status: document.getElementById("detail-status"),
};

const addToCartButton = document.getElementById("add-to-cart");

// A seat click only inspects the seat and never changes the cart.
function handleSeatClick(seatId) {
  const previousSeatId = inspectedSeatId;
  inspectedSeatId = seatId;

  if (previousSeatId) {
    refreshSeat(previousSeatId);
  }
  refreshSeat(seatId);
  renderDetails();
}

function handleAddToCart() {
  if (inspectedSeatId && addToCart(inspectedSeatId)) {
    updateAfterCartChange(inspectedSeatId);
  }
}

// This keeps the map, the cart and the details panel in sync.
function updateAfterCartChange(seatId) {
  refreshSeat(seatId);
  renderDetails();
}

function refreshSeat(seatId) {
  setSeatState(seatId, {
    inspected: seatId === inspectedSeatId,
    inCart: isInCart(seatId),
  });
}

function renderDetails() {
  const seat = inspectedSeatId ? getSeat(inspectedSeatId) : null;

  detailsElements.empty.hidden = Boolean(seat);
  detailsElements.list.hidden = !seat;

  if (!seat) {
    addToCartButton.disabled = true;
    addToCartButton.textContent = "ADD TO CART";
    return;
  }

  const category = CATEGORIES[seat.category];
  const inCart = isInCart(seat.id);

  detailsElements.row.textContent = seat.row;
  detailsElements.seat.textContent = seat.number;
  detailsElements.category.textContent = category.name;
  detailsElements.area.textContent = category.area;
  detailsElements.price.textContent = formatPrice(category.price);
  detailsElements.status.textContent = getSeatStatus(seat, inCart);

  addToCartButton.disabled = inCart || seat.unavailable;
  addToCartButton.textContent = inCart ? "ALREADY IN CART" : "ADD TO CART";
}

function init() {
  renderLegend(document.getElementById("legend"));
  renderVenue(document.getElementById("seating"), handleSeatClick);
  renderDetails();

  initNavigation(
    document.getElementById("map"),
    document.getElementById("venue"),
    document.querySelector(".map-controls")
  );

  addToCartButton.addEventListener("click", handleAddToCart);
}

init();
