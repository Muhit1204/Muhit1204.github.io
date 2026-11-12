import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import HeroVisual from '../components/HeroVisual';
import DesktopProvider, { InDesktopContext, useDesktop } from '../components/desktop/DesktopProvider';

vi.mock('next/dynamic', () => ({ default: () => function Globe() { return <div data-testid="webgl-globe" />; } }));

function CloseGlobe() {
  const desktop = useDesktop();
  return <button onClick={() => desktop?.close('globe')}>Close globe</button>;
}

afterEach(() => vi.restoreAllMocks());

describe('globe loading', () => {
  it('mounts WebGL only while its managed window is open', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query.includes('hover: hover'), media: query,
      onchange: null, addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
    }));
    render(<DesktopProvider><InDesktopContext.Provider value={true}><HeroVisual /><CloseGlobe /></InDesktopContext.Provider></DesktopProvider>);
    expect(screen.queryByTestId('webgl-globe')).not.toBeInTheDocument();
    fireEvent(window, new CustomEvent('desktop:open', { detail: 'globe' }));
    expect(screen.getByTestId('webgl-globe')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close globe'));
    expect(screen.queryByTestId('webgl-globe')).not.toBeInTheDocument();
  });
});
