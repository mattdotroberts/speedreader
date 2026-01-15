# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Speed Reader is a browser-based speed reading app using RSVP (Rapid Serial Visual Presentation) technology. It displays one word at a time with a red "anchor letter" at the Optimal Recognition Point (ORP) that stays fixed on screen while words shift around it.

## Development Commands

```bash
npm start          # Serve via Python http.server on port 8080
npm run serve      # Serve via npx serve
npm run dev        # Live reload server on port 8080
```

Or simply open `index.html` directly in a browser.

## URL Parameters

- `?url=https://example.com/article` - Auto-loads article from URL on page load

## Architecture

This is a vanilla JavaScript application with no build step or dependencies.

### Layout

Three-panel layout with draggable resize handles:
- **Left**: Reading history with progress indicators
- **Middle**: Article text in scrollable readable format
- **Right**: RSVP speed reader with controls

On mobile (< 768px): Horizontal scroll/swipe between full-width panels.

### Core Classes (in `scripts/`)

- **`SpeedReaderApp`** (`app.js`) - Main controller that orchestrates modules, handles modal/panel interactions, fullscreen mode, keyboard shortcuts (`Space/K` play/pause, `J/←` rewind, `L/→` forward, `F` fullscreen)
- **`RSVPEngine`** (`rsvp.js`) - Core reading engine handling word display timing, anchor letter positioning (ORP at `Math.floor(word.length / 3)`), play/pause/seek controls, position saving on pause
- **`ContentManager`** (`content.js`) - Fetches URLs via CORS proxies (`api.allorigins.win`, `corsproxy.io`) and extracts article text using simplified Readability algorithm
- **`StorageManager`** (`storage.js`) - Manages localStorage for reading history (last 50 items), user preferences (WPM), and reading position tracking for resume functionality
- **`PanelResizer`** (`panel-resize.js`) - Handles draggable panel resize handles, persists panel widths to localStorage

### Key Implementation Details

- Classes are exported to `window` object for cross-file access (e.g., `window.RSVPEngine = RSVPEngine`)
- Word positioning uses `requestAnimationFrame` to measure text widths and align anchor letter to center
- Panel widths stored separately in localStorage key `speedReaderPanelWidths`

### File Structure

```
index.html          # Three-panel layout with header, modal, panels
styles/
  main.css          # CSS Grid layout, panels, fullscreen, responsive
  components.css    # History items, loading/error states, progress bars
scripts/
  app.js            # Main controller
  rsvp.js           # RSVP engine
  content.js        # URL fetching & extraction
  storage.js        # LocalStorage with position tracking
  panel-resize.js   # Draggable panel resizing
```
