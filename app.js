const consolePanel = document.querySelector(".console");
const toggleButton = document.getElementById("toggle-button");
const statusLabel = document.getElementById("status-label");
const modeValue = document.getElementById("mode-value");
const buttonWord = document.getElementById("button-word");

function applyState(isOn) {
  consolePanel.dataset.state = isOn ? "on" : "off";
  toggleButton.setAttribute("aria-pressed", String(isOn));
  statusLabel.textContent = isOn ? "ARMED" : "SAFE";
  modeValue.textContent = isOn ? "engaged" : "standby";
  buttonWord.textContent = isOn ? "LIVE" : "JAM";
}

toggleButton.addEventListener("click", () => {
  const isOn = consolePanel.dataset.state !== "on";
  applyState(isOn);
});

applyState(false);
