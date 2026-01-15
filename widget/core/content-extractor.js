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
