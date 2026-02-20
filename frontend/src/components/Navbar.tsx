import { Link, useLocation } from 'react-router-dom';
import { Youtube, MessageSquare } from 'lucide-react';
import clsx from 'clsx';

const links = [
  { to: '/', label: 'Index', icon: Youtube },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
] as const;

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <Youtube className="w-6 h-6 text-accent group-hover:text-accent-light transition-colors" />
          <span className="text-lg font-bold text-gray-100">
            Tube<span className="text-accent">Rag</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                pathname === to
                  ? 'bg-accent/15 text-accent'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5',
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
