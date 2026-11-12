export const LEGACY_ROUTES = {
  about: 'about',
  experience: 'experience',
  publications: 'publications',
  projects: 'projects',
  contact: 'contact',
} as const;

export type LegacyRoute = keyof typeof LEGACY_ROUTES;

export function legacyDestination(route: LegacyRoute): string {
  return '/desktop#' + LEGACY_ROUTES[route];
}
