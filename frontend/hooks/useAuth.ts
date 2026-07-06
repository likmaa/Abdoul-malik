interface AuthUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAdminOrManager: boolean;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  return {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isAdminOrManager: false,
    isLoading: false,
  };
}