/**
 * Speed Reader Widget v1.0.0
 * Embeddable RSVP speed reading widget
 *
 * Usage:
 *   <script src="speed-reader-widget.js"></script>
 *   <script src="speed-reader-widget.js" data-mode="inline" data-container="#reader"></script>
 *
 * Options (data attributes):
 *   data-mode: "button" (default) | "inline"
 *   data-position: "bottom-right" (default) | "bottom-left" | "top-right" | "top-left"
 *   data-theme: "light" (default) | "dark"
 *   data-wpm: 100-900 (default: 300)
 *   data-content: "auto" (default) | CSS selector | text
 *   data-container: CSS selector for inline mode
 *   data-manual: disable auto-init, use SpeedReaderWidget class directly
 *   data-keyboard: "true" (default) | "false"
 *
 * Manual usage:
 *   <script src="speed-reader-widget.js" data-manual></script>
 *   <script>
 *     const widget = new SpeedReaderWidget({ mode: 'button', wpm: 400 });
 *     widget.open();
 *   </script>
 *
 * Generated: 2026-01-15T18:58:03.098Z
 */
(function() {
'use strict';

// ============================================================
// ui/styles.js
// ============================================================

/**
 * Widget Styles - Embedded CSS for Shadow DOM isolation
 * All classes prefixed with sr- to avoid conflicts
 */
const WIDGET_STYLES = `
/* ==================== CSS Variables (Theming) ==================== */
:host {
    --sr-bg-primary: #ffffff;
    --sr-bg-secondary: #f8f9fa;
    --sr-text-primary: #1a1a1a;
    --sr-text-secondary: #6b7280;
    --sr-border-color: #e5e7eb;
    --sr-accent-color: #3b82f6;
    --sr-accent-hover: #2563eb;
    --sr-anchor-color: #ef4444;
    --sr-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --sr-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --sr-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --sr-radius: 8px;
    --sr-transition: all 0.2s ease;

    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
}

/* Dark theme */
:host([data-theme="dark"]) {
    --sr-bg-primary: #1a1a1a;
    --sr-bg-secondary: #2d2d2d;
    --sr-text-primary: #ffffff;
    --sr-text-secondary: #9ca3af;
    --sr-border-color: #404040;
}

/* ==================== Utility Classes ==================== */
.sr-hidden {
    display: none !important;
}

/* ==================== Trigger Button (Base) ==================== */
.sr-trigger-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: var(--sr-accent-color);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: var(--sr-shadow-lg);
    transition: var(--sr-transition);
    font-family: inherit;
}

.sr-trigger-btn:hover {
    background: var(--sr-accent-hover);
    transform: scale(1.05);
}

.sr-trigger-btn svg {
    width: 20px;
    height: 20px;
}

/* Floating button positions (fixed positioning) */
:host([data-position="bottom-right"]) .sr-trigger-btn {
    position: fixed;
    z-index: 999998;
    bottom: 1.5rem;
    right: 1.5rem;
}

:host([data-position="bottom-left"]) .sr-trigger-btn {
    position: fixed;
    z-index: 999998;
    bottom: 1.5rem;
    left: 1.5rem;
}

:host([data-position="top-right"]) .sr-trigger-btn {
    position: fixed;
    z-index: 999998;
    top: 1.5rem;
    right: 1.5rem;
}

:host([data-position="top-left"]) .sr-trigger-btn {
    position: fixed;
    z-index: 999998;
    top: 1.5rem;
    left: 1.5rem;
}

/* Inline button (no fixed positioning) */
:host([data-position="inline"]) .sr-trigger-btn {
    position: relative;
}

/* ==================== Modal Overlay ==================== */
.sr-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    animation: sr-fadeIn 0.2s ease;
}

.sr-modal-container {
    position: fixed;
    inset: 0;
    z-index: 1000000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.sr-modal-content {
    background: var(--sr-bg-primary);
    border-radius: var(--sr-radius);
    box-shadow: var(--sr-shadow-lg);
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: sr-slideUp 0.3s ease;
}

.sr-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--sr-border-color);
}

.sr-modal-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--sr-text-primary);
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.sr-modal-close {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: var(--sr-text-secondary);
    font-size: 1.5rem;
    line-height: 1;
    transition: var(--sr-transition);
}

.sr-modal-close:hover {
    color: var(--sr-text-primary);
}

/* ==================== Reader Container ==================== */
.sr-reader {
    background: var(--sr-bg-primary);
    color: var(--sr-text-primary);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
}

/* ==================== Settings Bar ==================== */
.sr-settings-bar {
    background: var(--sr-bg-secondary);
    border-radius: var(--sr-radius);
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.sr-settings-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
}

.sr-settings-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--sr-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.sr-wpm-display {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--sr-text-primary);
}

.sr-wpm-slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: var(--sr-border-color);
    outline: none;
    -webkit-appearance: none;
    cursor: pointer;
}

.sr-wpm-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--sr-accent-color);
    cursor: pointer;
    transition: var(--sr-transition);
}

.sr-wpm-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
}

.sr-wpm-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--sr-accent-color);
    cursor: pointer;
    border: none;
}

/* ==================== RSVP Display ==================== */
.sr-rsvp-container {
    background: var(--sr-bg-secondary);
    border-radius: var(--sr-radius);
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 200px;
}

.sr-rsvp-display {
    text-align: center;
    position: relative;
}

.sr-focus-line {
    height: 2px;
    background: var(--sr-border-color);
    margin: 0.5rem auto;
    position: relative;
}

.sr-focus-line::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 3px;
    height: 40px;
    background: var(--sr-anchor-color);
    opacity: 0.3;
}

.sr-word-display {
    padding: 1.5rem 0.5rem;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.sr-word-wrapper {
    position: relative;
    width: 100%;
    height: 3rem;
}

.sr-word-text {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
    color: var(--sr-text-primary);
    white-space: nowrap;
    font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}

.sr-before-anchor,
.sr-after-anchor {
    display: inline;
}

.sr-anchor-letter {
    color: var(--sr-anchor-color);
    display: inline;
}

.sr-complete {
    color: var(--sr-accent-color);
    left: 50%;
    transform: translate(-50%, -50%);
}

.sr-progress-bar {
    width: 100%;
    height: 4px;
    background: var(--sr-border-color);
    border-radius: 2px;
    margin-top: 0.75rem;
    overflow: hidden;
}

.sr-progress-fill {
    height: 100%;
    background: var(--sr-accent-color);
    width: 0%;
    transition: width 0.1s linear;
}

/* ==================== Controls ==================== */
.sr-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
}

.sr-btn {
    background: var(--sr-bg-primary);
    border: 2px solid var(--sr-border-color);
    border-radius: 50%;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--sr-transition);
    color: var(--sr-text-primary);
    padding: 0;
}

.sr-btn:hover {
    background: var(--sr-bg-secondary);
    border-color: var(--sr-accent-color);
    color: var(--sr-accent-color);
    transform: scale(1.05);
}

.sr-btn:active {
    transform: scale(0.95);
}

.sr-btn svg {
    width: 20px;
    height: 20px;
}

.sr-play-pause {
    width: 56px;
    height: 56px;
    background: var(--sr-accent-color);
    border-color: var(--sr-accent-color);
    color: white;
}

.sr-play-pause:hover {
    background: var(--sr-accent-hover);
    border-color: var(--sr-accent-hover);
    color: white;
}

.sr-play-pause svg {
    width: 24px;
    height: 24px;
}

/* ==================== Stats ==================== */
.sr-stats {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    font-size: 0.75rem;
    color: var(--sr-text-secondary);
    background: var(--sr-bg-secondary);
    padding: 0.5rem 0.75rem;
    border-radius: var(--sr-radius);
}

.sr-stat-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.sr-stat-value {
    font-weight: 600;
    color: var(--sr-text-primary);
}

/* ==================== Inline Mode ==================== */
:host([data-mode="inline"]) .sr-reader {
    border: 1px solid var(--sr-border-color);
    border-radius: var(--sr-radius);
    box-shadow: var(--sr-shadow-md);
}

/* ==================== Error State ==================== */
.sr-error {
    background: #fef2f2;
    color: #991b1b;
    padding: 1rem;
    border-radius: var(--sr-radius);
    text-align: center;
    font-size: 0.9rem;
}

:host([data-theme="dark"]) .sr-error {
    background: #450a0a;
    color: #fca5a5;
}

/* ==================== Loading State ==================== */
.sr-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 2rem;
    color: var(--sr-text-secondary);
}

.sr-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--sr-border-color);
    border-top-color: var(--sr-accent-color);
    border-radius: 50%;
    animation: sr-spin 0.8s linear infinite;
}

/* ==================== Animations ==================== */
@keyframes sr-fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes sr-slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes sr-spin {
    to { transform: rotate(360deg); }
}

/* ==================== Responsive ==================== */
@media (max-width: 480px) {
    .sr-modal-content {
        max-width: 100%;
        max-height: 100%;
        border-radius: 0;
    }

    .sr-word-text {
        font-size: 2rem;
    }

    .sr-word-wrapper {
        height: 2.5rem;
    }

    .sr-stats {
        flex-direction: column;
        gap: 0.25rem;
    }

    .sr-settings-bar {
        flex-direction: column;
    }
}
`;

// ============================================================
// ui/templates.js
// ============================================================

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

// ============================================================
// core/content-extractor.js
// ============================================================

/**
 * Widget Content Extractor - Extracts article content from host page
 * Simplified version for widget use (no CORS proxy needed)
 */
class WidgetContentExtractor {
    constructor() {
        this.unwantedSelectors = [
            'script',
            'style',
            'noscript',
            'iframe',
            'nav',
            'header',
            'footer',
            'aside',
            '.advertisement',
            '.ads',
            '.ad',
            '.social-share',
            '.comments',
            '.related-posts',
            '[class*="cookie"]',
            '[class*="popup"]',
            '[class*="modal"]',
            '[class*="sidebar"]',
            '[class*="newsletter"]',
            '[class*="subscribe"]'
        ];

        this.contentSelectors = [
            'article',
            '[role="main"]',
            'main',
            '.post-content',
            '.article-content',
            '.article-body',
            '.entry-content',
            '.content',
            '#content',
            '.post-body',
            '.blog-post',
            '.story-body'
        ];

        this.titleSelectors = [
            'h1',
            'article h1',
            '.post-title',
            '.article-title',
            '.entry-title',
            '[class*="title"] h1',
            'meta[property="og:title"]',
            'title'
        ];
    }

    /**
     * Extract content from the current page
     */
    extractFromPage() {
        // Clone the document to avoid modifying the actual page
        const clone = document.cloneNode(true);

        const title = this.extractTitle(clone);
        this.removeUnwantedElements(clone);
        const text = this.findMainContent(clone);

        if (!text || text.length < 50) {
            return null;
        }

        return {
            title: title,
            text: this.cleanText(text)
        };
    }

    /**
     * Extract content from a specific selector
     */
    extractFromSelector(selector) {
        const element = document.querySelector(selector);
        if (!element) return null;

        const clone = element.cloneNode(true);
        this.removeUnwantedElements(clone);

        const text = this.extractText(clone);
        if (!text || text.length < 50) {
            return null;
        }

        return {
            title: this.extractTitle(document),
            text: this.cleanText(text)
        };
    }

    /**
     * Extract title from document
     */
    extractTitle(doc) {
        for (const selector of this.titleSelectors) {
            const element = doc.querySelector(selector);
            if (element) {
                const text = selector.includes('meta')
                    ? element.getAttribute('content')
                    : element.textContent;

                if (text && text.trim().length > 0 && text.trim().length < 200) {
                    return text.trim();
                }
            }
        }

        return document.title || 'Untitled';
    }

    /**
     * Remove scripts, styles, and other unwanted elements
     */
    removeUnwantedElements(doc) {
        this.unwantedSelectors.forEach(selector => {
            try {
                const elements = doc.querySelectorAll
                    ? doc.querySelectorAll(selector)
                    : [];
                elements.forEach(el => el.remove());
            } catch (e) {
                // Skip invalid selectors
            }
        });
    }

    /**
     * Find and extract main content
     */
    findMainContent(doc) {
        // Try common article selectors first
        for (const selector of this.contentSelectors) {
            const element = doc.querySelector(selector);
            if (element) {
                const text = this.extractText(element);
                if (text.length > 100) {
                    return text;
                }
            }
        }

        // Fallback: find the element with the most paragraph text
        const body = doc.body || doc;
        const paragraphs = Array.from(body.querySelectorAll('p'));

        if (paragraphs.length > 0) {
            const text = paragraphs
                .map(p => p.textContent.trim())
                .filter(t => t.length > 20)
                .join('\n\n');

            if (text.length > 100) {
                return text;
            }
        }

        // Last resort: get body text
        return body.textContent || '';
    }

    /**
     * Extract clean text from element
     */
    extractText(element) {
        // Get all text nodes, preserving paragraph structure
        const paragraphs = element.querySelectorAll('p');

        if (paragraphs.length > 0) {
            return Array.from(paragraphs)
                .map(p => p.textContent.trim())
                .filter(t => t.length > 0)
                .join('\n\n');
        }

        return element.textContent || '';
    }

    /**
     * Clean and normalize text
     */
    cleanText(text) {
        return text
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n\n')
            .trim();
    }
}

// ============================================================
// core/rsvp-engine.js
// ============================================================

/**
 * Widget RSVP Engine - Handles rapid serial visual presentation
 * Adapted for embeddable widget with container-scoped DOM queries
 */
class WidgetRSVPEngine {
    constructor(container) {
        this.container = container;
        this.words = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.wpm = 300;
        this.interval = null;
        this.startTime = null;
        this.pausedTime = 0;

        // Callbacks
        this.onComplete = null;
        this.onProgress = null;

        // DOM elements - scoped to container
        this.wordDisplay = container.querySelector('.sr-word-display');
        this.currentWordEl = container.querySelector('.sr-current');
        this.totalWordsEl = container.querySelector('.sr-total');
        this.progressFill = container.querySelector('.sr-progress-fill');
        this.timeElapsedEl = container.querySelector('.sr-time');
        this.playPauseBtn = container.querySelector('.sr-play-pause');
    }

    /**
     * Load text and prepare for reading
     */
    loadText(text) {
        this.words = text
            .trim()
            .replace(/\s+/g, ' ')
            .split(' ')
            .filter(word => word.length > 0);

        this.currentIndex = 0;
        this.pausedTime = 0;
        this.startTime = null;

        if (this.totalWordsEl) {
            this.totalWordsEl.textContent = this.words.length;
        }
        this.updateDisplay();
    }

    /**
     * Set reading speed in WPM
     */
    setWPM(wpm) {
        this.wpm = wpm;
        // Restart interval with new speed without resetting position
        if (this.isPlaying) {
            clearInterval(this.interval);
            this.interval = setInterval(() => {
                this.currentIndex++;
                this.updateDisplay();
                this.updateTime();
            }, this.getInterval());
        }
    }

    /**
     * Calculate interval in milliseconds based on WPM
     */
    getInterval() {
        return (60 / this.wpm) * 1000;
    }

    /**
     * Display current word with anchor highlighting
     */
    updateDisplay() {
        if (this.currentIndex >= this.words.length) {
            this.complete();
            return;
        }

        const word = this.words[this.currentIndex];
        const { html } = this.highlightAnchor(word);

        const wrapper = this.wordDisplay.querySelector('.sr-word-wrapper');
        wrapper.innerHTML = `<span class="sr-word-text">${html}</span>`;

        // Position the word so anchor letter aligns with center
        requestAnimationFrame(() => {
            const wordTextEl = wrapper.querySelector('.sr-word-text');
            const beforeEl = wordTextEl.querySelector('.sr-before-anchor');
            const anchorEl = wordTextEl.querySelector('.sr-anchor-letter');

            if (beforeEl && anchorEl && wordTextEl) {
                const beforeWidth = beforeEl.getBoundingClientRect().width;
                const anchorHalfWidth = anchorEl.getBoundingClientRect().width / 2;
                const offset = beforeWidth + anchorHalfWidth;
                wordTextEl.style.left = `calc(50% - ${offset}px)`;
            }
        });

        if (this.currentWordEl) {
            this.currentWordEl.textContent = this.currentIndex + 1;
        }
        this.updateProgress();
    }

    /**
     * Highlight the anchor letter (Optimal Recognition Point)
     */
    highlightAnchor(word) {
        if (word.length === 0) return { html: '' };

        let anchorPos = Math.floor(word.length / 3);
        if (word.length <= 2) anchorPos = 0;

        const before = word.substring(0, anchorPos);
        const anchor = word[anchorPos];
        const after = word.substring(anchorPos + 1);

        const html = `<span class="sr-before-anchor">${this.escapeHtml(before)}</span><span class="sr-anchor-letter">${this.escapeHtml(anchor)}</span><span class="sr-after-anchor">${this.escapeHtml(after)}</span>`;

        return { html };
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Update progress bar
     */
    updateProgress() {
        const progress = ((this.currentIndex + 1) / this.words.length) * 100;
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
        if (this.onProgress) {
            this.onProgress(progress, this.currentIndex, this.words.length);
        }
    }

    /**
     * Update elapsed time
     */
    updateTime() {
        if (!this.startTime) return;

        const elapsed = Date.now() - this.startTime - this.pausedTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if (this.timeElapsedEl) {
            this.timeElapsedEl.textContent =
                `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
    }

    /**
     * Start/resume playback
     */
    play() {
        if (this.isPlaying || this.words.length === 0) return;

        this.isPlaying = true;
        this.updatePlayPauseIcon();

        if (!this.startTime) {
            this.startTime = Date.now();
        }

        this.interval = setInterval(() => {
            this.currentIndex++;
            this.updateDisplay();
            this.updateTime();
        }, this.getInterval());
    }

    /**
     * Pause playback
     */
    pause() {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        this.updatePlayPauseIcon();

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    /**
     * Update play/pause button icon
     */
    updatePlayPauseIcon() {
        if (!this.playPauseBtn) return;

        const playIcon = this.playPauseBtn.querySelector('.sr-play-icon');
        const pauseIcon = this.playPauseBtn.querySelector('.sr-pause-icon');

        if (playIcon && pauseIcon) {
            if (this.isPlaying) {
                playIcon.classList.add('sr-hidden');
                pauseIcon.classList.remove('sr-hidden');
            } else {
                playIcon.classList.remove('sr-hidden');
                pauseIcon.classList.add('sr-hidden');
            }
        }
    }

    /**
     * Set position to a specific word index
     */
    setPosition(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.words.length - 1));
        this.updateDisplay();
    }

    /**
     * Stop playback
     */
    stop() {
        this.pause();
        this.currentIndex = 0;
        this.startTime = null;
        this.pausedTime = 0;
        this.updateDisplay();
        if (this.timeElapsedEl) {
            this.timeElapsedEl.textContent = '0:00';
        }
    }

    /**
     * Toggle play/pause
     */
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    /**
     * Rewind by n words
     */
    rewind(n = 10) {
        const wasPlaying = this.isPlaying;
        this.pause();

        this.currentIndex = Math.max(0, this.currentIndex - n);
        this.updateDisplay();

        if (wasPlaying) {
            this.play();
        }
    }

    /**
     * Forward by n words
     */
    forward(n = 10) {
        const wasPlaying = this.isPlaying;
        this.pause();

        this.currentIndex = Math.min(this.words.length - 1, this.currentIndex + n);
        this.updateDisplay();

        if (wasPlaying) {
            this.play();
        }
    }

    /**
     * Complete reading
     */
    complete() {
        this.pause();

        const wrapper = this.wordDisplay.querySelector('.sr-word-wrapper');
        if (wrapper) {
            wrapper.innerHTML = '<span class="sr-word-text sr-complete">Complete!</span>';
        }

        if (this.onComplete) {
            this.onComplete();
        }
    }

    /**
     * Reset engine
     */
    reset() {
        this.stop();
        this.words = [];

        const wrapper = this.wordDisplay.querySelector('.sr-word-wrapper');
        if (wrapper) {
            wrapper.innerHTML = '<span class="sr-word-text">Ready</span>';
        }
        if (this.currentWordEl) this.currentWordEl.textContent = '0';
        if (this.totalWordsEl) this.totalWordsEl.textContent = '0';
        if (this.progressFill) this.progressFill.style.width = '0%';
        if (this.timeElapsedEl) this.timeElapsedEl.textContent = '0:00';
    }

    /**
     * Get current state
     */
    getState() {
        return {
            isPlaying: this.isPlaying,
            currentIndex: this.currentIndex,
            totalWords: this.words.length,
            wpm: this.wpm,
            progress: this.words.length > 0
                ? ((this.currentIndex + 1) / this.words.length) * 100
                : 0
        };
    }
}

// ============================================================
// widget.js
// ============================================================

/**
 * Speed Reader Widget - Main controller class
 * Embeddable RSVP speed reading widget
 */
class SpeedReaderWidget {
    static instances = [];

    constructor(options = {}) {
        this.options = {
            mode: 'button',              // 'button' | 'inline'
            container: null,             // CSS selector for inline mode
            position: 'bottom-right',    // button position
            content: 'auto',             // 'auto' | CSS selector | text string
            wpm: 300,
            theme: 'light',              // 'light' | 'dark'
            enableKeyboard: true,
            onReady: null,
            onComplete: null,
            onError: null,
            ...options
        };

        this.hostElement = null;
        this.shadowRoot = null;
        this.rsvpEngine = null;
        this.contentExtractor = null;
        this.isOpen = false;
        this.extractedContent = null;

        SpeedReaderWidget.instances.push(this);
        this.init();
    }

    /**
     * Initialize the widget
     */
    init() {
        // Create host element
        this.hostElement = document.createElement('div');
        this.hostElement.className = 'speed-reader-widget-host';

        // Attach shadow DOM for style isolation
        this.shadowRoot = this.hostElement.attachShadow({ mode: 'open' });

        // Inject styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = WIDGET_STYLES;
        this.shadowRoot.appendChild(styleSheet);

        // Set data attributes for CSS styling
        this.hostElement.setAttribute('data-mode', this.options.mode);
        this.hostElement.setAttribute('data-position', this.options.position);
        this.hostElement.setAttribute('data-theme', this.options.theme);

        // Initialize content extractor
        this.contentExtractor = new WidgetContentExtractor();

        // Initialize based on mode
        if (this.options.mode === 'button') {
            this.initButtonMode();
        } else {
            this.initInlineMode();
        }

        // Mount to DOM
        this.mount();

        // Setup keyboard shortcuts
        if (this.options.enableKeyboard) {
            this.setupKeyboard();
        }

        // Trigger ready callback
        if (this.options.onReady) {
            this.options.onReady(this);
        }
    }

    /**
     * Initialize button mode - floating button that opens modal
     */
    initButtonMode() {
        const buttonContainer = document.createElement('div');
        buttonContainer.innerHTML = WIDGET_TEMPLATES.button;
        this.shadowRoot.appendChild(buttonContainer);

        const btn = this.shadowRoot.querySelector('.sr-trigger-btn');
        btn.addEventListener('click', () => this.open());
    }

    /**
     * Initialize inline mode - reader renders directly
     */
    initInlineMode() {
        const readerContainer = document.createElement('div');
        readerContainer.innerHTML = WIDGET_TEMPLATES.reader;
        this.shadowRoot.appendChild(readerContainer);

        this.initReader();
        this.loadContent();
    }

    /**
     * Mount widget to DOM
     */
    mount() {
        // For inline mode or inline button position, use container
        if (this.options.container) {
            const container = document.querySelector(this.options.container);
            if (container) {
                container.appendChild(this.hostElement);
                return;
            }
        }
        document.body.appendChild(this.hostElement);
    }

    /**
     * Open the modal (button mode)
     */
    open() {
        if (this.isOpen) return;
        this.isOpen = true;

        // Create modal
        const modalContainer = document.createElement('div');
        modalContainer.className = 'sr-modal-wrapper';
        modalContainer.innerHTML = WIDGET_TEMPLATES.modal;
        this.shadowRoot.appendChild(modalContainer);

        // Insert reader into modal
        const readerContainer = this.shadowRoot.querySelector('.sr-reader-container');
        readerContainer.innerHTML = WIDGET_TEMPLATES.reader;

        // Initialize reader
        this.initReader();

        // Update title with content title if available
        if (this.extractedContent) {
            const titleEl = this.shadowRoot.querySelector('.sr-modal-title');
            if (titleEl && this.extractedContent.title) {
                titleEl.textContent = this.extractedContent.title;
            }
        }

        // Setup close handlers
        const backdrop = this.shadowRoot.querySelector('.sr-modal-backdrop');
        const closeBtn = this.shadowRoot.querySelector('.sr-modal-close');

        backdrop.addEventListener('click', () => this.close());
        closeBtn.addEventListener('click', () => this.close());

        // Load content
        this.loadContent();
    }

    /**
     * Close the modal (button mode)
     */
    close() {
        if (!this.isOpen) return;
        this.isOpen = false;

        // Pause playback
        if (this.rsvpEngine) {
            this.rsvpEngine.pause();
        }

        // Remove modal
        const modalWrapper = this.shadowRoot.querySelector('.sr-modal-wrapper');
        if (modalWrapper) {
            modalWrapper.remove();
        }

        this.rsvpEngine = null;
    }

    /**
     * Initialize the RSVP reader
     */
    initReader() {
        const readerEl = this.shadowRoot.querySelector('.sr-reader');
        if (!readerEl) return;

        // Initialize RSVP engine
        this.rsvpEngine = new WidgetRSVPEngine(readerEl);
        this.rsvpEngine.setWPM(this.options.wpm);

        // Set completion callback
        this.rsvpEngine.onComplete = () => {
            if (this.options.onComplete) {
                this.options.onComplete(this);
            }
        };

        // Setup controls
        this.setupControls();
    }

    /**
     * Setup playback controls
     */
    setupControls() {
        const reader = this.shadowRoot.querySelector('.sr-reader');
        if (!reader) return;

        // Play/Pause
        const playPauseBtn = reader.querySelector('.sr-play-pause');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.rsvpEngine.togglePlayPause();
            });
        }

        // Rewind
        const rewindBtn = reader.querySelector('.sr-rewind');
        if (rewindBtn) {
            rewindBtn.addEventListener('click', () => {
                this.rsvpEngine.rewind(10);
            });
        }

        // Forward
        const forwardBtn = reader.querySelector('.sr-forward');
        if (forwardBtn) {
            forwardBtn.addEventListener('click', () => {
                this.rsvpEngine.forward(10);
            });
        }

        // WPM Slider
        const wpmSlider = reader.querySelector('.sr-wpm-slider');
        const wpmValue = reader.querySelector('.sr-wpm-value');
        if (wpmSlider && wpmValue) {
            wpmSlider.value = this.options.wpm;
            wpmValue.textContent = this.options.wpm;

            wpmSlider.addEventListener('input', (e) => {
                const wpm = parseInt(e.target.value);
                wpmValue.textContent = wpm;
                this.rsvpEngine.setWPM(wpm);
                this.options.wpm = wpm;
            });
        }
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            // Only handle if widget is active (modal open or inline mode)
            if (this.options.mode === 'button' && !this.isOpen) return;

            // Don't intercept if user is typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (!this.rsvpEngine) return;

            switch (e.key) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    this.rsvpEngine.togglePlayPause();
                    break;
                case 'ArrowLeft':
                case 'j':
                    e.preventDefault();
                    this.rsvpEngine.rewind(10);
                    break;
                case 'ArrowRight':
                case 'l':
                    e.preventDefault();
                    this.rsvpEngine.forward(10);
                    break;
                case 'Escape':
                    if (this.options.mode === 'button' && this.isOpen) {
                        this.close();
                    }
                    break;
            }
        });
    }

    /**
     * Load content into the reader
     */
    loadContent() {
        const readerContainer = this.options.mode === 'button'
            ? this.shadowRoot.querySelector('.sr-reader-container')
            : this.shadowRoot;

        // Show loading state
        if (this.options.mode === 'button') {
            const reader = readerContainer.querySelector('.sr-reader');
            if (reader) {
                reader.innerHTML = WIDGET_TEMPLATES.loading;
            }
        }

        // Get content
        const content = this.getContent();

        if (!content || !content.text) {
            this.showError();
            return;
        }

        this.extractedContent = content;

        // Restore reader UI if we showed loading
        if (this.options.mode === 'button') {
            readerContainer.innerHTML = WIDGET_TEMPLATES.reader;
            this.initReader();

            // Update modal title
            const titleEl = this.shadowRoot.querySelector('.sr-modal-title');
            if (titleEl && content.title) {
                titleEl.textContent = content.title;
            }
        }

        // Load text into engine
        if (this.rsvpEngine) {
            this.rsvpEngine.loadText(content.text);
        }
    }

    /**
     * Get content based on options
     */
    getContent() {
        const contentOption = this.options.content;

        // Auto-extract from page
        if (contentOption === 'auto') {
            // First check for selected text
            const selection = window.getSelection();
            if (selection && selection.toString().trim().length > 50) {
                return {
                    title: 'Selected Text',
                    text: selection.toString().trim()
                };
            }

            // Extract from page
            return this.contentExtractor.extractFromPage();
        }

        // Extract from specific selector
        if (contentOption.startsWith('#') || contentOption.startsWith('.') || contentOption.startsWith('[')) {
            return this.contentExtractor.extractFromSelector(contentOption);
        }

        // Direct text content
        if (typeof contentOption === 'string' && contentOption.length > 50) {
            return {
                title: 'Custom Text',
                text: contentOption
            };
        }

        return null;
    }

    /**
     * Show error state
     */
    showError() {
        const readerContainer = this.options.mode === 'button'
            ? this.shadowRoot.querySelector('.sr-reader-container')
            : this.shadowRoot.querySelector('.sr-reader');

        if (readerContainer) {
            readerContainer.innerHTML = WIDGET_TEMPLATES.error;
        }

        if (this.options.onError) {
            this.options.onError(new Error('Could not extract content'));
        }
    }

    /**
     * Set WPM externally
     */
    setWPM(wpm) {
        this.options.wpm = wpm;
        if (this.rsvpEngine) {
            this.rsvpEngine.setWPM(wpm);
        }

        // Update slider if visible
        const wpmSlider = this.shadowRoot.querySelector('.sr-wpm-slider');
        const wpmValue = this.shadowRoot.querySelector('.sr-wpm-value');
        if (wpmSlider) wpmSlider.value = wpm;
        if (wpmValue) wpmValue.textContent = wpm;
    }

    /**
     * Set theme
     */
    setTheme(theme) {
        this.options.theme = theme;
        this.hostElement.setAttribute('data-theme', theme);
    }

    /**
     * Load specific text content
     */
    loadText(text, title = 'Custom Text') {
        this.extractedContent = { text, title };

        if (this.rsvpEngine) {
            this.rsvpEngine.loadText(text);
        }

        // Update title if modal is open
        const titleEl = this.shadowRoot.querySelector('.sr-modal-title');
        if (titleEl) {
            titleEl.textContent = title;
        }
    }

    /**
     * Get current state
     */
    getState() {
        return {
            isOpen: this.isOpen,
            mode: this.options.mode,
            wpm: this.options.wpm,
            theme: this.options.theme,
            engine: this.rsvpEngine ? this.rsvpEngine.getState() : null
        };
    }

    /**
     * Destroy the widget
     */
    destroy() {
        // Close if open
        if (this.isOpen) {
            this.close();
        }

        // Remove from DOM
        if (this.hostElement && this.hostElement.parentNode) {
            this.hostElement.parentNode.removeChild(this.hostElement);
        }

        // Remove from instances
        const index = SpeedReaderWidget.instances.indexOf(this);
        if (index > -1) {
            SpeedReaderWidget.instances.splice(index, 1);
        }
    }

    /**
     * Static method to get all instances
     */
    static getInstances() {
        return SpeedReaderWidget.instances;
    }

    /**
     * Static method to destroy all instances
     */
    static destroyAll() {
        [...SpeedReaderWidget.instances].forEach(instance => instance.destroy());
    }
}

// ============================================================
// init.js
// ============================================================

/**
 * Speed Reader Widget - Auto-initialization
 * Parses data attributes from script tag and initializes widget
 */
(function() {
    'use strict';

    // Find the script tag that loaded this widget
    const scriptTag = document.currentScript ||
        (function() {
            const scripts = document.getElementsByTagName('script');
            for (let i = scripts.length - 1; i >= 0; i--) {
                if (scripts[i].src && scripts[i].src.includes('speed-reader-widget')) {
                    return scripts[i];
                }
            }
            return null;
        })();

    // Check for manual initialization mode
    if (scriptTag && scriptTag.hasAttribute('data-manual')) {
        // Just expose the class globally
        window.SpeedReaderWidget = SpeedReaderWidget;
        return;
    }

    /**
     * Parse options from script tag data attributes
     */
    function parseOptions(tag) {
        if (!tag) return {};

        return {
            mode: tag.dataset.mode || 'button',
            container: tag.dataset.container || null,
            position: tag.dataset.position || 'bottom-right',
            content: tag.dataset.content || 'auto',
            wpm: parseInt(tag.dataset.wpm) || 300,
            theme: tag.dataset.theme || 'light',
            enableKeyboard: tag.dataset.keyboard !== 'false'
        };
    }

    /**
     * Initialize widget when DOM is ready
     */
    function initWidget() {
        const options = parseOptions(scriptTag);

        // Create widget instance
        window.speedReaderWidget = new SpeedReaderWidget(options);

        // Expose class for manual instantiation
        window.SpeedReaderWidget = SpeedReaderWidget;
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        // DOM already loaded
        initWidget();
    }
})();

})();
