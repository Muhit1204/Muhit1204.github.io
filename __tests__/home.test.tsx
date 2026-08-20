import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../app/page'

describe('Home Page', () => {
    it('renders without runtime crashing', () => {
        // This will catch syntax errors like unescaped quotes during transpilation and execution
        const { container } = render(<Home />)

        expect(container).toBeTruthy()
    })

    it('renders the sections moved over from the old about page', () => {
        render(<Home />)

        expect(screen.getByRole('heading', { level: 2, name: 'Skills & Tools' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 2, name: 'Awards & Grants' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 2, name: 'Personal Hobbies' })).toBeInTheDocument()
    })
})
