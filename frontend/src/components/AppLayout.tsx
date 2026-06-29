import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Hammer, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

const navItems = [
  { to: '/', label: '广场', auth: false, end: true },
  { to: '/skills/new', label: '创建', auth: true },
  { to: '/my-skills', label: '我的', auth: true },
  { to: '/favorites', label: '收藏', auth: true },
  { to: '/usage-logs', label: '记录', auth: true },
];

// Horizontal top-nav link styling. Active = blue underline + ink text,
// matching the Kumo brand accent used across the rest of the console.
function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'relative whitespace-nowrap px-1 py-1 text-sm font-medium text-console-muted transition hover:text-console-ink',
    isActive &&
      'text-console-ink after:absolute after:inset-x-0 after:-bottom-[3px] after:h-0.5 after:rounded-full after:bg-console-orange',
  );
}

export function AppLayout() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const visibleNavItems = navItems.filter((item) => !item.auth || isAuthenticated);

  return (
    <div className="min-h-screen bg-console-canvas text-console-ink">
      <header className="sticky top-0 z-20 border-b border-console-line bg-console-panel/95 backdrop-blur">
        <div className="mx-auto flex min-h-14 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2.5 font-semibold text-console-ink">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-console-line bg-console-orangeSoft text-console-orange">
              <Hammer className="h-4 w-4" />
            </span>
            <span>SkillForge</span>
          </Link>

          <nav className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto">
            {visibleNavItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
            {isAdmin ? (
              <NavLink to="/admin" className={navLinkClass}>
                管理
              </NavLink>
            ) : null}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {isAuthenticated && user ? (
              <>
                <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                  <UserCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.username}</span>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">退出</span>
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  登录
                </Button>
                <Button type="button" size="sm" onClick={() => navigate('/register')}>
                  注册
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}
