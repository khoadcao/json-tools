# JSON Tools

Lightweight client-side JSON formatting, minifying, validation, and diff tool.

**URL:** https://khoadcao.github.io/json-tools/

## Features

- **Format/Beautify** — Auto-detect JSON.stringify'd strings, pretty-print with 2-space indent
- **Minify** — Compress JSON to single line
- **Validate** — Check JSON validity with error position
- **Diff** — Compare two JSON objects with side-by-side or inline view
- **Dark/Light theme** — Follows system preference, toggle manually

## Tech

- Vanilla HTML/CSS/JS — no build step, no framework
- [jsdiff](https://github.com/kpdecker/jsdiff) v5.2.0 for diff computation
- Hosted on GitHub Pages

## Development

Open `index.html` in a browser. No build step required.

## Keyboard Shortcuts

- `Ctrl/Cmd + Enter` — Format (in Format tab) or Compare (in Diff tab)

## Privacy

- All processing happens locally in your browser
- No data sent to any server
- No analytics, no tracking, no cookies
- Works offline after first load
