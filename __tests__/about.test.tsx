import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import About from '../app/about/page'

describe('About Page', () => {
    it('renders without runtime crashing', () => {
        // This will catch syntax errors like unescaped quotes during transpilation and execution
        const { container } = render(<About />)

        // We can confidently assert it rendered something
        expect(container).toBeTruthy()
    })
})
