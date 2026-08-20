import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Education from '../app/education/page'

describe('Education Page', () => {
    it('renders without runtime crashing', () => {
        // This will catch syntax errors like unescaped quotes during transpilation and execution
        const { container } = render(<Education />)

        // We can confidently assert it rendered something
        expect(container).toBeTruthy()
    })

    it('renders the education and certification sections', () => {
        render(<Education />)

        expect(screen.getByRole('heading', { level: 1, name: 'Education' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 2, name: 'Certifications & Courses' })).toBeInTheDocument()
    })
})
