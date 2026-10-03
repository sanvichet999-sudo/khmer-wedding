import React from 'react';
import { Share2, CheckSquare, ShieldCheck } from 'lucide-react';

interface NavigationProps {
  coupleName?: string;
  onOpenShareModal: () => void;
  onNavigateToRsvp: () => void;
  onOpenAdmin: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  coupleName = 'វិចិត្រ & ចរិយា',
  onOpenShareModal,
  onNavigateToRsvp,
  onOpenAdmin,
}) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0c0b0a]/90 backdrop-blur-md border-b border-amber-500/20 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-moul text-sm sm:text-base text-gold-gradient tracking-wide hover:opacity-90 transition-opacity truncate max-w-[200px] sm:max-w-none"
        >
          {coupleName}
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-stone-300">
          <button
            onClick={() => scrollTo('hero-section')}
            className="hover:text-amber-300 transition-colors cursor-pointer py-1"
          >
            ទំព័រដើម
          </button>
          <button
            onClick={() => scrollTo('schedule-section')}
            className="hover:text-amber-300 transition-colors cursor-pointer py-1"
          >
            ពេលវេលា
          </button>
          <button
            onClick={() => scrollTo('venue-section')}
            className="hover:text-amber-300 transition-colors cursor-pointer py-1"
          >
            ទីតាំងជាក់លាក់
          </button>
          <button
            onClick={() => scrollTo('gallery-section')}
            className="hover:text-amber-300 transition-colors cursor-pointer py-1"
          >
            កម្រងរូបភាព
          </button>
          <button
            onClick={() => scrollTo('guestbook-section')}
            className="hover:text-amber-300 transition-colors cursor-pointer py-1"
          >
            សៀវភៅជូនពរ
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          
          {/* Admin Dashboard Entry Button */}
          <button
            onClick={onOpenAdmin}
            className="px-2.5 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-amber-300 border border-stone-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            title="ចូលទៅកាន់ Admin Dashboard"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-amber-500/30 text-amber-200 hover:bg-amber-500/10 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            title="ចែករំលែកតំណភ្ជាប់"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline whitespace-nowrap">ចែករំលែក</span>
          </button>

          <button
            onClick={onNavigateToRsvp}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 hover:from-amber-300 hover:to-amber-400 text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>ឆ្លើយតប (RSVP)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
