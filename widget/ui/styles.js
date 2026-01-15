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
