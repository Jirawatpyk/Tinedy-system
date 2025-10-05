import '@testing-library/jest-dom';
import { afterEach, beforeEach, vi } from 'vitest';
import React from 'react';

// Set IS_REACT_ACT_ENVIRONMENT for React 18/19 compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Polyfill React.act for React 19 (act moved to react package in React 19)
// We need to add it back to React object for react-dom-test-utils compatibility
import * as ReactActual from 'react';
if (!React.act && 'act' in ReactActual) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (React as any).act = (ReactActual as any).act;
}

// Suppress React.act warnings during tests
const originalError = console.error;
beforeEach(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('ReactDOMTestUtils.act')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterEach(() => {
  console.error = originalError;
  vi.clearAllMocks();
});

// Set up test environment variables for Firebase Admin SDK
process.env.FIREBASE_ADMIN_PROJECT_ID = 'test-project-id';
process.env.FIREBASE_ADMIN_CLIENT_EMAIL = 'test@test-project.iam.gserviceaccount.com';
process.env.FIREBASE_ADMIN_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDU7VKOsKyOvLG1
SN0DKPvLvFCzRKj4Q7OmKUjvKh6UYX0hfCxUDPMtKaF3F3wSiCmXr6LmTmP7cSPH
hXaQPcWFvVKpJqKvMqYvIJLqFRqVh6mKvPpXCMJ+RqKvKpJqKvMqYvIJLqFRqVh6
mKvPpXCMJ+RqKvKpJqKvMqYvIJLqFRqVh6mKvPpXCMJ+RqKvKpJqKvMqYvIJLqFR
qVh6mKvPpXCMJ+RqKvKpJqKvMqYvIJLqFRqVh6mKvPpXCMJ+RqKvKpJqKvMqYvIJ
LqFRqVh6mKvPpXCMJ+RqKvKpJqKvMqYvIJLqFRqVh6mKvPpXCMJ+RqKvAgMBAAEC
ggEAQpDKvNqXvKvOvLG1SN0DKPvLvFCzRKj4Q7OmKUjvKh6UYX0hfCxUDPMtKaF3
F3wSiCmXr6LmTmP7cSPHhXaQPcWFvVKpJqKvMqYvIJLqFRqVh6mKvPpXCMJ+RqKv
KpJqKvMqYvIJLqFRqVh6mKvPpXCMJ+RqKvKpJqKvMqYvIJLqFRqVh6mKvPpXCMJ+
RqKvKpJqKvMqYvIJLqFRqVh6mKvPpXCMJ+RqKvKpJqKvMqYvIJLqFRqVh6mKvPpX
CMJ+RqKvKpJqKvMqYvIJLqFRqVh6mKvPpXCMJ+RqKvKpJqKvMqYvIJLqFRqVh6mK
vPpXCMJ+RqKvQKBgQD1K1vKvOvLG1SN0DKPvLvFCzRKj4Q7OmKUjvKh6UYX0hfCx
UDPMtKaF3F3wSiCmXr6LmTmP7cSPHhXaQPcWFvVKpJqKvMqYvIJLqFRqVh6mKvPp
XCMJ+RqKvKpJqKvMqYvIJLqFRqVh6mKvPpXCMJ+RqKvKpJqKvMqYvIJLqFRqVh6m
KvPpXCMJ+RqKvQKBgQDeMK1vKvOvLG1SN0DKPvLvFCzRKj4Q7OmKUjvKh6UYX0hf
CxUDPMtKaF3F3wSiCmXr6LmTmP7cSPHhXaQPcWFvVKpJqKvMqYvIJLqFRqVh6mKv
PpXCMJ+RqKvKpJqKvMqYvIJLqFRqVh6mKvPpXCMJ+RqKvKpJqKvMqYvIJLqFRqVh
6mKvPpXCMJ+RqKvQKBgFI1vKvOvLG1SN0DKPvLvFCzRKj4Q7OmKUjvKh6UYX0hfC
xUDPMtKaF3F3wSiCmXr6LmTmP7cSPHhXaQPcWFvVKpJqKvMqYvIJLqFRqVh6mKvP
pXCMJ+RqKvKpJqKvMqYvIJLqFRqVh6mKvPpXCMJ+RqKvKpJqKvMqYvIJLqFRqVh6
mKvPpXCMJ+RqKvAoGAC1vKvOvLG1SN0DKPvLvFCzRKj4Q7OmKUjvKh6UYX0hfCxU
DPMtKaF3F3wSiCmXr6LmTmP7cSPHhXaQPcWFvVKpJqKvMqYvIJLqFRqVh6mKvPpX
CMJ+RqKvKpJqKvMqYvIJLqFRqVh6mKvPpXCMJ+RqKvKpJqKvMqYvIJLqFRqVh6mK
vPpXCMJ+RqKvECgYEA0K1vKvOvLG1SN0DKPvLvFCzRKj4Q7OmKUjvKh6UYX0hfCx
UDPMtKaF3F3wSiCmXr6LmTmP7cSPHhXaQPcWFvVKpJqKvMqYvIJLqFRqVh6mKvPp
XCMJ+RqKvKpJqKvMqYvIJLqFRqVh6mKvPpXCMJ+RqKvKpJqKvMqYvIJLqFRqVh6m
KvPpXCMJ+RqKv=
-----END PRIVATE KEY-----`;

// Mock global fetch
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).fetch = vi.fn();

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// Mock Next.js server components (for API route tests)
vi.mock('next/server', () => ({
  NextRequest: class MockNextRequest {
    url: string;
    method: string;
    headers: Map<string, string>;
    _body: unknown;

    constructor(url: string, init?: { method?: string; headers?: Record<string, string>; body?: unknown }) {
      this.url = url;
      this.method = init?.method || 'GET';
      this.headers = new Map(Object.entries(init?.headers || {}));
      this._body = init?.body;
    }
    async json() {
      if (typeof this._body === 'string') {
        return JSON.parse(this._body);
      }
      return this._body;
    }
  },
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      status: init?.status || 200,
      ok: (init?.status || 200) >= 200 && (init?.status || 200) < 300,
      json: async () => data,
      headers: new Map(),
    }),
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Search: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'search-icon', className }),
  X: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'x-icon', className }),
  ChevronDown: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'chevron-down-icon', className }),
  ChevronUp: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'chevron-up-icon', className }),
  Calendar: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'calendar-icon', className }),
  Clock: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'clock-icon', className }),
  User: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'user-icon', className }),
  Users: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'users-icon', className }),
  MapPin: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'map-pin-icon', className }),
  Phone: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'phone-icon', className }),
  Mail: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'mail-icon', className }),
  Check: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'check-icon', className }),
  AlertCircle: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'alert-circle-icon', className }),
  Loader2: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'loader2-icon', className }),
  SearchX: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'search-x-icon', className }),
  ArrowUp: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'arrow-up-icon', className }),
  ArrowDown: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'arrow-down-icon', className }),
  ArrowUpDown: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'arrow-up-down-icon', className }),
  ChevronLeft: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'chevron-left-icon', className }),
  ChevronRight: ({ className }: { className?: string }) => React.createElement('svg', { 'data-testid': 'chevron-right-icon', className }),
}));

// Mock use-debounce
vi.mock('use-debounce', () => ({
  useDebouncedCallback: (callback: unknown) => callback,
}));
