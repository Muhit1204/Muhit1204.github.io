import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import DesktopExperienceFrame from '../components/desktop/DesktopExperienceFrame';

beforeEach(() => sessionStorage.clear());

describe('mobile desktop-experience note', () => {
  it('offers the desktop experience while keeping the portfolio available', () => {
    render(<DesktopExperienceFrame><p>Portfolio content</p></DesktopExperienceFrame>);
    expect(screen.getByText('Open on a desktop for the full 3D experience.')).toBeInTheDocument();
    expect(screen.getByText('Portfolio content')).toBeInTheDocument();
  });
  it('dismisses and remembers the note for the browser session', () => {
    const view = render(<DesktopExperienceFrame><p>Portfolio content</p></DesktopExperienceFrame>);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss desktop experience note' }));
    expect(screen.queryByRole('complementary', { name: 'Desktop experience' })).not.toBeInTheDocument();
    view.unmount();
    render(<DesktopExperienceFrame><p>Portfolio content</p></DesktopExperienceFrame>);
    expect(screen.queryByText('Open on a desktop for the full 3D experience.')).not.toBeInTheDocument();
  });
});
