const positionElement = document.createElement("div");

function updatePosition(pos, ttw) {
  const waitTimeText =
    ttw !== undefined ? ` | Estimated wait time: ${ttw} min` : "";
  positionElement.textContent = `Position in line: ${pos}${waitTimeText}`;
}

function showQueueError() {
  positionElement.textContent =
    "There was an error loading the queue. It'll automatically try again.";
}

function callAPI() {
  fetch("https://www.pokemoncenter.com/_Incapsula_Resource?SWWRGTS=868")
    .then((response) => response.json())
    .then((data) => {
      if (data && data.pos) {
        updatePosition(data.pos, data.ttw);
      } else {
        showQueueError();
      }
    })
    .catch((error) => {
      console.log("Error calling API:", error);
      showQueueError();
    });
}

function hasIframeInBody() {
  return (
    document.body && document.body.querySelector("iframe#main-iframe") !== null
  );
}

function addDiv() {
  positionElement.id = "sv-pokemon-center-queue-helper";
  positionElement.textContent = "Loading queue...";
  document.body.appendChild(positionElement);
}

let interval;
if (hasIframeInBody()) {
  addDiv();
  turnTimerOff();
  callAPI(); // Initial call
  interval = setInterval(callAPI, 30000); // Repeat every 30 seconds
}
