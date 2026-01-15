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
