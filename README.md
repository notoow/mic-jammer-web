# mic-jammer-web

`mic-jammer-web` is currently a GitHub Pages landing page built around a centered console-style toggle, harmless status tones, and a non-interfering hardware checklist.

## Current page

- white background
- one oversized centered military-console-inspired button
- click-to-toggle interaction with visual state changes
- harmless status-tone demo for UI and box-integration checks
- hardware checklist for a safe external control box prototype
- static GitHub Pages-friendly structure

The live page is intentionally stripped down for a minimal visual presentation.

## Files

- `index.html` - landing page structure
- `styles.css` - console styling and toggle states
- `app.js` - button toggle behavior and harmless status tones
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

- connect the toggle state to Web Serial or Web Bluetooth for a safe LED or buzzer demo box
- change the button label or status words
- add a custom domain or social preview image if needed

## Safety scope

This repo is limited to:

- interface and state-toggle behavior
- harmless confirmation tones
- safe control-box planning for button, LED, buzzer, and status display

It does not include microphone-jamming logic, interference signals, or hardware guidance for device disruption.
