import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Target, CheckSquare, MessageCircle, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    id: 'goals',
    label: 'Goals',
    icon: Target,
    path: '/goals'
  },
  {
    id: 'tasks',
    label: 'Tasks', 
    icon: CheckSquare,
    path: '/tasks'
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: MessageCircle,
    path: '/chat'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics'
  }
];

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors duration-quick",
                "min-w-[60px] text-xs font-medium",
                active 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon 
                size={20} 
                className={cn(
                  "transition-transform duration-quick",
                  active && "scale-110"
                )}
              />
              <span className="leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};