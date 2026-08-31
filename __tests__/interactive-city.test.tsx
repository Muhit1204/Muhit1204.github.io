import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InteractiveNetworkMap, {
  CITY_DESTINATIONS,
  CITY_ROAD_SAFE_CORRIDORS,
  CITY_TRAFFIC_ROUTES,
  type CityPoint,
} from '@/components/InteractiveNetworkMap';

const expectedDestinations = [
  ['Publications', '/publications'],
  ['Research Projects', '/projects'],
  ['Experience', '/experience'],
  ['Contact', '/contact'],
  ['Education', '/education'],
] as const;

function pointInsidePolygon(point: CityPoint, polygon: readonly CityPoint[]) {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const a = polygon[index];
    const b = polygon[previous];
    const intersects =
      a.y > point.y !== b.y > point.y &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

describe('InteractiveNetworkMap', () => {
  it('renders exactly five accessible destination links with their current routes', () => {
    render(<InteractiveNetworkMap />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(expectedDestinations.length);
    expect(CITY_DESTINATIONS).toHaveLength(expectedDestinations.length);

    for (const [label, href] of expectedDestinations) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', href);
      expect(CITY_DESTINATIONS).toContainEqual(expect.objectContaining({ label, href }));
    }
  });

  it('has no icon pins, unnamed controls, or interactive Gallery destination', () => {
    const { container } = render(<InteractiveNetworkMap />);

    expect(container.querySelector('.lucide, [data-lucide]')).not.toBeInTheDocument();
    expect(container.querySelector('button, [role="button"]')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Scrollable interactive city panorama')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /gallery/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/^gallery$/i)).not.toBeInTheDocument();
    expect(container.querySelector('a[href="/gallery"]')).not.toBeInTheDocument();
    expect(CITY_DESTINATIONS.some(({ href }) => href === '/gallery')).toBe(false);
  });

  it('provides the exact mobile guidance and lazy-loads the city base', () => {
    render(<InteractiveNetworkMap />);

    expect(
      screen.getByText('Swipe to explore. For the full immersive city experience, visit on desktop.'),
    ).toBeInTheDocument();

    const cityImage = screen.getByRole('img', { name: /illustrated waterfront portfolio city/i });
    expect(cityImage).toHaveAttribute('loading', 'lazy');
    expect(cityImage).not.toHaveAttribute('fetchpriority', 'high');
  });

  it('keeps every sampled vehicle footprint inside its matching road-safe corridor', () => {
    expect(CITY_TRAFFIC_ROUTES).toHaveLength(8);
    expect(CITY_TRAFFIC_ROUTES.filter(({ desktopOnly }) => !desktopOnly)).toHaveLength(1);

    for (const route of CITY_TRAFFIC_ROUTES) {
      const corridor = CITY_ROAD_SAFE_CORRIDORS.find(({ id }) => id === route.corridorId);
      expect(corridor).toBeDefined();

      for (const progress of [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]) {
        const center = {
          x: route.from.x + (route.to.x - route.from.x) * progress,
          y: route.from.y + (route.to.y - route.from.y) * progress,
        };
        const halfWidth = route.footprint.width / 2;
        const halfHeight = route.footprint.height / 2;
        const footprintCorners = [
          { x: center.x - halfWidth, y: center.y - halfHeight },
          { x: center.x + halfWidth, y: center.y - halfHeight },
          { x: center.x + halfWidth, y: center.y + halfHeight },
          { x: center.x - halfWidth, y: center.y + halfHeight },
        ];

        for (const corner of footprintCorners) {
          expect(pointInsidePolygon(corner, corridor!.polygon)).toBe(true);
        }
      }
    }
  });
});
