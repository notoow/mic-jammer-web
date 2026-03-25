const consolePanel = document.querySelector(".console");
const toggleButton = document.getElementById("toggle-button");
const statusLabel = document.getElementById("status-label");
const modeValue = document.getElementById("mode-value");
const buttonWord = document.getElementById("button-word");
const toneCheckButton = document.getElementById("tone-check");
const soundToggleButton = document.getElementById("sound-toggle");
const pageTitle = document.getElementById("page-title");
const consoleAriaPanel = document.getElementById("console-panel");
const systemExplainer = document.getElementById("system-explainer");
const pathGuide = document.getElementById("path-guide");
const supportGrid = document.getElementById("support-grid");
const hardwareGallery = document.getElementById("hardware-gallery");
const langSwitch = document.getElementById("lang-switch");
const langButtons = Array.from(document.querySelectorAll(".lang-button"));

let audioContext;
let soundEnabled = true;
let currentLanguage = "en";
let isArmed = false;

const translations = {
  en: {
    htmlLang: "en",
    pageTitle: "mic-jammer-web privacy console demo",
    languageGroup: "Language selection",
    consoleAria: "Privacy control panel",
    plateKicker: "tactical console",
    toggleAria: "Toggle privacy console",
    statusSafe: "SAFE",
    statusArmed: "ARMED",
    modeTag: "mode",
    modeStandby: "standby",
    modeEngaged: "engaged",
    buttonOff: "ARM",
    buttonOn: "LIVE",
    architectureAria: "Web and hardware architecture",
    architectureKicker: "system architecture",
    architectureTitle: "Web version vs hardware version",
    architectureCopy: "This project is split into a browser UI and a separate hardware firmware layer. The web app itself is not what gets flashed onto a controller.",
    architectureCards: [
      {
        label: "web version",
        title: "Runs in the browser",
        copy: "The GitHub Pages site is the control surface. You open it in a browser on a phone, tablet, or laptop. Nothing here is flashed directly onto ESP32 hardware.",
      },
      {
        label: "hardware version",
        title: "Needs separate firmware",
        copy: "If you want a real button, LED, or buzzer box, that device needs its own microcontroller firmware. That firmware is what gets flashed with Arduino IDE or PlatformIO.",
      },
      {
        label: "flashing and link",
        title: "Connect the two layers",
        copy: "The normal path is: browser UI -> Web Serial or Web Bluetooth -> MCU firmware -> button, LED, buzzer. So the web app controls hardware, while the firmware runs hardware.",
      },
    ],
    pathAria: "Usage paths",
    pathKicker: "usage paths",
    pathMainTitle: "Choose the setup that fits you",
    pathMainCopy: "Some people only want the GitHub Pages console. Others want a safe offline control box built from common parts. Those are different workflows, so this page explains both.",
    pathCards: [
      {
        label: "web-only user",
        title: "Use the browser and stop there",
        items: [
          "Open the GitHub Pages site on any phone, tablet, or laptop.",
          "Use the big center button, language switch, and harmless tone check as a pure UI demo.",
          "You do not need to buy hardware, solder anything, or flash firmware for this path.",
          "This is the right option if you only want the visual concept, presentation page, or interaction prototype.",
        ],
      },
      {
        label: "offline builder",
        title: "Build a safe physical control box",
        items: [
          "Buy generic parts from AliExpress or local electronics shops such as an ESP32 dev board, a large momentary button, indicator LEDs, a small buzzer, a 5V power board, and an enclosure.",
          "Before ordering, match voltage, button diameter, switch type, enclosure depth, and power connector style.",
          "Flash separate MCU firmware with Arduino IDE or PlatformIO, because the web page itself is not what gets flashed.",
          "Use the hardware as a safe standalone status box, or connect it back to the browser later with Web Serial or Web Bluetooth.",
        ],
      },
    ],
    pathNoteLabel: "sourcing note",
    pathNoteCopy: "Useful AliExpress search terms for this safe control-box path are: ESP32 development board, 30mm momentary push button, panel indicator LED, piezo buzzer 5V, USB-C 5V module, aluminum project enclosure. This repo does not ship disruptive hardware features or firmware.",
    supportAria: "Support controls and hardware notes",
    audioKicker: "status audio",
    audioTitle: "Harmless tone check",
    audioCopy: "Only short confirmation tones are played on toggle. This is a harmless demo tone for UI and external control box testing, not an interference signal.",
    toneCheck: "Tone Check",
    soundOn: "Sound On",
    soundOff: "Sound Off",
    hardwareKicker: "hardware checklist",
    hardwareTitle: "External control box",
    hardwareCopy: "This checklist is for a non-interfering external control console or status box. It focuses only on control, indicators, and confirmation-tone demos.",
    hardwareItems: [
      "1 microcontroller: for USB serial or BLE connectivity",
      "1 large momentary button: physical toggle input matching the web UI",
      "1 LED set: for safe, armed, and power indicators",
      "1 small buzzer or speaker: for confirmation tones",
      "1 power module: to handle USB-C or 5V input cleanly",
      "1 enclosure: metal or rugged ABS front panel housing",
      "Wiring plus breadboard or protoboard: for quick assembly",
    ],
    wiringLabel: "safe hookup",
    galleryAria: "Photo hardware guide",
    galleryKicker: "photo hardware guide",
    galleryTitle: "Safe external control box reference",
    galleryCopy: "These photo references are useful when building an external control box around buttons, status indicators, confirmation audio, power, and an enclosure. Everything here is scoped to a non-interfering demo console.",
    officialSource: "Official source",
    photos: [
      {
        role: "controller",
        title: "ESP32-class board",
        copy: "The central board for controlling button, LED, and buzzer states over BLE or serial from the browser.",
        alt: "ESP32 development board",
      },
      {
        role: "input",
        title: "30mm illuminated button",
        copy: "The most intuitive large-format physical control for matching the central toggle in the web UI.",
        alt: "Blue illuminated arcade button",
      },
      {
        role: "status",
        title: "Indicator LEDs",
        copy: "The easiest output layer for showing safe, armed, and power states right on the front panel.",
        alt: "LED indicators wired on a breadboard",
      },
      {
        role: "audio",
        title: "Piezo buzzer",
        copy: "A simple sound device for replaying the page confirmation tones clearly on the external box.",
        alt: "Piezo buzzer",
      },
      {
        role: "power",
        title: "USB-C power breakout",
        copy: "A practical power-side reference for feeding the MCU and panel indicators from an external source.",
        alt: "USB-C power delivery breakout board",
      },
      {
        role: "housing",
        title: "Diecast aluminum enclosure",
        copy: "A realistic starting point when you want a rugged exterior and stable front-panel mounting.",
        alt: "Black diecast aluminum enclosure",
      },
    ],
  },
  ko: {
    htmlLang: "ko",
    pageTitle: "mic-jammer-web 프라이버시 콘솔 데모",
    languageGroup: "언어 선택",
    consoleAria: "프라이버시 제어 콘솔",
    plateKicker: "택티컬 콘솔",
    toggleAria: "프라이버시 콘솔 토글",
    statusSafe: "안전",
    statusArmed: "활성",
    modeTag: "모드",
    modeStandby: "대기",
    modeEngaged: "작동",
    buttonOff: "준비",
    buttonOn: "작동",
    architectureAria: "웹과 하드웨어 아키텍처",
    architectureKicker: "시스템 구조",
    architectureTitle: "웹 버전과 하드웨어 버전",
    architectureCopy: "이 프로젝트는 브라우저 UI와 별도 하드웨어 펌웨어 레이어로 나뉩니다. 웹앱 자체를 컨트롤러에 굽는 것이 아닙니다.",
    architectureCards: [
      {
        label: "웹 버전",
        title: "브라우저에서 실행",
        copy: "GitHub Pages 사이트가 제어 화면입니다. 휴대폰, 태블릿, 노트북 브라우저에서 열어 쓰며, 이 코드 자체를 ESP32에 바로 굽는 것은 아닙니다.",
      },
      {
        label: "하드웨어 버전",
        title: "별도 펌웨어가 필요",
        copy: "실제 버튼, LED, 버저 박스를 만들려면 그 장치에는 별도의 마이크로컨트롤러 펌웨어가 필요합니다. 그 펌웨어를 Arduino IDE나 PlatformIO로 플래시합니다.",
      },
      {
        label: "플래싱과 연결",
        title: "두 레이어를 연결",
        copy: "일반적인 흐름은 브라우저 UI -> Web Serial 또는 Web Bluetooth -> MCU 펌웨어 -> 버튼, LED, 버저입니다. 즉 웹앱은 제어를 맡고, 펌웨어는 하드웨어 실행을 맡습니다.",
      },
    ],
    supportAria: "보조 제어 및 하드웨어 안내",
    audioKicker: "상태 사운드",
    audioTitle: "무해한 톤 체크",
    audioCopy: "토글 시에는 짧은 상태 확인음만 재생됩니다. 재밍 신호가 아니라 UI와 외부 제어 박스 테스트를 위한 무해한 데모 톤입니다.",
    toneCheck: "톤 체크",
    soundOn: "사운드 켜짐",
    soundOff: "사운드 꺼짐",
    hardwareKicker: "하드웨어 체크리스트",
    hardwareTitle: "외부 제어 박스",
    hardwareCopy: "이 구성은 비간섭형 외부 제어 콘솔이나 상태 표시 박스를 위한 준비 항목입니다. 제어, 표시, 확인음 데모에만 초점을 둡니다.",
    hardwareItems: [
      "마이크로컨트롤러 1개: USB 시리얼 또는 BLE 연결용",
      "대형 순간식 버튼 1개: 웹 UI와 맞춘 물리 토글 입력용",
      "상태 LED 1세트: 안전, 활성, 전원 표시용",
      "소형 버저 또는 스피커 1개: 확인음 출력용",
      "전원 모듈 1개: USB-C 또는 5V 입력 정리용",
      "하우징 1개: 금속 또는 견고한 ABS 전면 패널용",
      "배선 및 브레드보드 또는 프로토보드: 빠른 조립용",
    ],
    wiringLabel: "안전 연결",
    galleryAria: "사진 하드웨어 가이드",
    galleryKicker: "사진 하드웨어 가이드",
    galleryTitle: "안전한 외부 제어 박스 레퍼런스",
    galleryCopy: "아래 사진은 버튼, 상태 표시, 확인음, 전원, 하우징 중심의 외부 제어 박스를 만들 때 참고할 수 있는 예시 부품입니다. 모두 비간섭형 데모 콘솔 기준입니다.",
    officialSource: "공식 링크",
    photos: [
      {
        role: "컨트롤러",
        title: "ESP32 계열 보드",
        copy: "브라우저에서 BLE 또는 시리얼로 버튼, LED, 버저 상태를 제어하는 중심 보드입니다.",
        alt: "ESP32 개발 보드",
      },
      {
        role: "입력",
        title: "30mm 조명 버튼",
        copy: "현재 웹 UI의 중앙 토글을 실제 물리 입력으로 옮길 때 가장 직관적인 대형 버튼입니다.",
        alt: "파란 조명 아케이드 버튼",
      },
      {
        role: "상태",
        title: "상태 표시 LED",
        copy: "안전, 활성, 전원 상태를 전면 패널에 바로 보여주는 가장 쉬운 출력 요소입니다.",
        alt: "브레드보드에 연결된 상태 표시 LED",
      },
      {
        role: "오디오",
        title: "피에조 버저",
        copy: "페이지의 확인음을 외부 박스에서도 짧고 명확하게 재생해 주는 간단한 사운드 장치입니다.",
        alt: "피에조 버저",
      },
      {
        role: "전원",
        title: "USB-C 전원 브레이크아웃",
        copy: "외부 전원에서 MCU와 표시 장치를 안정적으로 구동할 때 참고하기 좋은 전원 구성입니다.",
        alt: "USB-C 전원 브레이크아웃 보드",
      },
      {
        role: "하우징",
        title: "다이캐스트 알루미늄 하우징",
        copy: "견고한 외형과 안정적인 전면 패널 고정을 원할 때 현실적인 출발점이 되는 하우징입니다.",
        alt: "검은색 다이캐스트 알루미늄 하우징",
      },
    ],
  },
};

translations.ko.pathAria = "사용 경로";
translations.ko.pathKicker = "사용 경로";
translations.ko.pathMainTitle = "나에게 맞는 구성을 고르세요";
translations.ko.pathMainCopy = "어떤 사람은 GitHub Pages 콘솔만 필요하고, 어떤 사람은 일반 부품으로 안전한 오프라인 컨트롤 박스를 만들고 싶어 합니다. 작업 방식이 다르기 때문에 이 페이지에서 두 흐름을 모두 설명합니다.";
translations.ko.pathCards = [
  {
    label: "웹 전용 사용자",
    title: "브라우저만 사용하고 여기서 끝내기",
    items: [
      "폰, 태블릿, 노트북 어디서든 GitHub Pages 사이트를 열어 사용합니다.",
      "가운데 큰 버튼, 언어 전환, 무해한 톤 체크를 순수 UI 데모로 활용합니다.",
      "이 경로에서는 하드웨어 구매, 납땜, 펌웨어 플래시가 전혀 필요하지 않습니다.",
      "비주얼 콘셉트, 발표용 페이지, 인터랙션 프로토타입만 원하는 경우에 가장 적합합니다.",
    ],
  },
  {
    label: "오프라인 빌더",
    title: "안전한 물리 컨트롤 박스 만들기",
    items: [
      "알리익스프레스나 로컬 전자부품 상가에서 ESP32 개발 보드, 대형 모멘터리 버튼, 상태 LED, 소형 버저, 5V 전원 보드, 인클로저 같은 범용 부품을 구합니다.",
      "주문 전에는 전압, 버튼 지름, 스위치 방식, 인클로저 깊이, 전원 커넥터 규격이 맞는지 확인합니다.",
      "웹페이지 자체를 굽는 것이 아니므로 Arduino IDE나 PlatformIO로 별도 MCU 펌웨어를 플래시해야 합니다.",
      "하드웨어는 안전한 독립형 상태 박스로 쓸 수 있고, 나중에 Web Serial 또는 Web Bluetooth로 브라우저와 다시 연결할 수도 있습니다.",
    ],
  },
];
translations.ko.pathNoteLabel = "구매 메모";
translations.ko.pathNoteCopy = "이 안전한 컨트롤 박스 경로에서 알리익스프레스 검색어 예시는 ESP32 development board, 30mm momentary push button, panel indicator LED, piezo buzzer 5V, USB-C 5V module, aluminum project enclosure 입니다. 이 저장소에는 교란형 하드웨어 기능이나 펌웨어가 포함되지 않습니다.";

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function applyLanguage(language) {
  const copy = translations[language] || translations.en;
  currentLanguage = language;
  document.documentElement.lang = copy.htmlLang;

  pageTitle.textContent = copy.pageTitle;
  langSwitch.setAttribute("aria-label", copy.languageGroup);
  consoleAriaPanel.setAttribute("aria-label", copy.consoleAria);
  systemExplainer.setAttribute("aria-label", copy.architectureAria);
  pathGuide.setAttribute("aria-label", copy.pathAria);
  supportGrid.setAttribute("aria-label", copy.supportAria);
  hardwareGallery.setAttribute("aria-label", copy.galleryAria);
  toggleButton.setAttribute("aria-label", copy.toggleAria);

  setText("plate-kicker", copy.plateKicker);
  setText("mode-tag", copy.modeTag);
  setText("architecture-kicker", copy.architectureKicker);
  setText("architecture-title", copy.architectureTitle);
  setText("architecture-copy", copy.architectureCopy);
  setText("path-kicker", copy.pathKicker);
  setText("path-main-title", copy.pathMainTitle);
  setText("path-main-copy", copy.pathMainCopy);
  setText("path-note-label", copy.pathNoteLabel);
  setText("path-note-copy", copy.pathNoteCopy);
  setText("audio-kicker", copy.audioKicker);
  setText("audio-title", copy.audioTitle);
  setText("audio-copy", copy.audioCopy);
  setText("tone-check", copy.toneCheck);
  setText("hardware-kicker", copy.hardwareKicker);
  setText("hardware-title", copy.hardwareTitle);
  setText("hardware-copy", copy.hardwareCopy);
  setText("wiring-label", copy.wiringLabel);
  setText("gallery-kicker", copy.galleryKicker);
  setText("gallery-title", copy.galleryTitle);
  setText("gallery-copy", copy.galleryCopy);

  copy.architectureCards.forEach((card, index) => {
    setText(`arch-label-${index + 1}`, card.label);
    setText(`arch-title-${index + 1}`, card.title);
    setText(`arch-copy-${index + 1}`, card.copy);
  });

  copy.pathCards.forEach((card, cardIndex) => {
    const index = cardIndex + 1;
    setText(`path-label-${index}`, card.label);
    setText(`path-title-${index}`, card.title);
    card.items.forEach((item, itemIndex) => {
      setText(`path-item-${index}-${itemIndex + 1}`, item);
    });
  });

  copy.hardwareItems.forEach((item, index) => {
    setText(`hardware-item-${index + 1}`, item);
  });

  copy.photos.forEach((photo, index) => {
    setText(`photo-role-${index + 1}`, photo.role);
    setText(`photo-title-${index + 1}`, photo.title);
    setText(`photo-copy-${index + 1}`, photo.copy);
    setText(`photo-link-${index + 1}`, copy.officialSource);
    const image = document.getElementById(`photo-alt-${index + 1}`);
    if (image) {
      image.alt = photo.alt;
    }
  });

  langButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === language);
    button.setAttribute("aria-pressed", String(button.dataset.lang === language));
  });

  updateSoundButton();
  applyState(isArmed);
}

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
  const copy = translations[currentLanguage] || translations.en;
  soundToggleButton.textContent = soundEnabled ? copy.soundOn : copy.soundOff;
  soundToggleButton.classList.toggle("is-active", soundEnabled);
  soundToggleButton.setAttribute("aria-pressed", String(soundEnabled));
}

function applyState(isOn) {
  const copy = translations[currentLanguage] || translations.en;
  isArmed = isOn;
  consolePanel.dataset.state = isOn ? "on" : "off";
  toggleButton.setAttribute("aria-pressed", String(isOn));
  statusLabel.textContent = isOn ? copy.statusArmed : copy.statusSafe;
  modeValue.textContent = isOn ? copy.modeEngaged : copy.modeStandby;
  buttonWord.textContent = isOn ? copy.buttonOn : copy.buttonOff;
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

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.lang);
  });
});

applyLanguage("en");
applyState(false);
