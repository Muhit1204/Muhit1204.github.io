import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it, beforeEach } from 'vitest'
import NotFound from '../app/not-found'

/** The retired routes are in search results and bookmarks; they must land somewhere useful. */
function visit(path: string) {
    window.history.replaceState({}, '', path)
}

describe('NotFound', () => {
    beforeEach(() => {
        visit('/')
    })

    it('points a retired route at the anchor that replaced it', async () => {
        visit('/projects')

        render(<NotFound />)

        const link = await screen.findByRole('link', { name: '#projects' })
        expect(link).toHaveAttribute('href', '/#projects')
    })

    it('handles a trailing slash on a retired route', async () => {
        visit('/contact/')

        render(<NotFound />)

        expect(await screen.findByRole('link', { name: '#contact' })).toBeInTheDocument()
    })

    it('falls back to a general message for an unknown path', () => {
        visit('/nonsense')

        render(<NotFound />)

        expect(screen.getByText(/The site is one page now/)).toBeInTheDocument()
    })

    it('always offers a way back to every section', () => {
        visit('/nonsense')

        render(<NotFound />)

        for (const id of ['about', 'experience', 'publications', 'projects', 'contact']) {
            expect(screen.getByRole('link', { name: id })).toHaveAttribute('href', `/#${id}`)
        }
        expect(screen.getByRole('link', { name: 'cd ~' })).toHaveAttribute('href', '/')
    })
})
