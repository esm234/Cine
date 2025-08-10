import { createRoot } from 'react-dom/client'
import AppRoutes from './pages/Index.tsx'
import './index.css'

// تهيئة متجر React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FavoritesProvider } from './hooks/useFavorites.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <FavoritesProvider>
      <AppRoutes />
    </FavoritesProvider>
  </QueryClientProvider>
);
