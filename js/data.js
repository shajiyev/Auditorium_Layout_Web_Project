const CURRENCY = "₼";

// Price categories.
const CATEGORIES = {
  front:   { name: "Standard - Front", area: "Front rows", price: 30, color: "#b5c95a" },
  middle:  { name: "Standard - Middle", area: "Middle rows", price: 20, color: "#5a9e7a" },
  premium: { name: "Premium", area: "Balcony", price: 50, color: "#b07d3a" },
};

// The gaps between blocks are for aisles. Seats are numbered 1..N across the whole row. "blocks" is the number of seats in each block, left to right.
const ROWS = [
  { letter: "A", category: "front",   blocks: [6, 11, 7] },
  { letter: "B", category: "front",   blocks: [7, 12, 8] },
  { letter: "C", category: "front",   blocks: [8, 13, 9] },
  { letter: "D", category: "middle",  blocks: [6, 16, 11] },
  { letter: "E", category: "middle",  blocks: [6, 17, 12] },
  { letter: "F", category: "middle",  blocks: [6, 18, 13] },
  { letter: "G", category: "middle",  blocks: [6, 19, 14] },
  { letter: "H", category: "middle",  blocks: [6, 20, 15] },
  { letter: "I", category: "premium", blocks: [24] },
  { letter: "J", category: "premium", blocks: [26] },
];

// Demo seats that are already sold 
const UNAVAILABLE_SEATS = [
  "A-4", "A-15", "B-9", "B-22", "C-2", "C-18", "C-27",
  "D-10", "D-30", "E-3", "E-19", "F-12", "F-25", "F-36",
  "G-7", "G-28", "H-1", "H-21", "H-40",
  "I-6", "I-13", "J-4", "J-20",
];

// The function that builts a flat list of seat objects from ROWS.
function buildSeats() {
  const seats = [];

  ROWS.forEach((row) => {
    let seatNumber = 1;

    row.blocks.forEach((blockSize, blockIndex) => {
      for (let i = 0; i < blockSize; i++) {
        const id = `${row.letter}-${seatNumber}`;
        seats.push({
          id,
          row: row.letter,
          number: seatNumber,
          blockIndex,
          category: row.category,
          unavailable: UNAVAILABLE_SEATS.includes(id),
        });
        seatNumber++;
      }
    });
  });

  return seats;
}

const SEATS = buildSeats();

// Quick lookup from seat id to seat object.
const SEAT_LOOKUP = {};
SEATS.forEach((seat) => {
  SEAT_LOOKUP[seat.id] = seat;
});

function getSeat(seatId) {
  return SEAT_LOOKUP[seatId];
}

function formatPrice(amount) {
  return `${CURRENCY}${amount}`;
}
