/**
 * Storage Manager - Handles local storage for history and preferences
 */
class StorageManager {
    constructor() {
        this.storageKey = 'speedReaderData';
        this.currentReading = null;
        this.currentHistoryId = null;
    }

    /**
     * Get all data from local storage
     */
    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : { history: [], preferences: {} };
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return { history: [], preferences: {} };
        }
    }

    /**
     * Save data to local storage
     */
    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    }

    /**
     * Get user preferences
     */
    getPreferences() {
        const data = this.getData();
        return data.preferences || {
            wpm: 300,
            lastWPM: 300
        };
    }

    /**
     * Save user preferences
     */
    savePreferences(preferences) {
        const data = this.getData();
        data.preferences = { ...data.preferences, ...preferences };
        this.saveData(data);
    }

    /**
     * Get reading history
     */
    getHistory() {
        const data = this.getData();
        return data.history || [];
    }

    /**
     * Start a new reading session or resume existing one
     */
    startReading(text, source = 'text', title = '', existingId = null) {
        if (existingId) {
            // Resuming existing reading
            this.currentHistoryId = existingId;
            return;
        }

        // Check if we already have this article in history (by source URL)
        const history = this.getHistory();
        const existing = source !== 'text'
            ? history.find(h => h.source === source)
            : null;

        if (existing) {
            this.currentHistoryId = existing.id;
            return;
        }

        // Create new reading entry
        const newReading = {
            id: Date.now(),
            title: title || this.generateTitle(text),
            source: source,
            text: text,
            wordCount: text.trim().split(/\s+/).length,
            startedAt: new Date().toISOString(),
            lastReadAt: new Date().toISOString(),
            completed: false,
            lastPosition: 0,
            wordsRead: 0
        };

        this.currentHistoryId = newReading.id;
        this.addToHistory(newReading);
    }

    /**
     * Update reading position
     */
    updatePosition(position, wordCount) {
        if (!this.currentHistoryId) return;

        const data = this.getData();
        const item = data.history.find(h => h.id === this.currentHistoryId);

        if (item) {
            item.lastPosition = position;
            item.lastReadAt = new Date().toISOString();
            item.wordsRead = Math.max(item.wordsRead || 0, position);
            this.saveData(data);
        }
    }

    /**
     * Complete current reading session
     */
    completeReading(wordsRead) {
        if (!this.currentHistoryId) return;

        const data = this.getData();
        const item = data.history.find(h => h.id === this.currentHistoryId);

        if (item) {
            item.completed = true;
            item.wordsRead = wordsRead;
            item.lastPosition = wordsRead;
            item.completedAt = new Date().toISOString();
            this.saveData(data);
        }

        this.currentHistoryId = null;
    }

    /**
     * Get progress percentage for a history item
     */
    getProgress(item) {
        if (!item || !item.wordCount) return 0;
        if (item.completed) return 100;
        const position = item.lastPosition || 0;
        return Math.round((position / item.wordCount) * 100);
    }

    /**
     * Add reading to history
     */
    addToHistory(reading) {
        const data = this.getData();
        data.history = data.history || [];

        // Add to beginning of array
        data.history.unshift(reading);

        // Keep only last 50 readings
        if (data.history.length > 50) {
            data.history = data.history.slice(0, 50);
        }

        this.saveData(data);
    }

    /**
     * Delete reading from history
     */
    deleteFromHistory(id) {
        const data = this.getData();
        data.history = data.history.filter(item => item.id !== id);
        this.saveData(data);
    }

    /**
     * Clear all history
     */
    clearHistory() {
        const data = this.getData();
        data.history = [];
        this.saveData(data);
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
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString();
    }

    /**
     * Format word count
     */
    formatWordCount(count) {
        if (count < 1000) return `${count} words`;
        return `${(count / 1000).toFixed(1)}k words`;
    }
}

// Export for use in app.js
window.StorageManager = StorageManager;
