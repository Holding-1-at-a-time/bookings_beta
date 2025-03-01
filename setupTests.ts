import { Any } from 'next-sanity';
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import 'jest-extended';

// Mock console
global.console.error = jest.fn();
global.console.warn = jest.fn();


// Mock localStorage and sessionStorage
const storageMock = () => {
    let store: { [key: string]: string } = {};
    return {
        getItem(key: string) {
            return store[key] || null;
        },
        setItem(key: string, value: string) {
            store[key] = String(value); // Store as string
        },
        removeItem(key: string) {
            delete store[key];
        },
        clear() {
            store = {};
        },
    };
};

Object.defineProperty(window, 'localStorage', { value: storageMock() });
Object.defineProperty(window, 'sessionStorage', { value: storageMock() });

// Suggestion 1: Mock sessionStorage
const sessionStorageMock = (function () {
    let store: { [key: string]: string } = {};
    return {
        /**
         * Retrieve a value from sessionStorage.
         *
         * @param {string} key - The key to retrieve the value for.
         * @returns {string|null} The value associated with the key or null if no value is set.
         */
        getItem(key: string) {
            return store[key] || null;
        },
        /**
         * Set a value in sessionStorage.
         *
         * @param {string} key - The key to set the value for.
         * @param {string} value - The value to set.
         */
        setItem(key: string, value: string) {
            store[key] = value.toString();
        },
        /**
         * Remove a value from sessionStorage.
         *
         * @param {string} key - The key to remove the value for.
         */
        removeItem(key: string) {
            delete store[key];
        },
        /**
         * Clear all values from sessionStorage.
         */
        clear() {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
// Mock navigator
Object.defineProperty(window, 'navigator', {
    value: {
        userAgent: 'Mocked User Agent',
        language: 'en-US',
        platform: 'Mocked Platform',
    },
    writable: true, // Make it re-writable
});

// Mock screen
Object.defineProperty(window, 'screen', {
    value: {
        width: 1920,
        height: 1080,
        availWidth: 1920,
        availHeight: 1080,
    },
    writable: true, // Make it re-writable
});

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
    get() { return this._cookie || ''; },
    set(value) { this._cookie = value; },
    configurable: true,
});

// Mock window.location and window.history
Object.defineProperty(window, 'location', {
    value: {
        href: '',
        assign: jest.fn(),
        reload: jest.fn(),
        replace: jest.fn(),
    },
    writable: true, configurable: true,
});

// Mock document and window objects (e.g., for cookies)
Object.defineProperty(document, 'cookie', {
    get() {
        return this._cookie || '';
    },
    set(value) {
        this._cookie = value;
    },
    configurable: true,
});

const mockLocation = {
    href: '',
    assign: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
};

Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
});

const mockHistory = {
    state: {},

    pushState: jest.fn((state: Any, title: string, url: string) => {
        mockHistory.state = state;
        window.location.href = url; // Update location on pushState
    }),
    replaceState: jest.fn((state: Any, title: string, url: string) => {
        mockHistory.state = state;
        window.location.href = url; // Update location on replaceState
    }),
    go: jest.fn(),
};

Object.defineProperty(window, 'history', {
    value: mockHistory,
    writable: true,
});

Object.defineProperty(window, 'history', {
    value: {
        /**
         * The state of the current page.
         */
        state: {},
        /**
         * Push a new state to the history.
         *
         * @param {unknown} state - The new state to push.
         * @param {string} title - The title of the new state.
         * @param {string} url - The url of the new state.
         */
        pushState(state: unknown, title: string, url: string) {
            this.state = state;
            this.replaceState(state, title, url);
        },
        /**
         * Replace the current state with a new one.
         *
         * @param {unknown} state - The new state to replace the current one.
         * @param {string} title - The title of the new state.
         * @param {string} url - The url of the new state.
         */
        replaceState(state: unknown, title: string, url: string) {
            this.state = state;
            Object.defineProperty(window, 'location', {
                value: {
                    href: url,
                    assign: jest.fn(),
                    reload: jest.fn(),
                },
                writable: true,
            });
        },
        /**
         * Go back or forward in the history.
         *
         * @param {string|number} delta - The number of steps to go back or forward.
         */
        go(delta: string | number) {
            if (delta === -1) {
                Object.defineProperty(window, 'location', {
                    value: {
                        href: '',
                        assign: jest.fn(),
                        reload: jest.fn(),
                    },
                    writable: true,
                });
            }
        },
    },
    configurable: true,
});

