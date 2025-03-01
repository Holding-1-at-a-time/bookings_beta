// testUtils/browserMocks.ts
import { jest } from '@jest/globals';

export const createStorageMock = () => {
    let store: { [key: string]: string } = {};
    return {
        getItem(key: string) { return store[key] || null; },
        setItem(key: string, value: string) { store[key] = String(value); },
        removeItem(key: string) { delete store[key]; },
        clear() { store = {}; },
    };
};

export const setupBrowserMocks = () => {
    // Storage mock (used for both local and session storage)
    Object.defineProperty(window, 'localStorage', { value: createStorageMock() });
    Object.defineProperty(window, 'sessionStorage', { value: createStorageMock() });

    // Cookie mock (only define once)
    Object.defineProperty(document, 'cookie', {
        get() { return this._cookie || ''; },
        set(value) { this._cookie = value; },
        configurable: true,
    });

    // Location and history mock
    const mockLocation = {
        href: '',
        assign: jest.fn(),
        reload: jest.fn(),
        replace: jest.fn(),
    };

    Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
        configurable: true,
    });

    const mockHistory = {
        state: {},
        pushState: jest.fn((state: any, title: string, url: string) => {
            mockHistory.state = state;
            mockLocation.href = url;
        }),
        replaceState: jest.fn((state: any, title: string, url: string) => {
            mockHistory.state = state;
            mockLocation.href = url;
        }),
        go: jest.fn(),
    };

    Object.defineProperty(window, 'history', {
        value: mockHistory,
        writable: true,
        configurable: true,
    });
};