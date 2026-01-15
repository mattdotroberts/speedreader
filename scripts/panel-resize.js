/**
 * Panel Resize - Handles draggable panel resizing
 */
class PanelResizer {
    constructor() {
        this.container = document.getElementById('panelContainer');
        this.handles = document.querySelectorAll('.resize-handle');
        this.isDragging = false;
        this.currentHandle = null;
        this.startX = 0;
        this.startWidths = {};

        // Min/max widths for panels
        this.minWidths = {
            historyPanel: 200,
            articlePanel: 300,
            rsvpPanel: 320
        };

        this.init();
    }

    init() {
        this.handles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => this.startDrag(e, handle));
        });

        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());

        // Touch support
        this.handles.forEach(handle => {
            handle.addEventListener('touchstart', (e) => this.startDrag(e, handle), { passive: false });
        });

        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('touchend', () => this.stopDrag());

        // Load saved widths
        this.loadSavedWidths();
    }

    startDrag(e, handle) {
        // Only on desktop
        if (window.innerWidth <= 768) return;

        e.preventDefault();
        this.isDragging = true;
        this.currentHandle = handle;
        handle.classList.add('dragging');

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        this.startX = clientX;

        // Get current panel widths
        const leftPanelId = handle.dataset.left;
        const rightPanelId = handle.dataset.right;
        const leftPanel = document.getElementById(leftPanelId);
        const rightPanel = document.getElementById(rightPanelId);

        this.startWidths = {
            left: leftPanel.offsetWidth,
            right: rightPanel.offsetWidth,
            leftId: leftPanelId,
            rightId: rightPanelId
        };

        // Prevent text selection while dragging
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
    }

    drag(e) {
        if (!this.isDragging) return;

        e.preventDefault();

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const deltaX = clientX - this.startX;

        const leftPanel = document.getElementById(this.startWidths.leftId);
        const rightPanel = document.getElementById(this.startWidths.rightId);

        let newLeftWidth = this.startWidths.left + deltaX;
        let newRightWidth = this.startWidths.right - deltaX;

        // Apply min widths
        const minLeft = this.minWidths[this.startWidths.leftId] || 200;
        const minRight = this.minWidths[this.startWidths.rightId] || 200;

        if (newLeftWidth < minLeft) {
            newLeftWidth = minLeft;
            newRightWidth = this.startWidths.left + this.startWidths.right - minLeft;
        }

        if (newRightWidth < minRight) {
            newRightWidth = minRight;
            newLeftWidth = this.startWidths.left + this.startWidths.right - minRight;
        }

        // Update grid template
        this.updateGridColumns(leftPanel, rightPanel, newLeftWidth, newRightWidth);
    }

    updateGridColumns(leftPanel, rightPanel, leftWidth, rightWidth) {
        const historyPanel = document.getElementById('historyPanel');
        const articlePanel = document.getElementById('articlePanel');
        const rsvpPanel = document.getElementById('rsvpPanel');

        let col1 = historyPanel.offsetWidth;
        let col3 = articlePanel.offsetWidth;
        let col5 = rsvpPanel.offsetWidth;

        // Determine which panels are being resized
        if (leftPanel.id === 'historyPanel') {
            col1 = leftWidth;
            col3 = rightWidth;
        } else if (leftPanel.id === 'articlePanel') {
            col3 = leftWidth;
            col5 = rightWidth;
        }

        this.container.style.gridTemplateColumns = `${col1}px 6px 1fr 6px ${col5}px`;

        // For the middle panel (article), we let it flex (1fr)
        // So we only set explicit widths for history and rsvp panels
        historyPanel.style.width = `${col1}px`;
        historyPanel.style.minWidth = `${col1}px`;
        historyPanel.style.maxWidth = `${col1}px`;

        rsvpPanel.style.width = `${col5}px`;
        rsvpPanel.style.minWidth = `${col5}px`;
        rsvpPanel.style.maxWidth = `${col5}px`;
    }

    stopDrag() {
        if (!this.isDragging) return;

        this.isDragging = false;
        if (this.currentHandle) {
            this.currentHandle.classList.remove('dragging');
        }
        this.currentHandle = null;

        document.body.style.userSelect = '';
        document.body.style.cursor = '';

        // Save widths
        this.saveWidths();
    }

    saveWidths() {
        const historyPanel = document.getElementById('historyPanel');
        const rsvpPanel = document.getElementById('rsvpPanel');

        const widths = {
            history: historyPanel.offsetWidth,
            rsvp: rsvpPanel.offsetWidth
        };

        try {
            localStorage.setItem('speedReaderPanelWidths', JSON.stringify(widths));
        } catch (e) {
            console.error('Error saving panel widths:', e);
        }
    }

    loadSavedWidths() {
        try {
            const saved = localStorage.getItem('speedReaderPanelWidths');
            if (saved && window.innerWidth > 768) {
                const widths = JSON.parse(saved);

                const historyPanel = document.getElementById('historyPanel');
                const rsvpPanel = document.getElementById('rsvpPanel');

                if (widths.history && widths.rsvp) {
                    historyPanel.style.width = `${widths.history}px`;
                    historyPanel.style.minWidth = `${widths.history}px`;
                    historyPanel.style.maxWidth = `${widths.history}px`;

                    rsvpPanel.style.width = `${widths.rsvp}px`;
                    rsvpPanel.style.minWidth = `${widths.rsvp}px`;
                    rsvpPanel.style.maxWidth = `${widths.rsvp}px`;

                    this.container.style.gridTemplateColumns = `${widths.history}px 6px 1fr 6px ${widths.rsvp}px`;
                }
            }
        } catch (e) {
            console.error('Error loading panel widths:', e);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.panelResizer = new PanelResizer();
});
