import React from 'react';
import { Home, FolderHeart, PlusCircle, User, Sparkles } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'home' | 'records' | 'consult' | 'profile';
  onSelectTab: (tab: 'home' | 'records' | 'consult' | 'profile') => void;
  onSwitchToDoctor?: () => void;
  isDoctorView?: boolean;
}

interface TabItem {
  id: 'home' | 'records' | 'consult' | 'profile';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isHighlight?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'records', label: 'Records', icon: FolderHeart },
    { id: 'consult', label: 'Consult', icon: PlusCircle, isHighlight: true },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav
      id="bottom-navigation"
      aria-label="Bottom Navigation"
      className="sticky bottom-0 z-30 flex items-center justify-around border-t border-slate-200/80 bg-white/95 px-3 py-2 backdrop-blur-md transition-all shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center justify-around w-full max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isHighlight) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="group flex flex-col items-center justify-center -mt-5 relative z-10 transition-transform active:scale-95"
                aria-label={tab.label}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-md transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white ring-4 ring-blue-100 shadow-blue-500/35 scale-105'
                      : 'bg-gradient-to-tr from-blue-600 to-blue-700 text-white hover:brightness-110 shadow-blue-500/20'
                  }`}
                >
                  <Icon className="h-6 w-6 stroke-[2.2]" />
                </div>
                <span
                  className={`mt-1 text-[11px] font-bold tracking-tight transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-600 group-hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 sm:px-4 rounded-xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform ${
                    isActive ? 'stroke-[2.4] scale-105' : 'stroke-[1.8]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />
                )}
              </div>
              <span
                className={`mt-1 text-[11px] tracking-tight ${
                  isActive ? 'font-bold text-blue-600' : 'text-slate-500 font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
