import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import Desktop from '../components/desktop/Desktop'
import DesktopProvider from '../components/desktop/DesktopProvider'
import DesktopWindow from '../components/desktop/DesktopWindow'

function renderDesktop() {
    return render(
        <DesktopProvider>
            <Desktop>
                <DesktopWindow id="about" title="about.md">
                    <p>about body</p>
                    <a href="#projects">projects</a>
                </DesktopWindow>
                <DesktopWindow id="projects" title="projects/">
                    <p>projects body</p>
                </DesktopWindow>
            </Desktop>
        </DesktopProvider>,
    )
}

describe('Desktop', () => {
    it('keeps a closed window in the document so its content stays readable to crawlers', () => {
        const { container } = renderDesktop()

        expect(container.querySelector('#projects')).toHaveClass('hidden')
        expect(screen.getByText('projects body')).toBeInTheDocument()
    })

    it('lists a section in the taskbar or as an icon, never both', () => {
        const { container } = renderDesktop()

        const icons = container.querySelector('.desk-icons') as Element
        expect(icons.querySelector('a[href="#projects"]')).toBeNull()
        expect(icons.querySelector('a[href="#terminal"]')).not.toBeNull()
    })

    it('opens a window from any in-page link to its id', () => {
        const { container } = renderDesktop()

        fireEvent.click(container.querySelector('a[href="#projects"]') as Element)

        expect(container.querySelector('#projects')).not.toHaveClass('hidden')
    })

    it('closes a window from its title bar', () => {
        const { container } = renderDesktop()

        fireEvent.click(screen.getByRole('button', { name: 'Close about.md' }))

        expect(container.querySelector('#about')).toHaveClass('hidden')
    })
})
