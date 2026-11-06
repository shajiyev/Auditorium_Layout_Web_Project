// This main.js starts the app and connects the venue map, the details panel and the cart.
// Temporary, later i will replace this with the seat details panel.
function handleSeatClick(seatId) {
  console.log("Seat clicked:", seatId);
}

function init() {
  renderLegend(document.getElementById("legend"));
  renderVenue(document.getElementById("seating"), handleSeatClick);
}

init();
