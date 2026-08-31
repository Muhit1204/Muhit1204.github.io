import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it, vi } from 'vitest'
import TerminalPrompt from '../components/TerminalPrompt'

/** Types a command into the prompt and presses Enter. */
function run(command: string) {
    const input = screen.getByLabelText(/terminal command input/i)
    fireEvent.change(input, { target: { value: command } })
    fireEvent.keyDown(input, { key: 'Enter' })
    return input
}

describe('TerminalPrompt', () => {
    it('lists the sections on ls', () => {
        render(<TerminalPrompt />)

        run('ls')

        expect(screen.getByText(/publications/)).toBeInTheDocument()
        expect(screen.getByText(/experience/)).toBeInTheDocument()
    })

    it('scrolls to a section on cd', () => {
        const scrollIntoView = vi.fn()
        const target = document.createElement('div')
        target.id = 'projects'
        target.scrollIntoView = scrollIntoView
        document.body.appendChild(target)

        render(<TerminalPrompt />)
        run('cd projects')

        expect(scrollIntoView).toHaveBeenCalled()
        target.remove()
    })

    it('reports an unknown section rather than scrolling nowhere', () => {
        render(<TerminalPrompt />)

        run('cd nonsense')

        expect(screen.getByText(/no such section: nonsense/)).toBeInTheDocument()
    })

    it('reports unknown commands', () => {
        render(<TerminalPrompt />)

        run('rm -rf /')

        expect(screen.getByText(/command not found/)).toBeInTheDocument()
    })

    it('clears the log on clear', () => {
        render(<TerminalPrompt />)

        run('whoami')
        expect(screen.getByText(/Doctor of Engineering student/)).toBeInTheDocument()

        run('clear')
        expect(screen.queryByText(/Doctor of Engineering student/)).not.toBeInTheDocument()
    })

    it('completes a command on Tab', () => {
        render(<TerminalPrompt />)

        const input = screen.getByLabelText(/terminal command input/i) as HTMLInputElement
        fireEvent.change(input, { target: { value: 'wh' } })
        fireEvent.keyDown(input, { key: 'Tab' })

        expect(input.value).toBe('whoami')
    })

    it('walks history with the up arrow', () => {
        render(<TerminalPrompt />)

        const input = run('whoami') as HTMLInputElement
        fireEvent.keyDown(input, { key: 'ArrowUp' })

        expect(input.value).toBe('whoami')
    })
})
