import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import BootSequence from '../components/BootSequence'

/** Overrides the setup file's always-false matchMedia for one test. */
function mockReducedMotion(reduced: boolean) {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
            matches: reduced && query.includes('prefers-reduced-motion'),
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

describe('BootSequence', () => {
    beforeEach(() => {
        mockReducedMotion(false)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('plays on every load and exposes a skip control', async () => {
        render(<BootSequence />)

        expect(await screen.findByRole('button', { name: /skip/i })).toBeInTheDocument()
    })

    it('dismisses on skip', async () => {
        render(<BootSequence />)

        const skip = await screen.findByRole('button', { name: /skip/i })
        fireEvent.click(skip)

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /skip/i })).not.toBeInTheDocument()
        })
    })

    it('dismisses on Escape', async () => {
        render(<BootSequence />)

        await screen.findByRole('button', { name: /skip/i })
        fireEvent.keyDown(window, { key: 'Escape' })

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /skip/i })).not.toBeInTheDocument()
        })
    })

    it('replays on a remount rather than remembering an earlier visit', async () => {
        const first = render(<BootSequence />)
        fireEvent.click(await screen.findByRole('button', { name: /skip/i }))
        first.unmount()

        render(<BootSequence />)

        expect(await screen.findByRole('button', { name: /skip/i })).toBeInTheDocument()
    })

    it('renders nothing when the visitor prefers reduced motion', () => {
        mockReducedMotion(true)

        render(<BootSequence />)

        expect(screen.queryByRole('button', { name: /skip/i })).not.toBeInTheDocument()
    })
})
