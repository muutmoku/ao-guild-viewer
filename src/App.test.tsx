/* eslint-disable testing-library/no-debugging-utils */
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from './App';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        guilds: [
          {
            Id: '123',
            Name: 'TestGuild',
            AllianceId: null,
            KillFame: 123456,
            DeathFame: 654321,
            MemberCount: 1,
          },
        ],
      }),
  })
) as jest.Mock;

describe('GuildInfoSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, '', '/');
  });

  test('renders input fields and button', () => {
    render(<App />);
    expect(screen.getByLabelText(/Guild Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Server/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  test('updates query parameters on search', async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Guild Name/i), {
      target: { value: 'TestGuild' },
    });
    fireEvent.mouseDown(screen.getByLabelText(/Server/i));

    const listbox = await screen.findByRole('listbox');
    fireEvent.click(within(listbox).getByText('EU'));

    const button = await screen.findByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(window.location.search).toContain('guild=TestGuild');
      expect(window.location.search).toContain('server=EU');
    });
  });
});
