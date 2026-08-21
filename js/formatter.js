'use strict';

const Formatter = {
    /**
     * Smart format: detect stringify'd JSON, parse accordingly, pretty-print.
     * @param {string} input - Raw input text
     * @returns {{success: boolean, data?: string, message: string}}
     */
    format(input) {
        const trimmed = input.trim();
        if (!trimmed) {
            return { success: false, message: 'Input is empty' };
        }

        if (trimmed.length > 5 * 1024 * 1024) {
            console.warn('JSON Tools: Large input (>5MB), processing may be slow');
        }

        try {
            const firstParse = JSON.parse(trimmed);

            // If first parse result is a string, input was JSON.stringify'd
            if (typeof firstParse === 'string') {
                try {
                    const secondParse = JSON.parse(firstParse);
                    const formatted = JSON.stringify(secondParse, null, 2);
                    return { success: true, data: formatted, message: 'Formatted (detected stringify\'d JSON) ✓' };
                } catch (e) {
                    // First parse gave a string but it's not valid JSON inside
                    return { success: true, data: firstParse, message: 'Unwrapped string (inner content is not JSON) ✓' };
                }
            }

            const formatted = JSON.stringify(firstParse, null, 2);
            return { success: true, data: formatted, message: 'Formatted ✓' };
        } catch (e) {
            return { success: false, message: `Error: ${this._formatError(e)}` };
        }
    },

    /**
     * Minify JSON to single line.
     * @param {string} input
     * @returns {{success: boolean, data?: string, message: string}}
     */
    minify(input) {
        const trimmed = input.trim();
        if (!trimmed) {
            return { success: false, message: 'Input is empty' };
        }

        if (trimmed.length > 5 * 1024 * 1024) {
            console.warn('JSON Tools: Large input (>5MB), processing may be slow');
        }

        try {
            const parsed = JSON.parse(trimmed);
            const minified = JSON.stringify(parsed);
            return { success: true, data: minified, message: 'Minified ✓' };
        } catch (e) {
            return { success: false, message: `Error: ${this._formatError(e)}` };
        }
    },

    /**
     * Validate JSON and report status.
     * @param {string} input
     * @returns {{success: boolean, data?: string, message: string}}
     */
    validate(input) {
        const trimmed = input.trim();
        if (!trimmed) {
            return { success: false, message: 'Input is empty' };
        }

        if (trimmed.length > 5 * 1024 * 1024) {
            console.warn('JSON Tools: Large input (>5MB), processing may be slow');
        }

        try {
            JSON.parse(trimmed);
            return { success: true, data: '', message: 'Valid JSON ✓' };
        } catch (e) {
            return { success: false, message: `Invalid: ${this._formatError(e)}` };
        }
    },

    /**
     * Extract useful info from SyntaxError.
     * @param {Error} e
     * @returns {string}
     */
    _formatError(e) {
        return e.message;
    }
};
