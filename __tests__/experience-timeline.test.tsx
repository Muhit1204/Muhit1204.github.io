import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import ExperienceTimeline from '../components/ExperienceTimeline'
import type { Experience } from '../lib/work'

const experiences: Experience[] = [
    {
        title: 'Graduate Research Assistant',
        company: 'Lamar University',
        location: 'Beaumont, United States',
        date: 'Oct 2024 – Present',
        description: ['Lead bullet.', 'Second bullet.', 'Third bullet.'],
    },
    {
        title: 'Web Developer',
        company: 'RPSI Limited',
        location: 'Dhaka, Bangladesh',
        date: 'Sep 2021 – Jan 2023',
        description: ['Only bullet.'],
    },
]

describe('ExperienceTimeline', () => {
    it('renders a node per role', () => {
        render(<ExperienceTimeline experiences={experiences} />)

        expect(screen.getByText('Lamar University')).toBeInTheDocument()
        expect(screen.getByText('RPSI Limited')).toBeInTheDocument()
    })

    it('marks a role still running as active and a finished one as archived', () => {
        render(<ExperienceTimeline experiences={experiences} />)

        expect(screen.getByText('[ACTIVE]')).toBeInTheDocument()
        expect(screen.getByText('[ARCHIVED]')).toBeInTheDocument()
    })

    it('shows the lead bullet and collapses the rest', () => {
        render(<ExperienceTimeline experiences={experiences} />)

        expect(screen.getByText('Lead bullet.')).toBeInTheDocument()
        expect(screen.getByText('2 more')).toBeInTheDocument()
    })

    it('offers no disclosure when there is nothing to collapse', () => {
        render(<ExperienceTimeline experiences={[experiences[1]]} />)

        expect(screen.getByText('Only bullet.')).toBeInTheDocument()
        expect(screen.queryByText(/\d+ more/)).not.toBeInTheDocument()
    })
})
