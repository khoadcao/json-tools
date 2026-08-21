'use strict';

const App = {
    init() {
        this.initTheme();
        this.initTabs();
        this.initFormatActions();
        this.initDiffActions();
        this.initKeyboardShortcuts();
        this.initResponsiveDiffView();
    },

    // --- Theme ---
    initTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) {
            document.documentElement.setAttribute('data-theme', saved);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        }
        this.updateThemeIcon();
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
    },

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        this.updateThemeIcon();
    },

    updateThemeIcon() {
        const theme = document.documentElement.getAttribute('data-theme');
        document.getElementById('themeToggle').textContent = theme === 'dark' ? '☀️' : '🌙';
    },

    // --- Tabs ---
    initTabs() {
        document.querySelectorAll('.tabs__btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
    },

    switchTab(tabName) {
        document.querySelectorAll('.tabs__btn').forEach(btn => {
            btn.classList.toggle('tabs__btn--active', btn.dataset.tab === tabName);
        });
        document.querySelectorAll('.tab-content').forEach(section => {
            section.classList.toggle('tab-content--active', section.id === `tab-${tabName}`);
        });
    },

    // --- Format Actions ---
    initFormatActions() {
        document.getElementById('btnFormat').addEventListener('click', () => {
            const input = document.getElementById('formatInput').value;
            const result = Formatter.format(input);
            this.showFormatResult(result);
        });

        document.getElementById('btnMinify').addEventListener('click', () => {
            const input = document.getElementById('formatInput').value;
            const result = Formatter.minify(input);
            this.showFormatResult(result);
        });

        document.getElementById('btnValidate').addEventListener('click', () => {
            const input = document.getElementById('formatInput').value;
            const result = Formatter.validate(input);
            this.showFormatResult(result);
        });

        document.getElementById('btnClear').addEventListener('click', () => {
            document.getElementById('formatInput').value = '';
            document.getElementById('formatOutput').value = '';
            this.setStatus('formatStatus', '', '');
        });
    },

    showFormatResult(result) {
        const output = document.getElementById('formatOutput');
        if (result.success) {
            output.value = result.data || '';
            this.setStatus('formatStatus', result.message, 'success');
        } else {
            output.value = '';
            this.setStatus('formatStatus', result.message, 'error');
        }
    },

    // --- Diff Actions ---
    initDiffActions() {
        document.getElementById('btnCompare').addEventListener('click', () => this.runDiff());

        document.getElementById('btnSwap').addEventListener('click', () => {
            const left = document.getElementById('diffLeft');
            const right = document.getElementById('diffRight');
            const tmp = left.value;
            left.value = right.value;
            right.value = tmp;
        });

        document.getElementById('btnDiffClear').addEventListener('click', () => {
            document.getElementById('diffLeft').value = '';
            document.getElementById('diffRight').value = '';
            document.getElementById('diffResult').innerHTML = '';
            this.setStatus('diffStatus', '', '');
        });

        document.querySelectorAll('input[name="diffView"]').forEach(radio => {
            radio.addEventListener('change', () => {
                if (document.getElementById('diffResult').innerHTML) {
                    this.runDiff();
                }
            });
        });
    },

    runDiff() {
        const left = document.getElementById('diffLeft').value;
        const right = document.getElementById('diffRight').value;
        const viewMode = document.querySelector('input[name="diffView"]:checked').value;
        const result = Differ.compare(left, right, viewMode);
        if (result.success) {
            document.getElementById('diffResult').innerHTML = result.html;
            this.setStatus('diffStatus', result.message, 'success');
        } else {
            document.getElementById('diffResult').innerHTML = '';
            this.setStatus('diffStatus', result.message, 'error');
        }
    },

    // --- Keyboard Shortcuts ---
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                const activeTab = document.querySelector('.tab-content--active');
                if (activeTab.id === 'tab-format') {
                    document.getElementById('btnFormat').click();
                } else {
                    document.getElementById('btnCompare').click();
                }
            }
        });
    },

    // --- Responsive Diff View ---
    initResponsiveDiffView() {
        const mq = window.matchMedia('(max-width: 768px)');
        const handler = (e) => {
            if (e.matches) {
                const inlineRadio = document.querySelector('input[name="diffView"][value="inline"]');
                inlineRadio.checked = true;
            } else {
                const sideRadio = document.querySelector('input[name="diffView"][value="side-by-side"]');
                sideRadio.checked = true;
            }
        };
        mq.addEventListener('change', handler);
        handler(mq);
    },

    // --- Utility ---
    setStatus(elementId, message, type) {
        const el = document.getElementById(elementId);
        el.textContent = message;
        el.className = 'status' + (type ? ` status--${type}` : '');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
