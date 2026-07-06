# 🧪 Guide des Tests - eJS MARKET

Ce document explique comment exécuter et écrire des tests pour le projet.

## 📦 Installation des dépendances de test

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

## 🚀 Exécution des tests

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch
npm test -- --watch

# Exécuter les tests avec couverture
npm test -- --coverage
```

## 📝 Structure des tests

Les tests sont organisés dans le dossier `__tests__/` :

```
__tests__/
  components/
    WishlistButton.test.tsx
    ComparisonButton.test.tsx
  contexts/
    CartContext.test.tsx
    WishlistContext.test.tsx
  utils/
    formatPrice.test.ts
```

## ✍️ Écrire un test

### Exemple : Test d'un composant

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Exemple : Test d'un contexte

```typescript
import { renderHook, act } from '@testing-library/react';
import { useWishlist, WishlistProvider } from '@/contexts/WishlistContext';

describe('WishlistContext', () => {
  it('adds item to wishlist', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WishlistProvider>{children}</WishlistProvider>
    );

    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.addToWishlist({
        productId: '1',
        sku: 'SKU-001',
        name: 'Test Product',
        priceHT: 10000,
        vatRate: 0.2,
      });
    });

    expect(result.current.isInWishlist('1')).toBe(true);
  });
});
```

## 🎯 Bonnes pratiques

1. **Nommer les tests clairement** : Utilisez des descriptions qui expliquent ce qui est testé
2. **Un test, une assertion** : Chaque test devrait vérifier une seule chose
3. **Isoler les tests** : Chaque test doit être indépendant
4. **Tester les cas limites** : Testez les cas d'erreur et les cas limites
5. **Utiliser les queries accessibles** : Préférez `getByRole`, `getByLabelText` plutôt que `getByTestId`

## 📊 Couverture de code

La couverture de code est configurée pour inclure :
- `components/**/*.{js,jsx,ts,tsx}`
- `app/**/*.{js,jsx,ts,tsx}`
- `contexts/**/*.{js,jsx,ts,tsx}`

Objectif : **> 80% de couverture**

## 🔍 Tests Lighthouse

Pour exécuter les tests Lighthouse :

```bash
# Installer Lighthouse CI
npm install -g @lhci/cli

# Exécuter les tests
lhci autorun
```

Les tests Lighthouse vérifient :
- Performance : Score > 90
- Accessibility : Score > 90
- Best Practices : Score > 90
- SEO : Score > 90

## 📚 Ressources

- [Testing Library](https://testing-library.com/)
- [Jest](https://jestjs.io/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

