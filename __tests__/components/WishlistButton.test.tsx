import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { WishlistProvider } from '@/frontend/contexts/WishlistContext';
import { WishlistButton } from '@/frontend/components/WishlistButton';
import '@testing-library/jest-dom'; // Extra assurance for types

const renderWithProvider = (component: React.ReactElement) => {
  return render(<WishlistProvider>{component}</WishlistProvider>);
};

describe('WishlistButton', () => {
  beforeEach(() => {
    // Nettoyer localStorage avant chaque test
    localStorage.clear();
    jest.clearAllMocks();
  });

  const mockProduct = {
    productId: '1',
    sku: 'SKU-001',
    name: 'Test Product',
    priceHT: 10000,
    vatRate: 0.2,
    image: 'https://example.com/image.jpg',
    brand: 'Test Brand',
  };

  it('renders correctly', () => {
    renderWithProvider(<WishlistButton {...mockProduct} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('adds product to wishlist on click', async () => {
    renderWithProvider(<WishlistButton {...mockProduct} />);
    const button = screen.getByRole('button');

    await act(async () => {
      fireEvent.click(button);
      // Wait for state update
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveClass('bg-violet-electric');
    });
  });

  it('toggles product in wishlist', async () => {
    renderWithProvider(<WishlistButton {...mockProduct} />);

    // Initial state
    const button = await screen.findByRole('button');
    expect(button).toHaveAttribute('aria-label', `Ajouter ${mockProduct.name} à la liste de souhaits`);

    // Add to wishlist
    await act(async () => {
      fireEvent.click(button);
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', `Retirer ${mockProduct.name} de la liste de souhaits`);
    });

    // Remove from wishlist
    const updatedButton = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(updatedButton);
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', `Ajouter ${mockProduct.name} à la liste de souhaits`);
    });
  });

  it('has correct aria-label when not in wishlist', () => {
    renderWithProvider(<WishlistButton {...mockProduct} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', `Ajouter ${mockProduct.name} à la liste de souhaits`);
  });

  it('has correct aria-label when in wishlist', async () => {
    renderWithProvider(<WishlistButton {...mockProduct} />);
    const button = screen.getByRole('button');

    await act(async () => {
      fireEvent.click(button);
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', `Retirer ${mockProduct.name} de la liste de souhaits`);
    });
  });
});
