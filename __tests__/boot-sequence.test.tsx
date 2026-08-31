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
        sessionStorage.clear()
        mockReducedMotion(false)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('plays on a fresh session and exposes a skip control', async () => {
        render(<BootSequence />)

        expect(await screen.findByRole('button', { name: /skip animation/i })).toBeInTheDocument()
    })

    it('dismisses on skip and records the session guard', async () => {
        render(<BootSequence />)

        const skip = await screen.findByRole('button', { name: /skip animation/i })
        fireEvent.click(skip)

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /skip animation/i })).not.toBeInTheDocument()
        })
        expect(sessionStorage.getItem('boot-sequence-played')).toBe('1')
    })

    it('dismisses on Escape', async () => {
        render(<BootSequence />)

        await screen.findByRole('button', { name: /skip animation/i })
        fireEvent.keyDown(window, { key: 'Escape' })

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /skip animation/i })).not.toBeInTheDocument()
        })
    })

    it('does not replay once the session guard is set', () => {
        sessionStorage.setItem('boot-sequence-played', '1')

        render(<BootSequence />)

        expect(screen.queryByRole('button', { name: /skip animation/i })).not.toBeInTheDocument()
    })

    it('renders nothing when the visitor prefers reduced motion', () => {
        mockReducedMotion(true)

        render(<BootSequence />)

        expect(screen.queryByRole('button', { name: /skip animation/i })).not.toBeInTheDocument()
    })
})
