let countdownInterval;
let timerEnabled = true;
let originalTitle = "";

let currentUrl = location.href;

const observer = new MutationObserver(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    handleUrlChange(currentUrl); // Call your function here
  }
});

// Create Toggle Button
const button = document.createElement("button");
button.id = "sv-refresh-toggle-button";
button.textContent = "REFRESH IS ON"; // Default ON

button.addEventListener("click", () => {
  toggleTimer();
});

document.body.appendChild(button);

observer.observe(document.body, { childList: true, subtree: true });

function handleUrlChange(url) {
  if (url?.includes("https://www.pokemoncenter.com/product")) {
    button.style.display = "block";
    if (timerEnabled) {
      scheduleRefresh();
    }
  } else {
    clearInterval(countdownInterval); // Stop countdown
    document.title = `${originalTitle}`;
    button.style.display = "none";
  }
}

function init() {
  originalTitle = document.title; // Save the original title
  scheduleRefresh(); // Start countdown timer
  handleUrlChange(window.location.href);
}

function toggleTimer() {
  timerEnabled = !timerEnabled;
  updateTimer();
}

function turnTimerOff() {
  timerEnabled = false;
  updateTimer();
}

function updateTimer() {
  button.textContent = timerEnabled ? "REFRESH IS ON" : "REFRESH IS OFF";
  button.classList.toggle("sv-button-toggle");

  if (!timerEnabled) {
    clearInterval(countdownInterval); // Stop countdown
    document.title = `⏸️ Paused - ${originalTitle}`;
  } else {
    scheduleRefresh(); // Resume countdown
  }
}

function scheduleRefresh() {
  const now = new Date();
  const nextRefresh = new Date(now);

  // Set next refresh to the next xx:59:59
  nextRefresh.setHours(now.getHours() + 1);
  nextRefresh.setMinutes(0);
  nextRefresh.setSeconds(-1);

  function updateCountdown() {
    if (!timerEnabled) return;

    const remainingTime = nextRefresh - new Date();

    if (remainingTime <= 0) {
      document.title = "Refreshing...";
      location.reload();
      return;
    }

    const minutes = Math.floor(remainingTime / 60000); // Convert ms to minutes
    const seconds = Math.floor((remainingTime % 60000) / 1000); // Remaining seconds

    document.title = `⏳ ${minutes}:${seconds
      .toString()
      .padStart(2, "0")} - ${originalTitle}`;
  }

  clearInterval(countdownInterval); // Clear previous timer
  countdownInterval = setInterval(updateCountdown, 1000); // Update every second
}

init();
