#include <Arduino.h>

constexpr uint8_t SAFE_LED_PIN = 4;
constexpr uint8_t ARMED_LED_PIN = 5;
constexpr uint8_t BUZZER_PIN = 18;
constexpr uint8_t BUTTON_PIN = 19;

constexpr unsigned long DEBOUNCE_MS = 30;

bool isArmed = false;
bool buttonPressed = false;
bool lastReading = false;
unsigned long lastDebounceAt = 0;
String serialBuffer;

void applyOutputs() {
  digitalWrite(SAFE_LED_PIN, isArmed ? LOW : HIGH);
  digitalWrite(ARMED_LED_PIN, isArmed ? HIGH : LOW);
}

void buzzPulse(unsigned long onMs, unsigned long offMs) {
  digitalWrite(BUZZER_PIN, HIGH);
  delay(onMs);
  digitalWrite(BUZZER_PIN, LOW);

  if (offMs > 0) {
    delay(offMs);
  }
}

void playArmBeep() {
  buzzPulse(70, 40);
  buzzPulse(100, 0);
}

void playSafeBeep() {
  buzzPulse(120, 0);
}

void playCheckBeep() {
  buzzPulse(50, 30);
  buzzPulse(50, 30);
  buzzPulse(80, 0);
}

void emitState() {
  Serial.print("STATE ");
  Serial.print(isArmed ? "ARMED" : "SAFE");
  Serial.print(" BUTTON ");
  Serial.println(buttonPressed ? "PRESSED" : "RELEASED");
}

void setArmed(bool nextState, bool announce) {
  isArmed = nextState;
  applyOutputs();

  if (announce) {
    emitState();
  }
}

void handleCommand(String line) {
  line.trim();
  line.toUpperCase();

  if (line.length() == 0) {
    return;
  }

  if (line == "HELLO") {
    Serial.println("HELLO SAFE_CONSOLE_DEMO");
    emitState();
    return;
  }

  if (line == "PING") {
    Serial.println("PONG");
    return;
  }

  if (line == "STATUS") {
    emitState();
    return;
  }

  if (line == "ARM") {
    setArmed(true, true);
    return;
  }

  if (line == "SAFE") {
    setArmed(false, true);
    return;
  }

  if (line == "TOGGLE") {
    setArmed(!isArmed, true);
    return;
  }

  if (line == "BEEP ARM") {
    playArmBeep();
    Serial.println("EVENT BEEP ARM");
    return;
  }

  if (line == "BEEP SAFE") {
    playSafeBeep();
    Serial.println("EVENT BEEP SAFE");
    return;
  }

  if (line == "BEEP CHECK") {
    playCheckBeep();
    Serial.println("EVENT BEEP CHECK");
    return;
  }

  Serial.print("EVENT UNKNOWN ");
  Serial.println(line);
}

void readSerialCommands() {
  while (Serial.available() > 0) {
    const char incoming = static_cast<char>(Serial.read());

    if (incoming == '\n' || incoming == '\r') {
      if (serialBuffer.length() > 0) {
        handleCommand(serialBuffer);
        serialBuffer = "";
      }
      continue;
    }

    serialBuffer += incoming;
  }
}

void handleButton() {
  const bool reading = digitalRead(BUTTON_PIN) == LOW;

  if (reading != lastReading) {
    lastDebounceAt = millis();
    lastReading = reading;
  }

  if ((millis() - lastDebounceAt) < DEBOUNCE_MS) {
    return;
  }

  if (reading == buttonPressed) {
    return;
  }

  buttonPressed = reading;

  if (buttonPressed) {
    isArmed = !isArmed;
    applyOutputs();

    if (isArmed) {
      playArmBeep();
    } else {
      playSafeBeep();
    }
  }

  emitState();
}

void setup() {
  pinMode(SAFE_LED_PIN, OUTPUT);
  pinMode(ARMED_LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  digitalWrite(BUZZER_PIN, LOW);
  lastReading = digitalRead(BUTTON_PIN) == LOW;
  buttonPressed = lastReading;

  applyOutputs();

  Serial.begin(115200);
  delay(200);
  Serial.println("HELLO SAFE_CONSOLE_DEMO");
  emitState();
}

void loop() {
  readSerialCommands();
  handleButton();
}
