import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import TracedList from '../components/TracedList'

describe('TracedList', () => {
    it('renders every child', () => {
        render(
            <TracedList>
                <p>first</p>
                <p>second</p>
                <p>third</p>
            </TracedList>,
        )

        expect(screen.getByText('first')).toBeInTheDocument()
        expect(screen.getByText('second')).toBeInTheDocument()
        expect(screen.getByText('third')).toBeInTheDocument()
    })

    it('numbers each node', () => {
        const { container } = render(
            <TracedList>
                <p>a</p>
                <p>b</p>
            </TracedList>,
        )

        expect(container.textContent).toContain('01')
        expect(container.textContent).toContain('02')
    })

    it('shows a footer only when given one', () => {
        const { rerender, container } = render(
            <TracedList>
                <p>a</p>
            </TracedList>,
        )
        expect(container.textContent).not.toContain('route traced')

        rerender(
            <TracedList footer="route traced · 1 node">
                <p>a</p>
            </TracedList>,
        )
        expect(container.textContent).toContain('route traced · 1 node')
    })
})
