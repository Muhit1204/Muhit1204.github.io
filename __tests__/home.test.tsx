import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import Home from '../app/desktop/page'

describe('Home Page', () => {
    it('renders without runtime crashing', () => {
        // This will catch syntax errors like unescaped quotes during transpilation and execution
        const { container } = render(<Home />)

        expect(container).toBeTruthy()
    })

    it('renders every anchor section the navbar links to', () => {
        const { container } = render(<Home />)

        for (const id of ['about', 'experience', 'projects', 'publications', 'contact']) {
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

    it('keeps skill names accessible alongside their decorative icons', () => {
        const { container } = render(<Home />)
        const skillsWindow = container.querySelector('#skills') as HTMLElement

        for (const name of ['Python', 'TypeScript', 'NumPy', 'NS-3', 'LangGraph', 'ICS/SCADA Security']) {
            expect(skillsWindow).toHaveTextContent(name)
        }
        expect(skillsWindow.querySelector('img[src="/icons/skills/python.svg"]')).toHaveAttribute('alt', '')
        expect(skillsWindow.querySelectorAll('ul li')).toHaveLength(52)
    })
})
