# mic-jammer-web

`mic-jammer-web` is currently a GitHub Pages landing page built around a centered console-style toggle, harmless status tones, and a non-interfering hardware checklist.

## Current page

- white background
- one oversized centered military-console-inspired button
- click-to-toggle interaction with visual state changes
- English as the default language
- EN / KO language selector in the console
- clear explanation of web version vs hardware version
- separate guidance for web-only users and offline control-box builders
- harmless status-tone demo for UI and box-integration checks
- hardware checklist for a safe external control box prototype
- photo hardware guide with linked reference components
- static GitHub Pages-friendly structure

The live page is intentionally stripped down for a minimal visual presentation.

## Files

- `index.html` - landing page structure
- `styles.css` - console styling and toggle states
- `app.js` - button toggle behavior, harmless status tones, and Web Serial hardware sync
- `firmware/esp32-safe-console-demo.ino` - safe ESP32 demo firmware for button, LEDs, and active buzzer
- `favicon.svg` - simple icon

## Local preview

Because this is a plain static site, you can open `index.html` directly or use a lightweight local server.

Example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

For GitHub Pages deployment:

1. Push these files to the `main` branch.
2. In GitHub, open `Settings > Pages`.
3. Set the source to `Deploy from a branch`.
4. Choose `main` and `/ (root)`.

## Suggested next steps

- expand the Web Serial demo to Web Bluetooth if you want cable-free pairing later
- change the button label or status words
- add a custom domain or social preview image if needed

## Safe hardware demo

This repository now includes a working browser-to-ESP32 demo path for a safe physical control box.

### What it does

- the center web toggle can sync `SAFE` and `ARMED` to an ESP32 over Web Serial
- the ESP32 can drive two LEDs and one active buzzer
- a physical momentary button on the ESP32 box can toggle the state and report it back to the page
- the page can request a fresh hardware status and mirror the latest device state

### Hardware example

Recommended safe demo parts:

- 1 ESP32 development board
- 1 large momentary button
- 1 green or white LED for `SAFE`
- 1 red LED for `ARMED`
- 2 current-limiting resistors for the LEDs
- 1 active buzzer module
- jumper wires and a breadboard or perfboard
- 1 USB data cable

### Demo wiring

Default firmware pin map:

- `GPIO19` -> momentary button -> `GND`
- `GPIO4` -> `SAFE` LED -> resistor -> `GND`
- `GPIO5` -> `ARMED` LED -> resistor -> `GND`
- `GPIO18` -> active buzzer signal pin
- common `GND`

Notes:

- the button uses `INPUT_PULLUP`, so the pressed state is created by shorting `GPIO19` to `GND`
- an active buzzer is preferred because the demo firmware only needs simple on/off pulses

### Flashing the ESP32

1. Open `firmware/esp32-safe-console-demo.ino` in Arduino IDE.
2. Install ESP32 board support if it is not already installed.
3. Select your ESP32 board and COM port.
4. Upload the sketch at the default settings.
5. Open the serial monitor at `115200` baud if you want to inspect the text protocol.

### Using the web app with hardware

1. Open the GitHub Pages site in Chrome or Edge desktop.
2. Click `Connect Hardware`.
3. Choose the ESP32 serial port from the browser picker.
4. Press the center toggle to sync `SAFE` or `ARMED`.
5. Press the physical button on the box to send the state back to the browser.

### Serial protocol

Browser commands:

- `HELLO`
- `STATUS`
- `ARM`
- `SAFE`
- `TOGGLE`
- `BEEP ARM`
- `BEEP SAFE`
- `BEEP CHECK`

Device responses:

- `HELLO SAFE_CONSOLE_DEMO`
- `STATE SAFE BUTTON RELEASED`
- `STATE ARMED BUTTON PRESSED`
- `EVENT BEEP CHECK`

### Browser support

The hardware bridge requires:

- a secure origin such as GitHub Pages or `http://localhost`
- a Chromium-based desktop browser with Web Serial support
- a USB data cable, not a charge-only cable

## Web vs hardware

### Web version

The current repository is a browser app.

- it runs from GitHub Pages
- it provides the UI, language switch, state toggle, and harmless tone demo
- it does not get flashed onto an ESP32 or similar controller

### Hardware version

If you want a physical box with a real button, LED, or buzzer, that box needs separate firmware.

- that firmware would run on a microcontroller such as an ESP32
- that firmware is what you flash with Arduino IDE or PlatformIO
- that firmware would handle physical inputs and outputs

### Connection model

The intended safe architecture is:

`browser UI -> Web Serial or Web Bluetooth -> MCU firmware -> button, LED, buzzer`

## Who this is for

### Web-only users

Choose this route if you only want the browser experience.

- open the GitHub Pages site on a phone, tablet, or laptop
- use the centered toggle, visual state changes, language switch, and harmless tone check
- do not buy hardware unless you actually want a physical box later
- do not flash anything, because the web app is not firmware

### Offline builders

Choose this route if you want a safe physical control box for local use.

- buy common control-box parts from AliExpress or local electronics shops
- treat the current web UI as a reference interface or optional companion surface
- flash separate firmware onto an MCU such as an ESP32
- wire only safe control outputs like a button, LED, and buzzer

### AliExpress sourcing notes

Use generic search terms instead of relying on one exact listing.

- `ESP32 development board`
- `30mm momentary push button`
- `panel indicator LED`
- `piezo buzzer 5V`
- `USB-C 5V module`
- `aluminum project enclosure`

Before ordering, compare:

- supply voltage
- button size and mounting hole diameter
- momentary vs latching switch type
- enclosure depth and panel thickness
- power connector style
- whether you want USB serial, BLE, or both

### What gets flashed

Only the microcontroller firmware gets flashed.

- the GitHub Pages app stays a browser app
- the MCU firmware is what Arduino IDE or PlatformIO writes to hardware
- the safe connection model is still `browser UI -> Web Serial or Web Bluetooth -> MCU firmware -> button, LED, buzzer`

## Safety scope

This repo is limited to:

- interface and state-toggle behavior
- harmless confirmation tones
- safe control-box planning for button, LED, buzzer, and status display

It does not include microphone-jamming logic, interference signals, or hardware guidance for device disruption.
