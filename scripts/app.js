/**
 * Speed Reader App - Main Application Controller
 */
class SpeedReaderApp {
    constructor() {
        // Initialize managers
        this.rsvpEngine = new RSVPEngine();
        this.storageManager = new StorageManager();
        this.contentManager = new ContentManager();

        // Make storage manager globally available
        window.storageManager = this.storageManager;

        // Current article state
        this.currentArticle = null;

        // DOM elements - Header
        this.urlInput = document.getElementById('urlInput');
        this.loadUrlBtn = document.getElementById('loadUrlBtn');
        this.pasteTextBtn = document.getElementById('pasteTextBtn');

        // DOM elements - Modal
        this.textModal = document.getElementById('textModal');
        this.textInput = document.getElementById('textInput');
        this.loadTextBtn = document.getElementById('loadTextBtn');
        this.closeTextModal = document.getElementById('closeTextModal');

        // DOM elements - Panels
        this.historyList = document.getElementById('historyList');
        this.articleTitle = document.getElementById('articleTitle');
        this.articleContent = document.getElementById('articleContent');
        this.rsvpPanel = document.getElementById('rsvpPanel');

        // DOM elements - Controls
        this.wpmSlider = document.getElementById('wpmSlider');
        this.wpmValue = document.getElementById('wpmValue');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.rewindBtn = document.getElementById('rewindBtn');
        this.forwardBtn = document.getElementById('forwardBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');

        this.init();
    }

    /**
     * Initialize app
     */
    init() {
        this.setupEventListeners();
        this.loadPreferences();
        this.renderHistory();
        this.checkURLParameters();
    }

    /**
     * Check for URL in path and auto-load content
     */
    checkURLParameters() {
        // Extract URL from path: /https://example.com/article -> https://example.com/article
        const path = window.location.pathname.slice(1);
        if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
            this.urlInput.value = decodeURIComponent(path);
            this.handleURLLoad();
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // URL input
        this.loadUrlBtn.addEventListener('click', () => this.handleURLLoad());
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleURLLoad();
        });

        // Text modal
        this.pasteTextBtn.addEventListener('click', () => this.openTextModal());
        this.closeTextModal.addEventListener('click', () => this.closeModal());
        this.textModal.querySelector('.modal-backdrop').addEventListener('click', () => this.closeModal());
        this.loadTextBtn.addEventListener('click', () => this.handleTextLoad());
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.handleTextLoad();
        });

        // WPM slider
        this.wpmSlider.addEventListener('input', (e) => {
            this.updateWPM(parseInt(e.target.value));
        });

        // Playback controls
        this.playPauseBtn.addEventListener('click', () => this.rsvpEngine.togglePlayPause());
        this.rewindBtn.addEventListener('click', () => this.rsvpEngine.rewind(10));
        this.forwardBtn.addEventListener('click', () => this.rsvpEngine.forward(10));

        // Fullscreen
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        document.addEventListener('fullscreenchange', () => this.onFullscreenChange());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    /**
     * Open text paste modal
     */
    openTextModal() {
        this.textModal.classList.remove('hidden');
        this.textInput.focus();
    }

    /**
     * Close modal
     */
    closeModal() {
        this.textModal.classList.add('hidden');
    }

    /**
     * Handle URL loading
     */
    async handleURLLoad() {
        const url = this.urlInput.value.trim();
        if (!url) {
            this.showError('Please enter a URL');
            return;
        }

        this.showLoading();

        try {
            const { title, text, source } = await this.contentManager.fetchURL(url);
            this.loadArticle(text, source, title);

            // Update URL for sharing
            history.replaceState({}, '', `/${source}`);
        } catch (error) {
            this.hideLoading();
            this.showError(error.message);
        }
    }

    /**
     * Handle text loading
     */
    handleTextLoad() {
        const text = this.textInput.value.trim();
        if (!text) {
            this.showError('Please enter some text');
            return;
        }

        this.loadArticle(text, 'text');
        this.closeModal();
        this.textInput.value = '';

        // Clear URL path
        history.replaceState({}, '', '/');
    }

    /**
     * Load article into both panels
     */
    loadArticle(text, source = 'text', title = '', existingId = null) {
        const preparedText = this.contentManager.prepareText(text);

        this.currentArticle = {
            title: title || this.generateTitle(preparedText),
            text: preparedText,
            source: source,
            words: preparedText.split(/\s+/)
        };

        // Update article panel
        this.renderArticlePanel();

        // Load into RSVP engine
        this.rsvpEngine.loadText(preparedText);

        // Save to storage (with existing ID if resuming)
        this.storageManager.startReading(preparedText, source, this.currentArticle.title, existingId);

        // Refresh history
        this.renderHistory();

        this.hideLoading();
    }

    /**
     * Generate title from text
     */
    generateTitle(text) {
        const firstLine = text.trim().split('\n')[0];
        const title = firstLine.substring(0, 60);
        return title.length < firstLine.length ? title + '...' : title;
    }

    /**
     * Render article in middle panel
     */
    renderArticlePanel() {
        if (!this.currentArticle) {
            this.articleTitle.textContent = 'Select an article';
            this.articleContent.innerHTML = '<p class="empty-state">Enter a URL above or select from history to start reading</p>';
            return;
        }

        this.articleTitle.textContent = this.currentArticle.title;

        // Split into paragraphs and render
        const paragraphs = this.currentArticle.text
            .split(/\n\n+/)
            .filter(p => p.trim())
            .map(p => `<p>${this.escapeHTML(p)}</p>`)
            .join('');

        this.articleContent.innerHTML = paragraphs || `<p>${this.escapeHTML(this.currentArticle.text)}</p>`;
    }

    /**
     * Load user preferences
     */
    loadPreferences() {
        const prefs = this.storageManager.getPreferences();
        const wpm = prefs.lastWPM || 300;

        this.wpmSlider.value = wpm;
        this.updateWPM(wpm);
    }

    /**
     * Update WPM
     */
    updateWPM(wpm) {
        this.wpmValue.textContent = wpm;
        this.rsvpEngine.setWPM(wpm);
        this.storageManager.savePreferences({ lastWPM: wpm });
    }

    /**
     * Render reading history
     */
    renderHistory() {
        const history = this.storageManager.getHistory();

        if (history.length === 0) {
            this.historyList.innerHTML = '<p class="empty-state">No reading history yet</p>';
            return;
        }

        this.historyList.innerHTML = history.map(item => {
            const progress = this.storageManager.getProgress(item);
            const progressDisplay = item.completed
                ? '<span class="completed-badge">Done</span>'
                : progress > 0
                    ? `<span class="progress-badge">${progress}%</span>`
                    : '';

            return `
                <div class="history-item" data-id="${item.id}">
                    <div class="history-content">
                        <div class="history-title">${this.escapeHTML(item.title)}</div>
                        <div class="history-meta">
                            <span>${this.storageManager.formatWordCount(item.wordCount)}</span>
                            <span>${this.storageManager.formatDate(item.lastReadAt || item.startedAt)}</span>
                            ${progressDisplay}
                        </div>
                        ${progress > 0 && progress < 100 ? `<div class="history-progress-bar"><div class="history-progress-fill" style="width: ${progress}%"></div></div>` : ''}
                    </div>
                    <button class="history-delete" data-id="${item.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');

        // Add event listeners
        this.historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.history-delete')) {
                    const id = parseInt(item.dataset.id);
                    this.loadHistoryItem(id);
                }
            });
        });

        this.historyList.querySelectorAll('.history-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.deleteHistoryItem(id);
            });
        });
    }

    /**
     * Load history item
     */
    loadHistoryItem(id) {
        const historyData = this.storageManager.getHistory();
        const item = historyData.find(h => h.id === id);

        if (item) {
            const progress = this.storageManager.getProgress(item);

            // If there's progress and not completed, ask to resume
            if (progress > 0 && progress < 100 && item.lastPosition > 0) {
                const resume = confirm(`Resume from ${progress}% (word ${item.lastPosition})?\n\nClick OK to resume, Cancel to start over.`);
                this.loadArticle(item.text, item.source, item.title, item.id);

                if (resume) {
                    // Set position to last read position
                    this.rsvpEngine.setPosition(item.lastPosition);
                }
            } else {
                this.loadArticle(item.text, item.source, item.title, item.id);
            }

            // Update URL if it was a URL source
            if (item.source && item.source !== 'text') {
                window.history.replaceState({}, '', `/${item.source}`);
            }
        }
    }

    /**
     * Delete history item
     */
    deleteHistoryItem(id) {
        if (confirm('Delete this item from history?')) {
            this.storageManager.deleteFromHistory(id);
            this.renderHistory();
        }
    }

    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.rsvpPanel.requestFullscreen().catch(err => {
                console.error('Fullscreen error:', err);
                // Fallback to CSS-based fullscreen
                this.rsvpPanel.classList.add('fullscreen-fallback');
            });
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Handle fullscreen state changes
     */
    onFullscreenChange() {
        const isFullscreen = !!document.fullscreenElement;
        this.fullscreenBtn.classList.toggle('active', isFullscreen);

        // Update button icon
        if (isFullscreen) {
            this.fullscreenBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                </svg>
            `;
        } else {
            this.fullscreenBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
            `;
            // Remove fallback class if present
            this.rsvpPanel.classList.remove('fullscreen-fallback');
        }
    }

    /**
     * Show loading state
     */
    showLoading() {
        this.articleContent.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <div class="loading-text">Loading article...</div>
            </div>
        `;
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        // Loading is replaced when content loads
    }

    /**
     * Show error message
     */
    showError(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'error-toast fade-in';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: #ef4444;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
        `;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 5000);
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboard(e) {
        // Ignore if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

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
            case 'f':
            case 'F':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'Escape':
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else if (!this.textModal.classList.contains('hidden')) {
                    this.closeModal();
                }
                break;
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SpeedReaderApp();
});
