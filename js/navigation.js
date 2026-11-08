// Map navigation The whole view is three numbers, applied as one CSS transform on the venue.

const ZOOM_FACTOR = 1.25; 
const MIN_SCALE = 0.2;
const MAX_SCALE = 3;
const MOVE_STEP = 80; // pixels per click

const view = { scale: 1, x: 0, y: 0 };

let mapElement;
let venueElement;

function initNavigation(map, venue, controlsElement) {
  mapElement = map;
  venueElement = venue;

  controlsElement.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (button) {
      handleControl(button.dataset.action);
    }
  });

  window.addEventListener("resize", resetView);
  initMouseNavigation();
  resetView();
}

function handleControl(action) {
  switch (action) {
    case "zoom-in":    zoomBy(ZOOM_FACTOR); break;
    case "zoom-out":   zoomBy(1 / ZOOM_FACTOR); break;
    // "Move up" shows the part of the venue above, so the venue itself moves down.
    case "move-up":    moveBy(0, MOVE_STEP); break;
    case "move-down":  moveBy(0, -MOVE_STEP); break;
    case "move-left":  moveBy(MOVE_STEP, 0); break;
    case "move-right": moveBy(-MOVE_STEP, 0); break;
    case "reset":      resetView(); break;
  }
}

function zoomBy(factor) {
  view.scale = clamp(view.scale * factor, MIN_SCALE, MAX_SCALE);
  keepVenueVisible();
  applyView();
}

function moveBy(dx, dy) {
  view.x += dx;
  view.y += dy;
  keepVenueVisible();
  applyView();
}

// Fits the whole venue inside the map and centres it.
function resetView() {
  const fitScale = Math.min(
    mapElement.clientWidth / venueElement.offsetWidth,
    mapElement.clientHeight / venueElement.offsetHeight
  );
  view.scale = clamp(fitScale * 0.95, MIN_SCALE, 1);
  view.x = 0;
  view.y = 0;
  applyView();
}

// The venue's centre may move at most half of its (scaled) size away from the map centre, so part of the venue always stays on screen.
function keepVenueVisible() {
  const maxX = (venueElement.offsetWidth * view.scale) / 2;
  const maxY = (venueElement.offsetHeight * view.scale) / 2;
  view.x = clamp(view.x, -maxX, maxX);
  view.y = clamp(view.y, -maxY, maxY);
}

function applyView() {
  venueElement.style.transform =
    `translate(-50%, -50%) translate(${view.x}px, ${view.y}px) scale(${view.scale})`;

  document.querySelector('[data-action="zoom-in"]').disabled = view.scale >= MAX_SCALE;
  document.querySelector('[data-action="zoom-out"]').disabled = view.scale <= MIN_SCALE;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Bonus: mouse-wheel zoom and click-drag panning

const DRAG_THRESHOLD = 5; // pixels the mouse must move before it counts as a drag

let dragStart = null;
let wasDragged = false;

function initMouseNavigation() {
  mapElement.addEventListener("wheel", handleWheel, { passive: false });
  mapElement.addEventListener("pointerdown", handlePointerDown);
  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);

  // A drag must not count as a seat click. This runs before the seat's click handler.
  mapElement.addEventListener("click", (event) => {
    if (wasDragged) {
      event.stopPropagation();
      wasDragged = false;
    }
  }, true);
}

function handleWheel(event) {
  event.preventDefault(); // zoom the map instead of scrolling the page
  zoomBy(event.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR);
}

function handlePointerDown(event) {
  if (event.pointerType !== "mouse" || event.button !== 0) {
    return;
  }
  dragStart = { mouseX: event.clientX, mouseY: event.clientY, viewX: view.x, viewY: view.y };
  wasDragged = false;
}

function handlePointerMove(event) {
  if (!dragStart) {
    return;
  }
  const dx = event.clientX - dragStart.mouseX;
  const dy = event.clientY - dragStart.mouseY;

  if (!wasDragged && Math.hypot(dx, dy) < DRAG_THRESHOLD) {
    return; // tiny movement
  }

  wasDragged = true;
  mapElement.classList.add("is-dragging");
  view.x = dragStart.viewX + dx;
  view.y = dragStart.viewY + dy;
  keepVenueVisible();
  applyView();
}

function handlePointerUp() {
  dragStart = null;
  mapElement.classList.remove("is-dragging");
}
