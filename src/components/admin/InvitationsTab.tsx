import React, { useState, useEffect } from 'react';
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  Eye,
  RefreshCw,
  QrCode,
  Send,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Share2,
  X,
  Sparkles,
  Download,
} from 'lucide-react';
import { Guest } from '../../types/fullstack';
import { api } from '../../services/api';
import { toKhmerNumber } from '../../utils/khmerNumerals';

interface InvitationsTabProps {
  onOpenGuestInvitation: (token: string) => void;
}

export const InvitationsTab: React.FC<InvitationsTabProps> = ({ onOpenGuestInvitation }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'opened' | 'sent' | 'confirmed'>('all');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [copiedMessageToken, setCopiedMessageToken] = useState<string | null>(null);

  // QR Modal
  const [qrGuest, setQrGuest] = useState<Guest | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getGuests();
      setGuests(data);
    } catch (err) {
      console.error('Failed to load guest links:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getFullInvitationUrl = (token: string) => {
    return `${window.location.origin}/?token=${token}`;
  };

  const handleCopyLink = (token: string) => {
    const url = getFullInvitationUrl(token);
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleCopyKhmerMessage = (guest: Guest) => {
    const url = getFullInvitationUrl(guest.invitationToken);
    const msg = `សូមគោរពអញ្ជើញ ${guest.fullName}\nចូលរួមពិធីសិរីសួស្តីអាពាហ៍ពិពាហ៍ និងពិធីជប់លៀងអាហារពេលល្ងាច។\n\nសូមចុចលើតំណភ្ជាប់ខាងក្រោមដើម្បីបើកមើលសំបុត្រអញ្ជើញឌីជីថលផ្ទាល់ខ្លួន ទីតាំង និងបញ្ជាក់វត្តមាន (RSVP)៖\n👉 ${url}\n\nសូមអរគុណយ៉ាងជ្រាលជ្រៅ!`;
    navigator.clipboard.writeText(msg);
    setCopiedMessageToken(guest.invitationToken);
    setTimeout(() => setCopiedMessageToken(null), 2500);
  };

  const handleRegenerate = async (id: string) => {
    if (!window.confirm('តើអ្នកពិតជាចង់បង្កើតតំណភ្ជាប់ថ្មី (Regenerate Token) មែនទេ? តំណភ្ជាប់ចាស់នឹងលែងដំណើរការ។')) {
      return;
    }
    try {
      const newToken = await api.regenerateToken(id);
      setGuests((prev) =>
        prev.map((g) => (g.id === id ? { ...g, invitationToken: newToken } : g))
      );
    } catch {
      alert('Failed to regenerate link token.');
    }
  };

  // Filtered guests
  const filtered = guests.filter((g) => {
    const matchSearch =
      g.fullName.toLowerCase().includes(search.toLowerCase()) ||
      g.invitationToken.toLowerCase().includes(search.toLowerCase()) ||
      (g.phone && g.phone.includes(search));
    
    if (!matchSearch) return false;
    if (statusFilter === 'opened') return g.invitationStatus === 'opened';
    if (statusFilter === 'sent') return g.invitationStatus === 'sent' && !g.openedAt;
    if (statusFilter === 'confirmed') return g.attendanceStatus === 'confirmed';
    return true;
  });

  const totalCount = guests.length;
  const openedCount = guests.filter((g) => g.invitationStatus === 'opened' || !!g.openedAt).length;
  const notOpenedCount = totalCount - openedCount;
  const confirmedCount = guests.filter((g) => g.attendanceStatus === 'confirmed').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-stone-400">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mb-3" />
        <p className="text-xs">កំពុងផ្ទុកតំណភ្ជាប់សំបុត្រអញ្ជើញ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h2 className="font-moul text-xl text-gold-gradient mb-1">
            តំណភ្ជាប់សំបុត្រអញ្ជើញ (Unique Invitation Links)
          </h2>
          <p className="text-xs text-stone-400">
            គ្រប់គ្រងតំណភ្ជាប់សំបុត្រផ្ទាល់ខ្លួនរបស់ភ្ញៀវម្នាក់ៗ ចម្លងផ្ញើតាម Telegram / WhatsApp និងតាមដានការបើកមើល
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 transition-colors flex items-center gap-1.5 self-start cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>ផ្ទុកឡើងវិញ</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="p-4 rounded-2xl bg-[#14120e] border border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-stone-400">តំណភ្ជាប់សរុប</div>
            <div className="text-xl font-bold text-stone-100 font-moul">
              {toKhmerNumber(totalCount)}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#14120e] border border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-stone-400">ភ្ញៀវបានបើកមើល</div>
            <div className="text-xl font-bold text-emerald-400 font-moul">
              {toKhmerNumber(openedCount)}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#14120e] border border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-500/10 text-stone-400 flex items-center justify-center shrink-0 border border-stone-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-stone-400">មិនទាន់បើកមើល</div>
            <div className="text-xl font-bold text-stone-300 font-moul">
              {toKhmerNumber(notOpenedCount)}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#14120e] border border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-stone-400">បានបញ្ជាក់ RSVP</div>
            <div className="text-xl font-bold text-amber-300 font-moul">
              {toKhmerNumber(confirmedCount)}
            </div>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-2xl bg-[#12100e] border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ស្វែងរកតាមឈ្មោះភ្ញៀវ ឬកូដ Token..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'all'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            ទាំងអស់ ({toKhmerNumber(totalCount)})
          </button>
          <button
            onClick={() => setStatusFilter('opened')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'opened'
                ? 'bg-emerald-500 text-stone-950 font-bold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            បានបើក ({toKhmerNumber(openedCount)})
          </button>
          <button
            onClick={() => setStatusFilter('sent')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'sent'
                ? 'bg-stone-600 text-white font-bold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            មិនទាន់បើក ({toKhmerNumber(notOpenedCount)})
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'confirmed'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            បាន RSVP ({toKhmerNumber(confirmedCount)})
          </button>
        </div>
      </div>

      {/* Links List Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-[#12100e] border border-stone-800 rounded-2xl text-stone-400 text-xs">
            រកមិនឃើញតំណភ្ជាប់ភ្ញៀវតាមលក្ខខណ្ឌស្វែងរកនេះទេ។
          </div>
        ) : (
          filtered.map((guest) => {
            const fullUrl = getFullInvitationUrl(guest.invitationToken);
            const isOpened = guest.invitationStatus === 'opened' || !!guest.openedAt;

            return (
              <div
                key={guest.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#14120e] border border-stone-800 hover:border-amber-500/30 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {guest.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-100 text-sm flex items-center gap-2">
                        <span>{guest.fullName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-normal">
                          {guest.group || 'ទូទៅ'}
                        </span>
                      </h3>
                      <div className="text-[11px] text-stone-400">
                        កូដសម្គាល់៖ <code className="text-amber-300 font-mono font-bold">{guest.invitationToken}</code> • អញ្ជើញ {guest.allowedGuests} នាក់
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    {isOpened ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[11px] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>បានបើកមើល</span>
                        {guest.openedAt && (
                          <span className="text-[10px] text-emerald-400/80">
                            ({new Date(guest.openedAt).toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' })})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800/80 border border-stone-700 text-stone-400 text-[11px] font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>មិនទាន់បើក</span>
                      </span>
                    )}

                    {guest.attendanceStatus === 'confirmed' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                        <span>ចូលរួម ✓</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Unique URL Bar */}
                <div className="flex items-center gap-2 p-2 rounded-xl bg-black/60 border border-stone-800 text-xs">
                  <Link2 className="w-3.5 h-3.5 text-stone-500 shrink-0 ml-1" />
                  <span className="font-mono text-stone-300 truncate select-all flex-1 text-[11px]">
                    {fullUrl}
                  </span>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopyLink(guest.invitationToken)}
                      className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-medium border border-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Copy Unique Link"
                    >
                      {copiedToken === guest.invitationToken ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">បានចម្លង</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-stone-400" />
                          <span>ចម្លង Link</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopyKhmerMessage(guest)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-medium border border-amber-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Copy Telegram/WhatsApp Invite Message"
                    >
                      {copiedMessageToken === guest.invitationToken ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">បានចម្លងសារ</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 text-amber-400" />
                          <span>ចម្លងសារផ្ញើ</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setQrGuest(guest)}
                      className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer"
                      title="View QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenGuestInvitation(guest.invitationToken)}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                      title="Preview Invitation as this Guest"
                    >
                      <Eye className="w-3 h-3" />
                      <span>បើកមើល</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>
                    បង្កើតនៅ៖ {new Date(guest.createdAt).toLocaleDateString('km-KH')}
                  </span>
                  <button
                    onClick={() => handleRegenerate(guest.id)}
                    className="text-stone-400 hover:text-rose-400 underline transition-colors cursor-pointer"
                  >
                    បង្កើតតំណភ្ជាប់ថ្មី (Regenerate Link)
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* QR Code Modal */}
      {qrGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#14120e] border border-amber-500/30 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setQrGuest(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-moul text-base text-gold-gradient mb-1">
                QR Code សំបុត្រអញ្ជើញ
              </h3>
              <p className="text-xs text-stone-300 font-medium">
                {qrGuest.fullName}
              </p>
              <p className="text-[11px] text-stone-400">
                កូដសម្គាល់៖ <span className="text-amber-300 font-mono font-bold">{qrGuest.invitationToken}</span>
              </p>
            </div>

            {/* Generated QR Code Image via QuickChart or Public QR API */}
            <div className="p-4 bg-white rounded-xl mx-auto w-52 h-52 flex items-center justify-center shadow-lg border border-amber-400/40">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  getFullInvitationUrl(qrGuest.invitationToken)
                )}`}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              ភ្ញៀវអាចស្កេន QR Code នេះដោយផ្ទាល់តាមកាមេរ៉ាទូរស័ព្ទ ដើម្បីបើកមើលសំបុត្រអញ្ជើញឌីជីថល
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleCopyLink(qrGuest.invitationToken)}
                className="flex-1 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>ចម្លង Link</span>
              </button>
              <button
                onClick={() => {
                  const url = getFullInvitationUrl(qrGuest.invitationToken);
                  window.open(url, '_blank');
                }}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>បើកតំណ</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
