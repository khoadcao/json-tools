'use strict';

const Differ = {
    /**
     * Compare two JSON strings. Auto-formats both before diffing.
     * @param {string} left - Left JSON input
     * @param {string} right - Right JSON input
     * @param {string} viewMode - 'side-by-side' or 'inline'
     * @returns {{success: boolean, html?: string, message: string}}
     */
    compare(left, right, viewMode) {
        const trimLeft = left.trim();
        const trimRight = right.trim();

        if (!trimLeft && !trimRight) {
            return { success: false, message: 'Both inputs are empty' };
        }
        if (!trimLeft) {
            return { success: false, message: 'Left input is empty' };
        }
        if (!trimRight) {
            return { success: false, message: 'Right input is empty' };
        }

        // Auto-format both inputs for structural comparison
        const formattedLeft = this._tryFormat(trimLeft);
        if (!formattedLeft.success) {
            return { success: false, message: `Left: ${formattedLeft.message}` };
        }

        const formattedRight = this._tryFormat(trimRight);
        if (!formattedRight.success) {
            return { success: false, message: `Right: ${formattedRight.message}` };
        }

        // Check if identical
        if (formattedLeft.data === formattedRight.data) {
            return {
                success: true,
                html: '<div class="diff-line" style="padding:1rem;color:var(--success)">No differences found ✓</div>',
                message: 'Identical ✓'
            };
        }

        // Compute diff using jsdiff
        const changes = Diff.diffLines(formattedLeft.data, formattedRight.data);

        if (viewMode === 'side-by-side') {
            return {
                success: true,
                html: this._renderSideBySide(changes),
                message: `${this._countChanges(changes)} difference(s) found`
            };
        } else {
            return {
                success: true,
                html: this._renderInline(changes),
                message: `${this._countChanges(changes)} difference(s) found`
            };
        }
    },

    /**
     * Try to parse and format JSON for diff comparison.
     */
    _tryFormat(input) {
        try {
            const parsed = JSON.parse(input);
            return { success: true, data: JSON.stringify(parsed, null, 2) };
        } catch (e) {
            return { success: false, message: `Invalid JSON — ${e.message}` };
        }
    },

    /**
     * Render inline diff view.
     */
    _renderInline(changes) {
        let html = '<div class="diff-panel">';
        for (const change of changes) {
            const lines = change.value.split('\n');
            // Remove trailing empty string from split
            if (lines[lines.length - 1] === '') lines.pop();

            for (const line of lines) {
                const cls = change.added ? 'diff-line--added' : change.removed ? 'diff-line--removed' : '';
                const prefix = change.added ? '+ ' : change.removed ? '- ' : '  ';
                html += `<div class="diff-line ${cls}">${prefix}${this._escapeHtml(line)}</div>`;
            }
        }
        html += '</div>';
        return html;
    },

    /**
     * Render side-by-side diff view.
     */
    _renderSideBySide(changes) {
        let leftHtml = '';
        let rightHtml = '';

        for (const change of changes) {
            const lines = change.value.split('\n');
            if (lines[lines.length - 1] === '') lines.pop();

            for (const line of lines) {
                if (change.added) {
                    leftHtml += `<div class="diff-line">&nbsp;</div>`;
                    rightHtml += `<div class="diff-line diff-line--added">${this._escapeHtml(line)}</div>`;
                } else if (change.removed) {
                    leftHtml += `<div class="diff-line diff-line--removed">${this._escapeHtml(line)}</div>`;
                    rightHtml += `<div class="diff-line">&nbsp;</div>`;
                } else {
                    leftHtml += `<div class="diff-line">${this._escapeHtml(line)}</div>`;
                    rightHtml += `<div class="diff-line">${this._escapeHtml(line)}</div>`;
                }
            }
        }

        return `<div class="diff-result--side-by-side"><div class="diff-panel">${leftHtml}</div><div class="diff-panel">${rightHtml}</div></div>`;
    },

    /**
     * Count number of change blocks.
     */
    _countChanges(changes) {
        return changes.filter(c => c.added || c.removed).length;
    },

    /**
     * Escape HTML to prevent XSS.
     */
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};
