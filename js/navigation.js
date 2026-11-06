// Map navigation The whole view is three numbers, applied as one CSS transform on the venue.

const ZOOM_FACTOR = 1.25; 
const MIN_SCALE = 0.2;
const MAX_SCALE = 3;

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
  resetView();
}

function handleControl(action) {
  switch (action) {
    case "zoom-in":    zoomBy(ZOOM_FACTOR); break;
    case "zoom-out":   zoomBy(1 / ZOOM_FACTOR); break;
    case "reset":      resetView(); break;
  }
}

function zoomBy(factor) {
  view.scale = clamp(view.scale * factor, MIN_SCALE, MAX_SCALE);
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

function applyView() {
  venueElement.style.transform =
    `translate(-50%, -50%) translate(${view.x}px, ${view.y}px) scale(${view.scale})`;

  document.querySelector('[data-action="zoom-in"]').disabled = view.scale >= MAX_SCALE;
  document.querySelector('[data-action="zoom-out"]').disabled = view.scale <= MIN_SCALE;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
