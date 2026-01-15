/**
 * Content Manager - Handles URL fetching and text extraction
 */
class ContentManager {
    constructor() {
        this.corsProxies = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?'
        ];
        this.currentProxyIndex = 0;
    }

    /**
     * Fetch content from URL
     */
    async fetchURL(url) {
        // Validate URL
        if (!this.isValidURL(url)) {
            throw new Error('Please enter a valid URL');
        }

        // Try direct fetch first (will work for same-origin or CORS-enabled sites)
        try {
            const response = await fetch(url);
            if (response.ok) {
                const html = await response.text();
                return this.extractContent(html, url);
            }
        } catch (error) {
            console.log('Direct fetch failed, trying CORS proxy...');
        }

        // Try CORS proxies
        for (let i = 0; i < this.corsProxies.length; i++) {
            try {
                const proxyURL = this.corsProxies[i] + encodeURIComponent(url);
                const response = await fetch(proxyURL);
                
                if (response.ok) {
                    const html = await response.text();
                    return this.extractContent(html, url);
                }
            } catch (error) {
                console.log(`Proxy ${i + 1} failed:`, error);
            }
        }

        throw new Error('Unable to fetch URL. Please try copying and pasting the text instead.');
    }

    /**
     * Validate URL format
     */
    isValidURL(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    /**
     * Extract readable content from HTML
     * Uses a simplified version of Readability algorithm
     */
    extractContent(html, url) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Try to find the article title
        let title = this.extractTitle(doc, url);

        // Remove unwanted elements
        this.removeUnwantedElements(doc);

        // Try to find main content
        const content = this.findMainContent(doc);

        if (!content || content.length < 100) {
            throw new Error('Could not extract readable content from this URL. Please try pasting the text directly.');
        }

        return {
            title: title,
            text: content,
            source: url
        };
    }

    /**
     * Extract title from document
     */
    extractTitle(doc, url) {
        // Try various title selectors
        const selectors = [
            'h1',
            'article h1',
            '.post-title',
            '.article-title',
            '[class*="title"]',
            'meta[property="og:title"]',
            'title'
        ];

        for (const selector of selectors) {
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

        // Fallback to URL
        try {
            return new URL(url).hostname;
        } catch {
            return 'Untitled';
        }
    }

    /**
     * Remove scripts, styles, and other unwanted elements
     */
    removeUnwantedElements(doc) {
        const unwantedSelectors = [
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
            '.social-share',
            '.comments',
            '.related-posts',
            '[class*="cookie"]',
            '[class*="popup"]',
            '[class*="modal"]'
        ];

        unwantedSelectors.forEach(selector => {
            doc.querySelectorAll(selector).forEach(el => el.remove());
        });
    }

    /**
     * Find and extract main content
     */
    findMainContent(doc) {
        // Try common article selectors
        const contentSelectors = [
            'article',
            '[role="main"]',
            'main',
            '.post-content',
            '.article-content',
            '.entry-content',
            '.content',
            '#content'
        ];

        for (const selector of contentSelectors) {
            const element = doc.querySelector(selector);
            if (element) {
                const text = this.extractText(element);
                if (text.length > 100) {
                    return text;
                }
            }
        }

        // Fallback: get all paragraphs from body
        const paragraphs = Array.from(doc.querySelectorAll('p'));
        const text = paragraphs
            .map(p => p.textContent.trim())
            .filter(t => t.length > 20)
            .join(' ');

        return text;
    }

    /**
     * Extract clean text from element
     */
    extractText(element) {
        // Get text content and clean it up
        return element.textContent
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, ' ')
            .trim();
    }

    /**
     * Clean and prepare text for reading
     */
    prepareText(text) {
        return text
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, ' ')
            .trim();
    }
}

// Export for use in app.js
window.ContentManager = ContentManager;
