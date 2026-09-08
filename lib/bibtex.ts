import type { Publication } from '@/lib/publications';

/*
 * A BibTeX entry per paper. Researchers who cite you want this and nothing
 * else from a portfolio; generating it from the same data the page renders
 * keeps the two from drifting apart.
 */

/** `hossain2026predictive` — first author surname, year, first title word. */
function citeKey(publication: Publication): string {
  const surname = publication.authors.split(',')[0].trim().split(/\s+/).pop() ?? 'anon';
  const year = publication.date.match(/\d{4}/)?.[0] ?? 'n.d.';
  const word = publication.title
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .find((candidate) => candidate.length > 3) ?? 'paper';
  return `${surname.toLowerCase()}${year}${word}`;
}

export function toBibTeX(publication: Publication): string {
  const year = publication.date.match(/\d{4}/)?.[0] ?? '';
  // BibTeX splits author lists on " and ", not commas.
  const authors = publication.authors.split(',').map((name) => name.trim()).join(' and ');

  const fields: [string, string][] = [
    ['author', authors],
    // Braces preserve the capitalisation of Starlink, LEO, RandomForest.
    ['title', `{${publication.title}}`],
    ['booktitle', publication.venue],
    ['year', year],
  ];
  if (publication.location) fields.push(['address', publication.location]);
  fields.push(['doi', publication.doi]);
  fields.push(['url', publication.link]);

  const body = fields.map(([key, value]) => `  ${key} = {${value}}`).join(',\n');
  return `@inproceedings{${citeKey(publication)},\n${body}\n}`;
}
