import { Outlet, Link, useLocation } from 'react-router';
import { Brain, LayoutDashboard, Folder, FileText, Calendar, Trophy, Settings, Crown, Menu, X, Home, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/folders', icon: Folder, label: 'Folders' },
    { path: '/dashboard/notes', icon: FileText, label: 'Notes' },
    { path: '/dashboard/schedule', icon: Calendar, label: 'Revision Schedule' },
    { path: '/dashboard/revision', icon: BookOpen, label: 'Revision' },
    { path: '/dashboard/tests', icon: Trophy, label: 'Mock Tests' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
    { path: '/dashboard/upgrade', icon: Crown, label: 'Upgrade' }

  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-border bg-white">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 h-16 px-6 border-b border-border">
            <Brain className="w-8 h-8 text-primary" />
            <span className="text-xl font-semibold text-foreground">Revision Flow</span>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? 'bg-primary text-white'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <Link
              to="/dashboard/payment"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary to-secondary text-white px-4 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Crown className="w-5 h-5" />
              <span className="text-sm">Upgrade to Premium</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-border z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Brain className="w-7 h-7 text-primary" />
          <span className="text-lg font-semibold text-foreground">Revision Flow</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="h-16"></div>
            <nav className="px-3 py-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      active
                        ? 'bg-primary text-white'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4">
              <Link
                to="/dashboard/payment"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary to-secondary text-white px-4 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Crown className="w-5 h-5" />
                <span className="text-sm">Upgrade to Premium</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-30">
        <nav className="flex items-center justify-around px-2 py-2">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              isActive('/dashboard') && location.pathname === '/dashboard'
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/dashboard/notes"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              isActive('/dashboard/notes')
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs">Notes</span>
          </Link>
          <Link
            to="/dashboard/revision"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              isActive('/dashboard/revision')
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Revision</span>
          </Link>
          <Link
            to="/dashboard/tests"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              isActive('/dashboard/tests')
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-xs">Tests</span>
          </Link>
          <Link
            to="/dashboard/settings"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              isActive('/dashboard/settings')
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
