# mic-jammer-web

`mic-jammer-web` is currently a minimal GitHub Pages landing page with a single centered button.

## Current page

- white background
- one oversized centered red emergency-style button
- static GitHub Pages-friendly structure

The live page is intentionally stripped down for a minimal visual presentation.

## Files

- `index.html` - landing page structure
- `styles.css` - minimal layout and button styling
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

- change the button label
- add button interaction or destination if needed
- add a custom domain or social preview image if needed
