# mic-jammer-web

`mic-jammer-web` is currently a minimal GitHub Pages landing page built around a single centered console-style toggle.

## Current page

- white background
- one oversized centered military-console-inspired button
- click-to-toggle interaction with visual state changes
- static GitHub Pages-friendly structure

The live page is intentionally stripped down for a minimal visual presentation.

## Files

- `index.html` - landing page structure
- `styles.css` - console styling and toggle states
- `app.js` - button toggle behavior
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

- connect the toggle state to sound, animation, or another harmless demo action if needed
- change the button label or status words
- add a custom domain or social preview image if needed
