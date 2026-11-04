// Creates one section (front / middle / premium) per category
function renderVenue(seatingElement, onSeatClick) {
  Object.keys(CATEGORIES).forEach((categoryKey) => {
    const rows = ROWS.filter((row) => row.category === categoryKey);
    seatingElement.appendChild(createSection(categoryKey, rows));
  });

  seatingElement.addEventListener("click", (event) => {
    const seatButton = event.target.closest(".seat");
    if (seatButton) {
      onSeatClick(seatButton.dataset.seatId);
    }
  });
}

function createSection(categoryKey, rows) {
  const category = CATEGORIES[categoryKey];
  const section = document.createElement("div");
  section.className = `section section-${categoryKey}`;

  const title = document.createElement("h3");
  title.className = "section-title";
  title.textContent = `${category.area} — ${category.name} · ${formatPrice(category.price)}`;
  section.appendChild(title);

  // Grid columns: row label | one column per block | row label.
  const blockCount = rows[0].blocks.length;
  const grid = document.createElement("div");
  grid.className = "section-grid";
  grid.style.gridTemplateColumns = `2rem repeat(${blockCount}, max-content) 2rem`;

  rows.forEach((row) => {
    grid.appendChild(createRowLabel(row.letter));
    getSeatsInRow(row.letter, blockCount).forEach((blockSeats, blockIndex) => {
      grid.appendChild(createBlock(blockSeats, blockIndex, blockCount));
    });
    grid.appendChild(createRowLabel(row.letter));
  });

  section.appendChild(grid);
  return section;
}

// Returns the seats of one row, grouped by block
function getSeatsInRow(rowLetter, blockCount) {
  const blocks = [];
  for (let i = 0; i < blockCount; i++) {
    blocks.push(SEATS.filter((seat) => seat.row === rowLetter && seat.blockIndex === i));
  }
  return blocks;
}

function createRowLabel(letter) {
  const label = document.createElement("span");
  label.className = "row-label";
  label.textContent = letter;
  return label;
}

// Left block hugs the left aisle, right block hugs the right aisle, centre is centred.
function createBlock(seats, blockIndex, blockCount) {
  const block = document.createElement("div");
  block.className = "block";

  if (blockCount === 1) {
    block.classList.add("block-center");
  } else if (blockIndex === 0) {
    block.classList.add("block-left");
  } else if (blockIndex === blockCount - 1) {
    block.classList.add("block-right");
  } else {
    block.classList.add("block-center");
  }

  seats.forEach((seat) => block.appendChild(createSeatButton(seat)));
  return block;
}

function createSeatButton(seat) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "seat";
  button.dataset.seatId = seat.id;
  button.style.setProperty("--seat-color", CATEGORIES[seat.category].color);
  button.disabled = seat.unavailable;
  updateSeatLabel(button, seat, seat.unavailable ? "unavailable" : "available");
  return button;
}

// Text for screen readers (aria-label) and the hover tooltip (title) appears only when you hover over the seat and dont move the cursor
function updateSeatLabel(button, seat, status) {
  const category = CATEGORIES[seat.category];
  const text = `Row ${seat.row}, Seat ${seat.number}, ${category.name}, ${formatPrice(category.price)}, ${status}`;
  button.setAttribute("aria-label", text);
  button.title = text;
}
