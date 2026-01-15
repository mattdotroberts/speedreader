/**
 * RSVP Engine - Handles rapid serial visual presentation
 */
class RSVPEngine {
    constructor() {
        this.words = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.wpm = 300;
        this.interval = null;
        this.startTime = null;
        this.pausedTime = 0;
        
        // DOM elements
        this.wordDisplay = document.getElementById('wordDisplay');
        this.currentWordEl = document.getElementById('currentWord');
        this.totalWordsEl = document.getElementById('totalWords');
        this.progressFill = document.getElementById('progressFill');
        this.timeElapsedEl = document.getElementById('timeElapsed');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.playIcon = this.playPauseBtn.querySelector('.play-icon');
        this.pauseIcon = this.playPauseBtn.querySelector('.pause-icon');
    }

    /**
     * Load text and prepare for reading
     */
    loadText(text) {
        // Clean and split text into words
        this.words = text
            .trim()
            .replace(/\s+/g, ' ')
            .split(' ')
            .filter(word => word.length > 0);
        
        this.currentIndex = 0;
        this.pausedTime = 0;
        this.totalWordsEl.textContent = this.words.length;
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
        const { html, anchorPos } = this.highlightAnchor(word);
        
        const wrapper = this.wordDisplay.querySelector('.word-wrapper');
        // Wrap the HTML in a word-text span
        wrapper.innerHTML = `<span class="word-text">${html}</span>`;
        
        // Position the word so anchor letter aligns with center
        // We need to measure the actual width of text before the anchor
        requestAnimationFrame(() => {
            const wordTextEl = wrapper.querySelector('.word-text');
            const beforeEl = wordTextEl.querySelector('.before-anchor');
            const anchorEl = wordTextEl.querySelector('.anchor-letter');
            
            if (beforeEl && anchorEl && wordTextEl) {
                // Measure the width of text before anchor
                const beforeWidth = beforeEl.getBoundingClientRect().width;
                // Measure half the anchor letter width to center it
                const anchorHalfWidth = anchorEl.getBoundingClientRect().width / 2;
                // Total offset from left edge of word to center of anchor
                const offset = beforeWidth + anchorHalfWidth;
                
                // Position word text so anchor center is at 50%
                wordTextEl.style.left = `calc(50% - ${offset}px)`;
            }
        });
        
        this.wordDisplay.classList.add('word-transition');
        setTimeout(() => this.wordDisplay.classList.remove('word-transition'), 150);

        this.currentWordEl.textContent = this.currentIndex + 1;
        this.updateProgress();
    }

    /**
     * Highlight the anchor letter (Optimal Recognition Point)
     * Returns HTML and anchor position for alignment
     */
    highlightAnchor(word) {
        if (word.length === 0) return { html: '', anchorPos: 0 };
        
        // Calculate ORP position (slightly left of center)
        let anchorPos = Math.floor(word.length / 3);
        if (word.length === 1) anchorPos = 0;
        if (word.length === 2) anchorPos = 0;
        
        const before = word.substring(0, anchorPos);
        const anchor = word[anchorPos];
        const after = word.substring(anchorPos + 1);
        
        // Build the word with highlighted anchor
        const html = `<span class="before-anchor">${before}</span><span class="anchor-letter">${anchor}</span><span class="after-anchor">${after}</span>`;
        
        return { html, anchorPos };
    }

    /**
     * Update progress bar
     */
    updateProgress() {
        const progress = ((this.currentIndex + 1) / this.words.length) * 100;
        this.progressFill.style.width = `${progress}%`;
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
        
        this.timeElapsedEl.textContent = 
            `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * Start/resume playback
     */
    play() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.playIcon.classList.add('hidden');
        this.pauseIcon.classList.remove('hidden');
        
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
        this.playIcon.classList.remove('hidden');
        this.pauseIcon.classList.add('hidden');

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        // Save position when pausing
        if (window.storageManager && this.words.length > 0) {
            window.storageManager.updatePosition(this.currentIndex, this.words.length);
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
        this.timeElapsedEl.textContent = '0:00';
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
        const wasPaused = !this.isPlaying;
        this.pause();
        
        this.currentIndex = Math.max(0, this.currentIndex - n);
        this.updateDisplay();
        
        if (!wasPaused) {
            this.play();
        }
    }

    /**
     * Forward by n words
     */
    forward(n = 10) {
        const wasPaused = !this.isPlaying;
        this.pause();
        
        this.currentIndex = Math.min(this.words.length - 1, this.currentIndex + n);
        this.updateDisplay();
        
        if (!wasPaused) {
            this.play();
        }
    }

    /**
     * Complete reading
     */
    complete() {
        this.pause();
        this.wordDisplay.innerHTML = '<span style="color: var(--accent-color);">✓ Complete</span>';
        
        // Save to history
        if (window.storageManager) {
            window.storageManager.completeReading(this.currentIndex);
        }
    }

    /**
     * Reset engine
     */
    reset() {
        this.stop();
        this.words = [];
        this.wordDisplay.textContent = 'words';
        this.currentWordEl.textContent = '0';
        this.totalWordsEl.textContent = '0';
        this.progressFill.style.width = '0%';
        this.timeElapsedEl.textContent = '0:00';
    }
}

// Export for use in app.js
window.RSVPEngine = RSVPEngine;
