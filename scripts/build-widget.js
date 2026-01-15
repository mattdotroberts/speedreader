#!/usr/bin/env node

/**
 * Build script for Speed Reader Widget
 * Concatenates all widget source files into a single distributable file
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const WIDGET_DIR = path.join(ROOT_DIR, 'widget');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// Files to concatenate in order (dependencies first)
const sourceFiles = [
    'ui/styles.js',
    'ui/templates.js',
    'core/content-extractor.js',
    'core/rsvp-engine.js',
    'widget.js',
    'init.js'
];

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Build the widget
console.log('Building Speed Reader Widget...\n');

let output = `/**
 * Speed Reader Widget v1.0.0
 * Embeddable RSVP speed reading widget
 *
 * Usage:
 *   <script src="speed-reader-widget.js"></script>
 *   <script src="speed-reader-widget.js" data-mode="inline" data-container="#reader"></script>
 *
 * Options (data attributes):
 *   data-mode: "button" (default) | "inline"
 *   data-position: "bottom-right" (default) | "bottom-left" | "top-right" | "top-left"
 *   data-theme: "light" (default) | "dark"
 *   data-wpm: 100-900 (default: 300)
 *   data-content: "auto" (default) | CSS selector | text
 *   data-container: CSS selector for inline mode
 *   data-manual: disable auto-init, use SpeedReaderWidget class directly
 *   data-keyboard: "true" (default) | "false"
 *
 * Manual usage:
 *   <script src="speed-reader-widget.js" data-manual></script>
 *   <script>
 *     const widget = new SpeedReaderWidget({ mode: 'button', wpm: 400 });
 *     widget.open();
 *   </script>
 *
 * Generated: ${new Date().toISOString()}
 */
(function() {
'use strict';

`;

// Read and concatenate each file
sourceFiles.forEach((file, index) => {
    const filePath = path.join(WIDGET_DIR, file);

    if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found: ${file}`);
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf8');

    output += `// ============================================================\n`;
    output += `// ${file}\n`;
    output += `// ============================================================\n\n`;
    output += content.trim();
    output += '\n\n';

    console.log(`  + ${file}`);
});

output += '})();\n';

// Write output
const outputPath = path.join(DIST_DIR, 'speed-reader-widget.js');
fs.writeFileSync(outputPath, output);

// Calculate size
const stats = fs.statSync(outputPath);
const sizeKB = (stats.size / 1024).toFixed(1);

console.log(`\nBuild complete!`);
console.log(`Output: dist/speed-reader-widget.js (${sizeKB} KB)`);
