import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Link2,
  CheckSquare,
  FileCode2,
  Gift,
  Settings,
  Eye,
  LogOut,
  Sparkles,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import { DashboardTab } from './DashboardTab';
import { GuestListTab } from './GuestListTab';
import { InvitationsTab } from './InvitationsTab';
import { AttendanceTab } from './AttendanceTab';
import { TemplateEditorTab } from './TemplateEditorTab';
import { GiftManagementTab } from './GiftManagementTab';
import { SettingsTab } from './SettingsTab';
import { WeddingEvent, WeddingTemplate, User } from '../../types/fullstack';

interface AdminLayoutProps {
  currentUser?: User | null;
  wedding?: WeddingEvent | null;
  template?: WeddingTemplate | null;
  onLogout: () => void;
  onExitAdmin: () => void;
  onOpenGuestPreview: (token?: string) => void;
  onTemplateUpdated: (wedding: WeddingEvent, template: WeddingTemplate) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  wedding,
  template,
  onLogout,
  onExitAdmin,
  onOpenGuestPreview,
  onTemplateUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'guests' | 'invitations' | 'attendance' | 'template' | 'gifts' | 'settings'
  >('dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-100 flex flex-col font-kantumruy">
      
      {/* Top Header Contract */}
      <header className="sticky top-0 z-40 bg-[#12100e]/95 backdrop-blur-md border-b border-amber-500/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Wordmark & Logged-in User Account Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-moul text-sm sm:text-base text-gold-gradient tracking-wide block leading-tight">
                Admin Management Portal
              </span>
              <span className="text-[10px] text-stone-400 block truncate">
                ប្រព័ន្ធគ្រប់គ្រងសំបុត្រអញ្ជើញ & វត្តមាន
              </span>
            </div>
          </div>

          {/* User Account Indicator & Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Logged in User Pill */}
            {currentUser && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[11px]">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" className="w-full h-full rounded-lg object-cover" />
                  ) : (
                    <span>{currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}</span>
                  )}
                </div>
                <div className="leading-tight">
                  <div className="font-semibold text-stone-200 text-[11px] truncate max-w-[120px]">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[9px] text-amber-400/80 font-mono">
                    {currentUser.phone}
                  </div>
                </div>
              </div>
            )}

            {/* Preview Public Wedding Invitation */}
            <button
              onClick={() => onOpenGuestPreview()}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ទិដ្ឋភាពសំបុត្រអញ្ជើញ</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogoutConfirm}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-stone-800 hover:bg-rose-950/80 text-stone-300 hover:text-rose-300 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-700 hover:border-rose-800"
              title="ចាកចេញពីគណនី (Sign Out)"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-400 hover:text-rose-300" />
              <span className="hidden sm:inline">ចាកចេញ</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar (Fulfills requested Navigation Items) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-stone-900 py-1.5 text-xs">
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-3 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('guests')}
            className={`py-2 px-3 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'guests'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Guest List (បញ្ជីភ្ញៀវ)</span>
          </button>

          <button
            onClick={() => setActiveTab('invitations')}
            className={`py-2 px-3 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'invitations'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Invitations / Links (តំណភ្ជាប់)</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-2 px-3 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'attendance'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Attendance (វត្តមាន)</span>
          </button>

          <button
            onClick={() => setActiveTab('template')}
            className={`py-2 px-3 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'template'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Wedding Template</span>
          </button>

          <button
            onClick={() => setActiveTab('gifts')}
            className={`py-2 px-3 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'gifts'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Gift & Contribution</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-3 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings & Profile</span>
          </button>

        </div>
      </header>

      {/* Main Content Pane */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <DashboardTab
            onNavigateToGuests={() => setActiveTab('guests')}
            onNavigateToAttendance={() => setActiveTab('attendance')}
            onNavigateToTemplate={() => setActiveTab('template')}
          />
        )}

        {activeTab === 'guests' && (
          <GuestListTab
            wedding={wedding}
            onOpenGuestInvitation={onOpenGuestPreview}
            onNavigateToTemplate={() => setActiveTab('template')}
          />
        )}

        {activeTab === 'invitations' && (
          <InvitationsTab onOpenGuestInvitation={onOpenGuestPreview} />
        )}

        {activeTab === 'attendance' && <AttendanceTab />}

        {activeTab === 'template' && (
          <TemplateEditorTab
            initialWedding={wedding}
            initialTemplate={template}
            onTemplateUpdated={onTemplateUpdated}
          />
        )}

        {activeTab === 'gifts' && <GiftManagementTab />}

        {activeTab === 'settings' && <SettingsTab onLogout={onLogout} />}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#161210] rounded-2xl border border-amber-500/30 p-6 shadow-2xl text-stone-100 font-kantumruy text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-3">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="font-moul text-base text-gold-gradient mb-2">
              ចាកចេញពីគណនី
            </h3>

            <p className="text-xs text-stone-300 mb-6">
              តើអ្នកពិតជាចង់ចាកចេញពីគណនី ({currentUser?.fullName || 'Admin'}) មែនទេ?
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
              >
                បោះបង់
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-900/40 cursor-pointer"
              >
                ចាកចេញ (Log Out)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
