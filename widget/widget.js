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
