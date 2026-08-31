import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import ScrambleText from '../components/ScrambleText'

describe('ScrambleText', () => {
    it('exposes the real text to assistive technology', () => {
        const { container } = render(<ScrambleText text="Graduate Research Assistant" />)

        // Before the observer fires, both spans hold the same string — the
        // guarantee under test is that the readable copy is never the noise.
        const readable = container.querySelector('.sr-only')
        expect(readable).toHaveTextContent('Graduate Research Assistant')
        expect(readable?.getAttribute('aria-hidden')).toBeNull()
    })

    it('hides the animating copy from the accessibility tree', () => {
        const { container } = render(<ScrambleText text="Projects" />)

        const decorative = container.querySelector('[aria-hidden="true"]')
        expect(decorative).not.toBeNull()

        const readable = container.querySelector('.sr-only')
        expect(readable).toHaveTextContent('Projects')
    })

    it('keeps a heading it is nested in readable', () => {
        render(
            <h2>
                <ScrambleText text="Publications" />
            </h2>,
        )

        expect(screen.getByRole('heading', { name: 'Publications' })).toBeInTheDocument()
    })
})
