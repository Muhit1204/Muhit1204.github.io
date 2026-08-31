import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../app/page'

describe('Home Page', () => {
    it('renders without runtime crashing', () => {
        // This will catch syntax errors like unescaped quotes during transpilation and execution
        const { container } = render(<Home />)

        expect(container).toBeTruthy()
    })

    it('renders every anchor section the navbar links to', () => {
        const { container } = render(<Home />)

        for (const id of ['about', 'research', 'work', 'publications', 'contact']) {
            expect(container.querySelector(`#${id}`)).not.toBeNull()
        }
    })

    it('renders the sections carried over from the multi-page site', () => {
        render(<Home />)

        expect(screen.getByRole('heading', { level: 2, name: 'Skills & Tools' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 2, name: 'News & Awards' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 2, name: 'Projects' })).toBeInTheDocument()
    })

    it('merges the AWS pitch into a single log entry rather than duplicating it', () => {
        render(<Home />)

        expect(
            screen.getAllByRole('heading', { name: /AWS AI Pitch Competition/ }),
        ).toHaveLength(1)
    })
})
