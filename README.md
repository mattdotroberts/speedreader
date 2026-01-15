# Speed Reader

A clean, minimalist browser-based speed reading app using RSVP (Rapid Serial Visual Presentation) technology.

![Speed Reader Preview](preview.png)

## Features

- **RSVP Speed Reading**: Read at 300-900 words per minute
- **Red Anchor Highlighting**: Optimal Recognition Point (ORP) highlighting for better focus
- **Multiple Input Methods**: 
  - Load content from any URL
  - Paste raw text directly
  - Access reading history
- **Smart Content Extraction**: Automatically extracts article text from web pages
- **Local Storage**: Saves reading history and preferences
- **Keyboard Shortcuts**: Control playback without touching the mouse
- **Clean UI**: Minimalist light theme design

## Usage

### Getting Started

1. Open `index.html` in your web browser
2. Choose your input method:
   - **URL**: Enter a web article URL and click "Load Article"
   - **Text**: Paste your text and click "Start Reading"
   - **History**: Access previously read content

### Controls

**Mouse Controls:**
- Adjust WPM slider to set reading speed (300-900 WPM)
- Play/Pause button to control playback
- Rewind/Forward buttons to skip 10 words
- Back button to return to input screen

**Keyboard Shortcuts:**
- `Space` or `K` - Play/Pause
- `Left Arrow` or `J` - Rewind 10 words
- `Right Arrow` or `L` - Forward 10 words
- `Esc` - Back to input screen

### How It Works

The app uses RSVP (Rapid Serial Visual Presentation) technology to display one word at a time at your chosen speed. Each word has a red "anchor letter" at the Optimal Recognition Point (ORP).

**Key Feature**: The anchor letter stays in a **fixed position** on screen. Words shift left or right so their anchor letter always appears at the same spot. This eliminates eye movement and creates a stable focal point, dramatically improving reading speed and reducing eye strain.

Simply keep your eyes focused on the center where the red letter appears, and let the words flow to you.

## Technical Details

### Architecture

- **Pure JavaScript**: No frameworks required
- **Local Storage**: All data stored in browser
- **CORS Proxy**: For fetching cross-origin URLs
- **Content Extraction**: Simplified Readability algorithm

### File Structure

```
speed-reader/
├── index.html              # Main HTML structure
├── styles/
│   ├── main.css           # Core styling
│   └── components.css     # UI components
├── scripts/
│   ├── app.js             # Main application controller
│   ├── rsvp.js            # RSVP reading engine
│   ├── content.js         # URL fetching & content extraction
│   └── storage.js         # Local storage management
└── README.md              # This file
```

### Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with ES6 support

## URL Fetching Limitations

Due to browser CORS restrictions, some URLs may not load directly. The app uses public CORS proxies as a fallback, but these may have limitations:

- Rate limits on requests
- Some sites may block proxy access
- Privacy considerations with third-party proxies

**Workaround**: If a URL fails to load, copy the article text and use the "Text" input method.

## Privacy

- All data is stored locally in your browser
- No data is sent to external servers (except when fetching URLs)
- Reading history stays on your device
- Clear browser data to remove all stored information

## Tips for Best Results

1. **Find Your Speed**: Start at 300 WPM and gradually increase
2. **Don't Subvocalize**: Avoid "saying" words in your head
3. **Trust Your Vision**: Your eyes can process words faster than you think
4. **Practice Regularly**: Speed reading is a skill that improves with practice
5. **Use Quality Content**: Well-written articles work best

## Future Enhancements

Potential features for future versions:
- Dark mode theme
- Comprehension tests
- Custom anchor colors
- Export reading statistics
- Browser extension
- Mobile app version

## License

MIT License - feel free to use and modify as needed.

## Credits

Inspired by Spreeder and other RSVP reading tools. Built with vanilla JavaScript for maximum performance and simplicity.
