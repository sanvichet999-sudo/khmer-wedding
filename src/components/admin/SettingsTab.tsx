import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Check,
  RefreshCw,
  Download,
  User,
  Phone,
  ShieldCheck,
  Calendar,
  LogOut,
  Camera,
  Sparkles,
} from 'lucide-react';
import { WeddingEvent, User as UserType } from '../../types/fullstack';
import { api } from '../../services/api';

interface SettingsTabProps {
  onLogout?: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onLogout }) => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [wedding, setWedding] = useState<WeddingEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingWedding, setSavingWedding] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedWedding, setSavedWedding] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);
  
  // Profile edit form state
  const [profileName, setProfileName] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      // Load current user and wedding
      const meData = await api.getMe();
      setCurrentUser(meData.user);
      setProfileName(meData.user.fullName || '');
      setProfileAvatar(meData.user.avatar || '');

      const weddingData = await api.getWedding();
      setWedding(weddingData.wedding);
    } catch (err) {
      console.error('Failed to load settings data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleWeddingChange = (field: keyof WeddingEvent, value: string) => {
    if (!wedding) return;
    setWedding({ ...wedding, [field]: value });
  };

  const handleSaveWedding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wedding) return;
    try {
      setSavingWedding(true);
      await api.updateWedding(wedding);
      setSavedWedding(true);
      setTimeout(() => setSavedWedding(false), 2500);
    } catch {
      alert('Failed to save settings');
    } finally {
      setSavingWedding(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await api.updateProfile({
        fullName: profileName.trim(),
        avatar: profileAvatar,
      });
      setCurrentUser(res.user);
      setSavedProfile(true);
      setTimeout(() => setSavedProfile(false), 2500);
    } catch {
      alert('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleBackupJson = () => {
    if (!wedding) return;
    const backupData = {
      user: currentUser,
      wedding,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `wedding_settings_backup_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !wedding) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-stone-400">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mb-3" />
        <p className="text-xs">កំពុងផ្ទុកការកំណត់ និង Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header */}
      <div className="pb-4 border-b border-stone-800">
        <h2 className="font-moul text-xl text-gold-gradient mb-1">
          ការកំណត់ & Profile (User Profile & Wedding Settings)
        </h2>
        <p className="text-xs text-stone-400">
          គ្រប់គ្រងព័ត៌មានគណនីផ្ទាល់ខ្លួន ព័ត៌មានលម្អិតនៃកម្មវិធីមង្គលការ និងការបម្រុងទុកទិន្នន័យ
        </p>
      </div>

      {/* 1. USER PROFILE SECTION (Requirement #5) */}
      <div className="p-6 rounded-2xl bg-[#141210] border border-amber-500/20 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-moul text-sm text-stone-100">
                ព័ត៌មានគណនីម្ចាស់កម្មវិធី (User Profile)
              </h3>
              <p className="text-[11px] text-stone-400">
                គណនីផ្ទាល់ខ្លួន និងទិន្នន័យឯករាជ្យ (Strictly Isolated Account)
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>លេខទូរស័ព្ទបានផ្ទៀងផ្ទាត់ OTP ✓</span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            
            {/* Avatar Display / Selector */}
            <div className="relative group shrink-0 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600/30 to-amber-400/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-2xl overflow-hidden shadow-lg shadow-amber-500/10">
                {profileAvatar ? (
                  <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{profileName ? profileName.charAt(0) : 'U'}</span>
                )}
              </div>
              <span className="text-[10px] text-stone-400 mt-1.5 block">រូបតំណាង</span>
            </div>

            {/* Profile Fields */}
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  ឈ្មោះពេញ (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  លេខទូរស័ព្ទ (Verified Phone Number)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    disabled
                    value={currentUser?.phone || ''}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-stone-800 text-stone-400 cursor-not-allowed text-xs font-mono"
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  លេខទូរស័ព្ទត្រូវបានចាក់សោសុវត្ថិភាព ក្រោយផ្ទៀងផ្ទាត់ OTP
                </span>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  កាលបរិច្ឆេទបង្កើតគណនី (Created Date)
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    disabled
                    value={currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleString('km-KH') : 'N/A'}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-stone-800 text-stone-400 cursor-not-allowed text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Avatar URL (រូបភាពតំណាង)
                </label>
                <input
                  type="text"
                  value={profileAvatar}
                  onChange={(e) => setProfileAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between pt-3 border-t border-stone-800/80">
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-rose-300 border border-stone-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ចាកចេញពីគណនីនេះ (Sign Out)</span>
              </button>
            )}

            <div className="flex items-center gap-3 ml-auto">
              {savedProfile && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>បានកែប្រែ Profile!</span>
                </span>
              )}

              <button
                type="submit"
                disabled={savingProfile}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {savingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>រក្សាទុក Profile</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 2. WEDDING SETTINGS & METADATA */}
      <form onSubmit={handleSaveWedding} className="space-y-6 text-xs">
        
        {/* Core Metadata */}
        <div className="p-5 rounded-2xl bg-[#141210] border border-stone-800 space-y-4">
          <h3 className="font-moul text-sm text-stone-200">
            ព័ត៌មានជាភាសាអង់គ្លេស (English Metadata)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 font-medium mb-1">
                Groom Name (English)
              </label>
              <input
                type="text"
                value={wedding.groomNameEnglish}
                onChange={(e) => handleWeddingChange('groomNameEnglish', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">
                Bride Name (English)
              </label>
              <input
                type="text"
                value={wedding.brideNameEnglish}
                onChange={(e) => handleWeddingChange('brideNameEnglish', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">
                Groom Parents (English)
              </label>
              <input
                type="text"
                value={wedding.groomParentsEnglish}
                onChange={(e) => handleWeddingChange('groomParentsEnglish', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">
                Bride Parents (English)
              </label>
              <input
                type="text"
                value={wedding.brideParentsEnglish}
                onChange={(e) => handleWeddingChange('brideParentsEnglish', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Location & Navigation Links */}
        <div className="p-5 rounded-2xl bg-[#141210] border border-stone-800 space-y-4">
          <h3 className="font-moul text-sm text-stone-200">
            តំណភ្ជាប់ផែនទី និងចំណត (Maps & Parking)
          </h3>

          <div>
            <label className="block text-stone-300 font-medium mb-1">
              Google Maps URL
            </label>
            <input
              type="text"
              value={wedding.googleMapsUrl}
              onChange={(e) => handleWeddingChange('googleMapsUrl', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 font-mono text-[11px] focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-medium mb-1">
              Apple Maps URL
            </label>
            <input
              type="text"
              value={wedding.appleMapsUrl}
              onChange={(e) => handleWeddingChange('appleMapsUrl', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 font-mono text-[11px] focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-medium mb-1">
              ព័ត៌មានចំណតយានយន្ត (Parking Notes)
            </label>
            <textarea
              rows={2}
              value={wedding.parkingInfoKhmer}
              onChange={(e) => handleWeddingChange('parkingInfoKhmer', e.target.value)}
              className="w-full p-2.5 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleBackupJson}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ទាញយក Backup (JSON)</span>
          </button>

          <div className="flex items-center gap-3">
            {savedWedding && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>បានរក្សាទុក!</span>
              </span>
            )}

            <button
              type="submit"
              disabled={savingWedding}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {savingWedding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savingWedding ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកការកំណត់'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
