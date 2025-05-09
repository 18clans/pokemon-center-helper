const positionElement = document.createElement('div');

function updatePosition(pos, ttw) {
    const waitTimeText = ttw !== undefined ? ` | Estimated wait time: ${ttw} min` : '';
    positionElement.textContent = `Position in line: ${pos}${waitTimeText}`;
}

function callAPI() {
    fetch("https://www.pokemoncenter.com/_Incapsula_Resource?SWWRGTS=868")
        .then(response => response.json())
        .then(data => {
            if (data && data.pos) {
                updatePosition(data.pos, data.ttw);
            } else {
                updatePosition('Unknown', 'N/A');
            }
        })
        .catch(error => {
            console.error("Error calling API:", error);
            updatePosition('Error', 'N/A');
            clearInterval(interval);
        });
}

function hasIframeInBody() {
    return document.body && document.body.getElementsByTagName('iframe').length > 0;
}

function addDiv() {
    positionElement.id = 'pokemon-center-queue-helper';
    positionElement.style.position = 'fixed';
    positionElement.style.top = '50%';
    positionElement.style.left = '50%';
    positionElement.style.transform = 'translate(-50%, -50%)';
    positionElement.style.backgroundColor = 'white';
    positionElement.style.color = '#000';
    positionElement.style.padding = '10px 20px';
    positionElement.style.fontSize = '22px';
    positionElement.style.fontWeight = 'bold';
    positionElement.style.zIndex = '9999';
    positionElement.style.borderRadius = '10px';
    positionElement.style.border = '2px solid #000';
    positionElement.style.boxShadow = '5px 5px 10px #000';
    document.body.appendChild(positionElement);
}

let interval;
if (hasIframeInBody()) {
    addDiv();
    callAPI(); // Initial call
    interval = setInterval(callAPI, 60000); // Repeat every minute
}