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

function getCartSeatIds() {
  return [...cartSeatIds];
}
