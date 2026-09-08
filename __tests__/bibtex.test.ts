import { describe, expect, it } from 'vitest'
import { toBibTeX } from '../lib/bibtex'
import { publications } from '../lib/publications'

describe('toBibTeX', () => {
    const entry = toBibTeX(publications[0])

    it('emits a parsable inproceedings entry', () => {
        expect(entry.startsWith('@inproceedings{')).toBe(true)
        expect(entry.trimEnd().endsWith('}')).toBe(true)
        // Every field line but the last carries a trailing comma.
        const fields = entry.split('\n').slice(1, -1)
        fields.slice(0, -1).forEach((line) => expect(line.endsWith(',')).toBe(true))
    })

    it('separates authors with "and", not commas', () => {
        expect(entry).toContain('Md Muntasir Hossain and Xingya Liu')
        // The trailing comma is the field separator; the value itself must
        // have none, or BibTeX reads "Surname, Given" name parts.
        const authorLine = entry.split('\n').find((line) => line.includes('author')) ?? ''
        const value = authorLine.slice(authorLine.indexOf('{') + 1, authorLine.lastIndexOf('}'))
        expect(value).toBeTruthy()
        expect(value).not.toContain(',')
    })

    it('braces the title so capitalisation survives', () => {
        expect(entry).toContain('title = {{Predictive Model for Starlink Maritime Performance')
    })

    it('builds a key from surname, year and a title word', () => {
        expect(entry).toContain('@inproceedings{hossain2026predictive')
    })

    it('uses the authoritative IEEE URL and DOI mapping', () => {
        expect(publications[0]).toMatchObject({
            link: 'https://ieeexplore.ieee.org/document/11393745',
            doi: '10.1109/CCWC67433.2026.11393745',
        })
        expect(publications[1]).toMatchObject({
            link: 'https://ieeexplore.ieee.org/document/11395767',
            doi: '10.1109/ICAIC67076.2026.11395767',
        })
        expect(entry).toContain('doi = {10.1109/CCWC67433.2026.11393745}')
    })

    it('carries the venue, year and link', () => {
        expect(entry).toContain('booktitle = {2026 IEEE')
        expect(entry).toContain('year = {2026}')
        expect(entry).toContain(publications[0].link)
    })

    it('includes the address only when the paper has a location', () => {
        expect(toBibTeX(publications[0])).not.toContain('address')
        expect(toBibTeX(publications[1])).toContain('address = {University of Houston')
    })
})
