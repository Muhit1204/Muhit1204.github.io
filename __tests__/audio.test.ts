import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { AudioEngine } from '../lib/audio'

class FakeContext {
    state = 'suspended'
    currentTime = 10
    destination = {}
    started: string[] = []
    nodes: { stop: ReturnType<typeof vi.fn> }[] = []
    resume = vi.fn(async () => { this.state = 'running' })
    decodeAudioData = vi.fn(async (data: ArrayBuffer) => ({ duration: 0.06, label: new TextDecoder().decode(data) }))
    createGain = vi.fn(() => ({ gain: { value: 0, setValueAtTime: vi.fn() }, connect: (target: unknown) => target, disconnect: vi.fn() }))
    createBufferSource = vi.fn(() => {
        const voice = {
            buffer: null as { label: string } | null,
            playbackRate: { value: 1 },
            connect: (target: unknown) => target,
            disconnect: vi.fn(),
            onended: null as (() => void) | null,
            start: vi.fn(() => { this.started.push(voice.buffer!.label) }),
            stop: vi.fn(() => { voice.onended?.() }),
        }
        this.nodes.push(voice)
        return voice
    })
    close = vi.fn(async () => {})
}
let engine: AudioEngine
let context: FakeContext
let constructed: number
let fetcher: ReturnType<typeof vi.fn>

function key(type: 'keydown' | 'keyup', code = 'KeyA', repeat = false) {
    window.dispatchEvent(new KeyboardEvent(type, { code, key: code, repeat }))
}
function pointer(type: 'pointerdown' | 'pointerup', button = 0, pointerType = 'mouse') {
    const event = new MouseEvent(type, { button })
    Object.defineProperties(event, { pointerId: { value: 1 }, pointerType: { value: pointerType } })
    window.dispatchEvent(event)
}

beforeEach(() => {
    context = new FakeContext()
    engine = new AudioEngine()
    constructed = 0
    vi.stubGlobal('AudioContext', class { constructor() { constructed++; return context } })
    fetcher = vi.fn(async (url: string) => ({ ok: true, arrayBuffer: async () => new TextEncoder().encode(url).buffer }))
    vi.stubGlobal('fetch', fetcher)
})
afterEach(() => { engine.dispose(); vi.unstubAllGlobals() })

describe('sample audio engine', () => {
    it('stays silent and downloads nothing until explicitly enabled', () => {
        pointer('pointerdown'); key('keydown')
        engine.click(); engine.key(); engine.open(); engine.close(); engine.surge(); engine.tick()
        expect(engine.enabled).toBe(false)
        expect(constructed).toBe(0)
        expect(fetcher).not.toHaveBeenCalled()
        expect(context.started).toHaveLength(0)
    })
    it('waits for a running context and drops input received before readiness', async () => {
        let resume!: () => void
        context.resume.mockImplementation(() => new Promise<void>(resolve => { resume = () => { context.state = 'running'; resolve() } }))
        const enabling = engine.setEnabled(true)
        pointer('pointerdown'); key('keydown')
        expect(fetcher).not.toHaveBeenCalled()
        expect(context.decodeAudioData).not.toHaveBeenCalled()
        resume(); await enabling
        expect(fetcher).toHaveBeenCalledTimes(24)
        expect(context.started).toHaveLength(0)
        key('keyup')
        expect(context.started).toHaveLength(0)
    })
    it('plays down and up once per key, ignoring auto-repeat', async () => {
        await engine.setEnabled(true)
        key('keydown'); key('keydown', 'KeyA', true); key('keyup')
        expect(context.started).toHaveLength(2)
        expect(context.started[0]).toMatch(/key-down-[123]\.wav$/)
        expect(context.started[1]).toMatch(/key-up-[123]\.wav$/)
    })
    it('uses space, shift and mouse event groups while ignoring touch input', async () => {
        await engine.setEnabled(true)
        key('keydown', 'Space'); key('keyup', 'Space')
        key('keydown', 'ShiftLeft'); key('keyup', 'ShiftLeft')
        pointer('pointerdown', 2); pointer('pointerup', 2)
        pointer('pointerdown', 0, 'touch'); pointer('pointerup', 0, 'touch')
        expect(context.started).toHaveLength(6)
        expect(context.started[0]).toMatch(/space-down/)
        expect(context.started[2]).toMatch(/shift-down/)
        expect(context.started[4]).toMatch(/mouse-down/)
        expect(context.started[5]).toMatch(/mouse-up/)
    })
    it('mutes active voices, removes listeners and reuses decoded samples on re-enable', async () => {
        await engine.setEnabled(true)
        pointer('pointerdown')
        const voice = context.nodes[0]
        await engine.setEnabled(false)
        expect(voice.stop).toHaveBeenCalledOnce()
        pointer('pointerup'); key('keydown')
        expect(context.started).toHaveLength(1)
        await engine.setEnabled(true)
        key('keydown'); key('keyup')
        expect(context.started).toHaveLength(3)
        expect(fetcher).toHaveBeenCalledTimes(24)
        expect(context.decodeAudioData).toHaveBeenCalledTimes(24)
        expect(constructed).toBe(1)
    })
    it('does not re-enable after being muted during an in-flight sample load', async () => {
        let release!: (value: { ok: boolean; arrayBuffer: () => Promise<ArrayBuffer> }) => void
        fetcher.mockImplementationOnce(() => new Promise(resolve => { release = resolve }))
        const enabling = engine.setEnabled(true)
        await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(24))
        await engine.setEnabled(false)
        release({ ok: true, arrayBuffer: async () => new ArrayBuffer(4) })
        await enabling
        key('keydown'); pointer('pointerdown')
        expect(engine.enabled).toBe(false)
        expect(engine.status).toBe('off')
        expect(context.started).toHaveLength(0)
    })
    it('never schedules input while the context is suspended', async () => {
        await engine.setEnabled(true)
        context.state = 'suspended'
        key('keydown'); pointer('pointerdown')
        context.state = 'running'
        key('keyup'); pointer('pointerup')
        expect(context.started).toHaveLength(0)
    })
    it('reports a failed download and allows an explicit retry', async () => {
        fetcher.mockRejectedValueOnce(new Error('offline'))
        await engine.setEnabled(true)
        expect(engine.status).toBe('error')
        expect(engine.enabled).toBe(false)
        key('keydown')
        expect(context.started).toHaveLength(0)
        await engine.setEnabled(true)
        expect(engine.status).toBe('ready')
        key('keydown')
        expect(context.started).toHaveLength(1)
    })
    it('runs boot compatibility callbacks only after an explicit unlock', async () => {
        const callback = vi.fn()
        engine.onUnlock(callback)
        key('keydown'); pointer('pointerdown')
        expect(callback).not.toHaveBeenCalled()
        await engine.setEnabled(true)
        expect(callback).toHaveBeenCalledOnce()
        expect(context.started).toHaveLength(0)
    })
})
