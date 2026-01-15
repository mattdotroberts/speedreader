/**
 * Widget HTML Templates
 */
const WIDGET_TEMPLATES = {
    // Floating button that triggers the modal
    button: `
        <button class="sr-trigger-btn" aria-label="Open Speed Reader">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <span>Speed Read</span>
        </button>
    `,

    // Modal overlay structure
    modal: `
        <div class="sr-modal-backdrop"></div>
        <div class="sr-modal-container">
            <div class="sr-modal-content">
                <div class="sr-modal-header">
                    <h3 class="sr-modal-title">Speed Reader</h3>
                    <button class="sr-modal-close" aria-label="Close">&times;</button>
                </div>
                <div class="sr-reader-container"></div>
            </div>
        </div>
    `,

    // Core reader UI (used in both button modal and inline modes)
    reader: `
        <div class="sr-reader">
            <div class="sr-settings-bar">
                <div class="sr-settings-group">
                    <span class="sr-settings-label">Speed</span>
                    <span class="sr-wpm-display"><span class="sr-wpm-value">300</span> WPM</span>
                </div>
                <div class="sr-settings-group" style="flex: 2;">
                    <input type="range" class="sr-wpm-slider" min="100" max="900" step="25" value="300" aria-label="Words per minute">
                </div>
            </div>

            <div class="sr-rsvp-container">
                <div class="sr-rsvp-display">
                    <div class="sr-focus-line"></div>
                    <div class="sr-word-display">
                        <div class="sr-word-wrapper">
                            <span class="sr-word-text">Ready</span>
                        </div>
                    </div>
                    <div class="sr-focus-line"></div>
                </div>
                <div class="sr-progress-bar">
                    <div class="sr-progress-fill"></div>
                </div>
            </div>

            <div class="sr-controls">
                <button class="sr-btn sr-rewind" title="Rewind 10 words" aria-label="Rewind">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 19 2 12 11 5 11 19"/>
                        <polygon points="22 19 13 12 22 5 22 19"/>
                    </svg>
                </button>
                <button class="sr-btn sr-play-pause" title="Play/Pause" aria-label="Play or Pause">
                    <svg class="sr-play-icon" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    <svg class="sr-pause-icon sr-hidden" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16"/>
                        <rect x="14" y="4" width="4" height="16"/>
                    </svg>
                </button>
                <button class="sr-btn sr-forward" title="Forward 10 words" aria-label="Forward">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="13 19 22 12 13 5 13 19"/>
                        <polygon points="2 19 11 12 2 5 2 19"/>
                    </svg>
                </button>
            </div>

            <div class="sr-stats">
                <div class="sr-stat-item">
                    Word <span class="sr-stat-value sr-current">0</span> of <span class="sr-stat-value sr-total">0</span>
                </div>
                <div class="sr-stat-item">
                    Time: <span class="sr-stat-value sr-time">0:00</span>
                </div>
            </div>
        </div>
    `,

    // Loading state
    loading: `
        <div class="sr-loading">
            <div class="sr-spinner"></div>
            <span>Extracting content...</span>
        </div>
    `,

    // Error state
    error: `
        <div class="sr-error">
            <p>Could not extract content from this page.</p>
            <p style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.8;">Try selecting text on the page first, then open the reader.</p>
        </div>
    `
};
