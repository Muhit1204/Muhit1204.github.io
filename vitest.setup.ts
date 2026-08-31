// jsdom does not implement IntersectionObserver, which motion's useInView (used by
// Counter and InteractiveNetworkMap on the home page) calls on mount. Stub it so
// page-level render tests can mount components that animate into view.
class IntersectionObserverStub implements IntersectionObserver {
    readonly root: Element | Document | null = null
    readonly rootMargin: string = ''
    readonly thresholds: ReadonlyArray<number> = []

    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
        return []
    }
}

if (!('IntersectionObserver' in globalThis)) {
    globalThis.IntersectionObserver =
        IntersectionObserverStub as unknown as typeof IntersectionObserver
}


if (typeof window.matchMedia !== 'function') {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }),
    })
}
