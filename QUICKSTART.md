# Quick Start Guide

## Option 1: Open Directly (Recommended)

Simply double-click `index.html` or open it in your browser:
```bash
open index.html
```

## Option 2: Local Server (Better for URL fetching)

### Using Python (if installed):
```bash
python3 -m http.server 8080
```
Then open: http://localhost:8080

### Using npx serve:
```bash
npx serve .
```

### Using Node's live-server:
```bash
npm run dev
```

## First Steps

1. **Test with Text**
   - Click on the "Text" tab
   - Copy sample text from `DEMO.md`
   - Paste it in
   - Click "Start Reading"

2. **Try a URL**
   - Click on the "URL" tab
   - Enter: `https://example.com/article`
   - Click "Load Article"
   - Note: Some URLs may not work due to CORS restrictions

3. **Adjust Speed**
   - Use the WPM slider (300-900)
   - Start at 300 if you're new to speed reading
   - Gradually increase as you get comfortable

4. **Control Playback**
   - Click Play/Pause button
   - Or press Spacebar
   - Use arrow keys to skip forward/backward

## Tips

- **The red letter stays in the same position** - this is the anchor point
- Keep your eyes fixed on the center where the red letter appears
- Notice how words shift left/right so the anchor letter aligns perfectly
- Don't move your eyes or head - let the words come to you
- Avoid subvocalization (saying words in your head)
- Practice for a few minutes daily to build up speed

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space / K | Play/Pause |
| Left Arrow / J | Rewind 10 words |
| Right Arrow / L | Forward 10 words |
| Esc | Back to input |

## URL Format Examples

The app accepts standard URLs:
- `https://blog.example.com/article`
- `https://medium.com/@author/title`
- `https://news.site.com/story/12345`

**Note**: Direct URL format only (not the `www.url.com/https://...` format mentioned earlier). Simply paste the article URL directly.

## Troubleshooting

**URL not loading?**
- Some sites block external access
- Try copying the text instead and using the Text tab
- Use a local server for better CORS handling

**Want to save your reading?**
- All history is automatically saved in your browser
- Check the "History" tab to see past readings
- Your WPM preference is remembered

**Performance issues?**
- Close other browser tabs
- Try a simpler/lighter article
- Refresh the page if it becomes unresponsive

## What's Next?

1. Practice with the sample texts in `DEMO.md`
2. Try reading an article from your favorite blog
3. Gradually increase your WPM over several sessions
4. Track your progress in the History tab

Happy speed reading! 🚀
