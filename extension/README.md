# Browser Extension

Chrome extension (Manifest V3) for the AI Fake News Detector project,
built for a Prince Sattam Bin Abdulaziz University final-year project.

## Features

- Analyze the current page with one click (extracts the article text and verifies it).
- Paste text to verify any headline or claim.
- Login / Logout using the same JWT auth as the web app.
- Risk level badge (LOW / MEDIUM / HIGH).
- Key-word highlights from the LIME explanation.

## Installation (Developer Mode)

1. Make sure the backend is running at `http://localhost:5000`:
   ```
   cd backend
   python app.py
   ```
2. Open Chrome and go to `chrome://extensions`
3. Turn on Developer mode (top right)
4. Click Load unpacked and select this `extension/` folder
5. Pin the extension and click the icon to open the popup

## File structure

```
extension/
├── manifest.json     Manifest V3 config
├── popup.html        Popup UI
├── popup.css         Popup styling
├── popup.js          Popup logic + API calls
├── background.js     Service worker
└── content.js        Page-text extraction helper
```
