import { describe, expect, it, vi, beforeEach } from 'vitest'

/*
 * The invariant under test: an AudioContext created before a gesture starts
 * suspended, and a suspended context's clock does not advance — so anything
 * scheduled against it queues at t=0 and fires all at once on resume. The
 * engine must schedule nothing until the context is genuinely running.
 */

type FakeNode = { connect: (target: unknown) => unknown; [key: string]: unknown }

function makeParam() {
    return {
        value: 0,
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        setTargetAtTime: vi.fn(),
        cancelScheduledValues: vi.fn(),
    }
}

function node(extra: Record<string, unknown> = {}): FakeNode {
    return { connect: vi.fn(function (this: unknown, target: unknown) { return target }), ...extra }
}

class FakeContext {
    state: 'suspended' | 'running' = 'suspended'
    currentTime = 0
    destination = node()
    sampleRate = 48000
    /** Every oscillator started, so the test can count scheduled sound. */
    started: string[] = []

    resume = vi.fn(async () => {
        this.state = 'running'
    })
    createGain = vi.fn(() => node({ gain: makeParam() }))
    createOscillator = vi.fn(() => {
        const self = this
        return node({
            type: '',
            frequency: makeParam(),
            start: vi.fn(() => self.started.push('osc')),
            stop: vi.fn(),
        })
    })
    createBiquadFilter = vi.fn(() => node({ type: '', frequency: makeParam(), Q: makeParam() }))
    createBufferSource = vi.fn(() => {
        const self = this
        return node({
            buffer: null,
            loop: false,
            start: vi.fn(() => self.started.push('buffer')),
            stop: vi.fn(),
        })
    })
    createBuffer = vi.fn(() => ({ getChannelData: () => new Float32Array(8) }))
    close = vi.fn(async () => {})
}

let context: FakeContext

async function freshEngine() {
    vi.resetModules()
    context = new FakeContext()
    // A class, not an arrow function: the engine calls `new` on this.
    // @ts-expect-error - installing a stand-in for the browser constructor
    window.AudioContext = class {
        constructor() {
            return context
        }
    }
    const mod = await import('../lib/audio')
    return mod.audio
}

describe('audio engine', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('schedules nothing before the first gesture', async () => {
        const audio = await freshEngine()

        audio.surge()
        audio.click()
        audio.key()
        audio.open()

        expect(context.started).toHaveLength(0)
    })

    it('starts the ambient bed only once the context is running', async () => {
        const audio = await freshEngine()
        audio.armAutoStart()

        expect(context.started).toHaveLength(0)

        window.dispatchEvent(new Event('pointerdown'))
        await vi.waitFor(() => expect(context.state).toBe('running'))
        await vi.waitFor(() => expect(context.started.length).toBeGreaterThan(0))
    })

    it('makes no sound while muted, even after unlocking', async () => {
        const audio = await freshEngine()
        audio.armAutoStart()
        window.dispatchEvent(new Event('pointerdown'))
        await vi.waitFor(() => expect(context.state).toBe('running'))

        audio.setEnabled(false)
        const before = context.started.length
        audio.click()
        audio.open()

        expect(context.started).toHaveLength(before)
    })

    it('runs an unlock callback immediately once already unlocked', async () => {
        const audio = await freshEngine()
        audio.armAutoStart()
        window.dispatchEvent(new Event('pointerdown'))
        await vi.waitFor(() => expect(context.state).toBe('running'))

        const callback = vi.fn()
        audio.onUnlock(callback)

        expect(callback).toHaveBeenCalledOnce()
    })

    it('defers an unlock callback registered before the gesture', async () => {
        const audio = await freshEngine()
        const callback = vi.fn()

        audio.onUnlock(callback)
        expect(callback).not.toHaveBeenCalled()

        audio.armAutoStart()
        window.dispatchEvent(new Event('pointerdown'))
        await vi.waitFor(() => expect(callback).toHaveBeenCalledOnce())
    })
})
