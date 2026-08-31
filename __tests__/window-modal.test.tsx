import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import WindowModal from '../components/WindowModal'

const props = {
    label: 'Summary Deck',
    title: 'UAS LNVA — summary deck',
    src: '/UAS_LNVA_Project_Closing_Summary.pdf',
    kind: 'pdf' as const,
}

describe('WindowModal', () => {
    it('stays closed until the trigger is used', () => {
        render(<WindowModal {...props} />)

        expect(screen.getByRole('button', { name: /summary deck/i })).toBeInTheDocument()
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('opens a labelled dialog', () => {
        render(<WindowModal {...props} />)

        fireEvent.click(screen.getByRole('button', { name: /summary deck/i }))

        expect(screen.getByRole('dialog', { name: props.title })).toBeInTheDocument()
    })

    it('closes on Escape', () => {
        render(<WindowModal {...props} />)

        fireEvent.click(screen.getByRole('button', { name: /summary deck/i }))
        fireEvent.keyDown(window, { key: 'Escape' })

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('closes on the close control', () => {
        render(<WindowModal {...props} />)

        fireEvent.click(screen.getByRole('button', { name: /summary deck/i }))
        fireEvent.click(screen.getByRole('button', { name: /close window/i }))

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('still offers the file outside the modal', () => {
        render(<WindowModal {...props} />)

        fireEvent.click(screen.getByRole('button', { name: /summary deck/i }))

        expect(screen.getByRole('link', { name: /open in tab/i })).toHaveAttribute('href', props.src)
    })
})
