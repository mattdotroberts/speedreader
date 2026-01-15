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
