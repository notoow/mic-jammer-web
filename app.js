const consolePanel = document.querySelector(".console");
const toggleButton = document.getElementById("toggle-button");
const statusLabel = document.getElementById("status-label");
const modeValue = document.getElementById("mode-value");
const buttonWord = document.getElementById("button-word");
const toneCheckButton = document.getElementById("tone-check");
const soundToggleButton = document.getElementById("sound-toggle");

let audioContext;
let soundEnabled = true;

function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return null;
    }
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playToneSequence(steps) {
  if (!soundEnabled) {
    return;
  }

  const context = getAudioContext();
  if (!context) {
    return;
  }

  const now = context.currentTime + 0.01;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.connect(context.destination);

  let cursor = now;

  steps.forEach((step) => {
    const oscillator = context.createOscillator();
    oscillator.type = step.type;
    oscillator.frequency.setValueAtTime(step.frequency, cursor);
    oscillator.connect(gain);

    gain.gain.cancelScheduledValues(cursor);
    gain.gain.setValueAtTime(0.0001, cursor);
    gain.gain.linearRampToValueAtTime(step.volume, cursor + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, cursor + step.duration);

    oscillator.start(cursor);
    oscillator.stop(cursor + step.duration + 0.03);
    cursor += step.duration + step.gap;
  });
}

function playStatusTone(kind) {
  if (kind === "on") {
    playToneSequence([
      { frequency: 380, duration: 0.12, gap: 0.04, type: "triangle", volume: 0.04 },
      { frequency: 620, duration: 0.18, gap: 0.02, type: "triangle", volume: 0.05 },
    ]);
    return;
  }

  playToneSequence([
    { frequency: 300, duration: 0.11, gap: 0.04, type: "sine", volume: 0.035 },
    { frequency: 220, duration: 0.16, gap: 0.02, type: "sine", volume: 0.03 },
  ]);
}

function updateSoundButton() {
  soundToggleButton.textContent = soundEnabled ? "Sound On" : "Sound Off";
  soundToggleButton.classList.toggle("is-active", soundEnabled);
  soundToggleButton.setAttribute("aria-pressed", String(soundEnabled));
}

function applyState(isOn) {
  consolePanel.dataset.state = isOn ? "on" : "off";
  toggleButton.setAttribute("aria-pressed", String(isOn));
  statusLabel.textContent = isOn ? "ARMED" : "SAFE";
  modeValue.textContent = isOn ? "engaged" : "standby";
  buttonWord.textContent = isOn ? "LIVE" : "ARM";
}

toggleButton.addEventListener("click", () => {
  const isOn = consolePanel.dataset.state !== "on";
  applyState(isOn);
  playStatusTone(isOn ? "on" : "off");
});

toneCheckButton.addEventListener("click", () => {
  playToneSequence([
    { frequency: 440, duration: 0.09, gap: 0.03, type: "triangle", volume: 0.035 },
    { frequency: 550, duration: 0.09, gap: 0.03, type: "triangle", volume: 0.035 },
    { frequency: 660, duration: 0.12, gap: 0.02, type: "triangle", volume: 0.04 },
  ]);
});

soundToggleButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  updateSoundButton();

  if (soundEnabled) {
    playToneSequence([
      { frequency: 520, duration: 0.12, gap: 0.03, type: "triangle", volume: 0.03 },
    ]);
  }
});

applyState(false);
updateSoundButton();
