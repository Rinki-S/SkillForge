import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { queryClient } from './queryClient';
import { AuthProvider } from './contexts/AuthContext';
import { AppLayout } from './components/AppLayout';
import { RequireAuth } from './components/RequireAuth';
import { MarketplacePage } from './pages/MarketplacePage';
import { SkillDetailPage } from './pages/SkillDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SkillCreatePage } from './pages/SkillCreatePage';
import { SkillEditPage } from './pages/SkillEditPage';
import { MySkillsPage } from './pages/MySkillsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { UsageLogsPage } from './pages/UsageLogsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <MarketplacePage /> },
      { path: 'skills/public/:id', element: <SkillDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: 'skills/new', element: <SkillCreatePage /> },
          { path: 'skills/:id/edit', element: <SkillEditPage /> },
          { path: 'my-skills', element: <MySkillsPage /> },
          { path: 'favorites', element: <FavoritesPage /> },
          { path: 'usage-logs', element: <UsageLogsPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      {
        element: <RequireAuth adminOnly />,
        children: [{ path: 'admin', element: <AdminPage /> }],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
