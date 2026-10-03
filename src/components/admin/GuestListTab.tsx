import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Copy,
  Check,
  ExternalLink,
  Edit2,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  UserCheck,
  X,
  Phone,
  Mail,
  UserPlus,
  FileCode2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Guest, WeddingEvent } from '../../types/fullstack';
import { api } from '../../services/api';
import { toKhmerNumber } from '../../utils/khmerNumerals';

interface GuestListTabProps {
  wedding?: WeddingEvent | null;
  onOpenGuestInvitation: (token: string) => void;
  onNavigateToTemplate?: () => void;
}

const TEMPLATE_NAMES: Record<string, string> = {
  'tmpl-01': 'រាជរដ្ឋមង្គល (Royal Khmer Gold Palace)',
  'tmpl-02': 'សម័យទំនើបប្រណីត (Modern Minimalist Champagne)',
  'tmpl-03': 'បុរាណប្រពៃណីខ្មែរ (Heritage Classical Crimson Silk)',
  'tmpl-04': 'ធម្មជាតិមនោរម្យ (Romantic Botanical Garden)',
  'tmpl-05': 'រាត្រីតារារះ (Grand Midnight Celestial Gala)',
};

export const GuestListTab: React.FC<GuestListTabProps> = ({
  wedding,
  onOpenGuestInvitation,
  onNavigateToTemplate,
}) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // In-app Delete & Toast state (replaces window.confirm/alert which get blocked in iframe)
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formGroup, setFormGroup] = useState('ភ្ញៀវកិត្តិយស (VIP)');
  const [formAllowed, setFormAllowed] = useState(2);
  const [importText, setImportText] = useState('');
  const [formError, setFormError] = useState('');

  const loadGuests = async () => {
    try {
      setLoading(true);
      const data = await api.getGuests({
        search: search.trim() || undefined,
        group: groupFilter !== 'all' ? groupFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setGuests(data);
    } catch (err) {
      console.error('Failed to load guests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuests();
  }, [groupFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadGuests();
  };

  const handleCopyLink = (token: string) => {
    const fullUrl = `${window.location.origin}/?token=${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleRegenerateToken = async (id: string, name: string) => {
    try {
      const newToken = await api.regenerateToken(id);
      setGuests((prev) =>
        prev.map((g) => (g.id === id ? { ...g, invitationToken: newToken } : g))
      );
      setToastMessage(`បានបង្កើតតំណភ្ជាប់ថ្មីសម្រាប់ "${name}" ជោគជ័យ!`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setToastMessage('បរាជ័យក្នុងការបង្កើតតំណភ្ជាប់ថ្មី');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const confirmDeleteGuest = async () => {
    if (!guestToDelete) return;
    try {
      setDeleting(true);
      await api.deleteGuest(guestToDelete.id);
      setGuests((prev) => prev.filter((g) => g.id !== guestToDelete.id));
      setToastMessage(`បានលុបភ្ញៀវ "${guestToDelete.fullName}" ចេញពីបញ្ជីជោគជ័យ!`);
      setGuestToDelete(null);
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setToastMessage('បរាជ័យក្នុងការលុបភ្ញៀវ។ សូមសាកល្បងម្តងទៀត។');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenAddModal = () => {
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormGroup('ភ្ញៀវកិត្តិយស (VIP)');
    setFormAllowed(2);
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleCreateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('សូមបញ្ចូលឈ្មោះភ្ញៀវ');
      return;
    }
    try {
      const newGuest = await api.createGuest({
        fullName: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        group: formGroup,
        allowedGuests: Number(formAllowed) || 1,
      });
      setGuests([newGuest, ...guests]);
      setIsAddModalOpen(false);
      setToastMessage(`បានបន្ថែមភ្ញៀវថ្មី "${newGuest.fullName}" ដោយជោគជ័យ!`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error adding guest');
    }
  };

  const handleOpenEditModal = (g: Guest) => {
    setSelectedGuest(g);
    setFormName(g.fullName);
    setFormPhone(g.phone);
    setFormEmail(g.email || '');
    setFormGroup(g.group);
    setFormAllowed(g.allowedGuests);
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleUpdateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest || !formName.trim()) return;
    try {
      const updated = await api.updateGuest(selectedGuest.id, {
        fullName: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        group: formGroup,
        allowedGuests: Number(formAllowed) || 1,
      });
      setGuests((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
      setIsEditModalOpen(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error updating guest');
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    // Parse simple CSV/line format: "FullName, Phone, Group, AllowedCount"
    const lines = importText.split('\n');
    const guestList: Array<{ fullName: string; phone?: string; group?: string; allowedGuests?: number }> = [];

    for (const line of lines) {
      const parts = line.split(',').map((p) => p.trim());
      if (parts[0]) {
        guestList.push({
          fullName: parts[0],
          phone: parts[1] || '',
          group: parts[2] || 'ភ្ញៀវទូទៅ',
          allowedGuests: parseInt(parts[3] || '2', 10) || 2,
        });
      }
    }

    if (guestList.length === 0) {
      setFormError('មិនមានទិន្នន័យត្រឹមត្រូវសម្រាប់ Import ទេ');
      return;
    }

    try {
      await api.importGuests(guestList);
      setIsImportModalOpen(false);
      setImportText('');
      loadGuests();
    } catch {
      setFormError('Import failed.');
    }
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Full Name', 'Phone', 'Email', 'Group', 'Allowed Guests', 'Status', 'Invitation Link'];
    const rows = guests.map((g) => [
      g.id,
      `"${g.fullName.replace(/"/g, '""')}"`,
      `"${g.phone}"`,
      `"${g.email || ''}"`,
      `"${g.group}"`,
      g.allowedGuests,
      g.attendanceStatus,
      `"${window.location.origin}/?token=${g.invitationToken}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `wedding_guests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const groups = [
    'all',
    'ភ្ញៀវកិត្តិយស (VIP)',
    'សាច់ញាតិខាងកូនប្រុស',
    'សាច់ញាតិខាងកូនស្រី',
    'មិត្តភក្តិជិតស្និទ្ធ',
    'សហការីការងារ',
    'ភ្ញៀវទូទៅ',
  ];

  return (
    <div className="space-y-6">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-stone-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h2 className="font-moul text-xl text-gold-gradient mb-1">
            គ្រប់គ្រងបញ្ជីភ្ញៀវ (Guest List)
          </h2>
          <p className="text-xs text-stone-400">
            បង្កើតតំណភ្ជាប់អញ្ជើញផ្ទាល់ខ្លួន និងកំណត់ចំនួនភ្ញៀវដែលអាចចូលរួម
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-700"
            title="ទាញយកជាឯកសារ Excel/CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setImportText('');
              setFormError('');
              setIsImportModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-700"
            title="បញ្ចូលភ្ញៀវម្តងច្រើននាក់"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>បន្ថែមភ្ញៀវ</span>
          </button>
        </div>
      </div>

      {/* Active Wedding Template Indicator (Requirement 3: strict consistency) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-[#1a1612] to-[#141210] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/35 flex items-center justify-center text-amber-400 shrink-0">
            <FileCode2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-stone-300">
                Template សំបុត្រដែលភ្ញៀវទាំងអស់នឹងទទួលបាន៖
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
                {TEMPLATE_NAMES[wedding?.selectedTemplateId || 'tmpl-01'] || 'រាជរដ្ឋមង្គល'}
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                ({wedding?.selectedTemplateId || 'tmpl-01'})
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              សំបុត្រអញ្ជើញរបស់ភ្ញៀវគ្រប់ៗគ្នានឹងបង្ហាញតាមរចនាបថ Template នេះដូចគ្នាបេះបិទ
            </p>
          </div>
        </div>

        {onNavigateToTemplate && (
          <button
            onClick={onNavigateToTemplate}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ផ្លាស់ប្តូរ Template</span>
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-xl bg-[#141210] border border-stone-800 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ស្វែងរកតាមឈ្មោះ, លេខទូរស័ព្ទ ឬកូដ Token..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/40 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Group Filter */}
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-black/40 border border-stone-700 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
          >
            {groups.map((g) => (
              <option key={g} value={g}>
                {g === 'all' ? 'ក្រុមទាំងអស់' : g}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-black/40 border border-stone-700 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
          >
            <option value="all">ស្ថានភាពទាំងអស់</option>
            <option value="confirmed">បានបញ្ជាក់ (Confirmed)</option>
            <option value="declined">មិនចូលរួម (Declined)</option>
            <option value="maybe">មិនទាន់ច្បាស់ (Maybe)</option>
            <option value="not_responded">មិនទាន់ឆ្លើយតប</option>
          </select>

          <button
            onClick={loadGuests}
            className="p-2 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 transition-colors cursor-pointer border border-stone-700 shrink-0"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Guest Table */}
      <div className="rounded-2xl border border-stone-800 bg-[#141210] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181512] text-stone-400 border-b border-stone-800 font-medium">
              <tr>
                <th className="py-3.5 px-4">ឈ្មោះភ្ញៀវ (Guest Name)</th>
                <th className="py-3.5 px-3">ក្រុម (Group)</th>
                <th className="py-3.5 px-3">ទំនាក់ទំនង</th>
                <th className="py-3.5 px-3 text-center">អនុញ្ញាត (Allowed)</th>
                <th className="py-3.5 px-3">ស្ថានភាពវត្តមាន</th>
                <th className="py-3.5 px-4">តំណភ្ជាប់ផ្ទាល់ខ្លួន (Unique Link)</th>
                <th className="py-3.5 px-3 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {guests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                        <span>កំពុងផ្ទុកទិន្នន័យ...</span>
                      </div>
                    ) : (
                      'មិនមានទិន្នន័យភ្ញៀវត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ។'
                    )}
                  </td>
                </tr>
              ) : (
                guests.map((g) => (
                  <tr key={g.id} className="hover:bg-stone-900/50 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-100 text-sm">
                        {g.fullName}
                      </div>
                      <div className="text-[11px] text-stone-400 font-mono">
                        ID: {g.id}
                      </div>
                    </td>

                    {/* Group */}
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 text-[11px] border border-stone-700">
                        {g.group}
                      </span>
                    </td>

                    {/* Phone / Email */}
                    <td className="py-3.5 px-3 text-stone-300">
                      <div>{g.phone || '—'}</div>
                      {g.email && <div className="text-[11px] text-stone-400">{g.email}</div>}
                    </td>

                    {/* Allowed */}
                    <td className="py-3.5 px-3 text-center font-bold text-amber-300 font-mono">
                      {g.allowedGuests} នាក់
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {g.attendanceStatus === 'confirmed' && (
                        <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>បានបញ្ជាក់ (Yes)</span>
                        </span>
                      )}
                      {g.attendanceStatus === 'declined' && (
                        <span className="text-[11px] font-medium text-rose-400 flex items-center gap-1">
                          <X className="w-3.5 h-3.5" />
                          <span>មិនចូលរួម (No)</span>
                        </span>
                      )}
                      {g.attendanceStatus === 'maybe' && (
                        <span className="text-[11px] font-medium text-amber-400">
                          មិនទាន់ច្បាស់ (?)
                        </span>
                      )}
                      {g.attendanceStatus === 'not_responded' && (
                        <span className="text-[11px] text-stone-400">
                          {g.invitationStatus === 'opened' ? 'បានបើកមើល (Opened)' : 'មិនទាន់ឆ្លើយតប'}
                        </span>
                      )}
                    </td>

                    {/* Unique Link & Copy */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] text-amber-200/80 bg-black/60 px-2 py-1 rounded border border-stone-800 max-w-[140px] truncate">
                          /?token={g.invitationToken}
                        </span>

                        <button
                          onClick={() => handleCopyLink(g.invitationToken)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-200 transition-colors cursor-pointer border border-stone-700"
                          title="ចម្លងតំណភ្ជាប់"
                        >
                          {copiedToken === g.invitationToken ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => onOpenGuestInvitation(g.invitationToken)}
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors cursor-pointer border border-amber-500/30"
                          title="បើកទស្សនាជាភ្ញៀវនេះ"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(g)}
                          className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                          title="កែប្រែ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setGuestToDelete(g)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="លុបភ្ញៀវ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Guest Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#141210] rounded-2xl border border-amber-500/30 p-6 shadow-2xl">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-moul text-base text-gold-gradient mb-1">
              បន្ថែមភ្ញៀវកិត្តិយសថ្មី
            </h3>
            <p className="text-xs text-stone-400 mb-5">
              ប្រព័ន្ធនឹងបង្កើត Unique Invitation Link ដោយស្វ័យប្រវត្តិ
            </p>

            {formError && (
              <div className="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateGuest} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  គោត្តនាម និងនាម / ងារកិត្តិយស <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="ឧ. ឯកឧត្តម... / លោកជំទាវ... / លោក សុខ"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  លេខទូរស័ព្ទ / Telegram
                </label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="012 xxx xxx"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  អ៊ីមែល (ប្រសិនបើមាន)
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="guest@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    ក្រុមភ្ញៀវ (Group)
                  </label>
                  <select
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="ភ្ញៀវកិត្តិយស (VIP)">ភ្ញៀវកិត្តិយស (VIP)</option>
                    <option value="សាច់ញាតិខាងកូនប្រុស">សាច់ញាតិខាងកូនប្រុស</option>
                    <option value="សាច់ញាតិខាងកូនស្រី">សាច់ញាតិខាងកូនស្រី</option>
                    <option value="មិត្តភក្តិជិតស្និទ្ធ">មិត្តភក្តិជិតស្និទ្ធ</option>
                    <option value="សហការីការងារ">សហការីការងារ</option>
                    <option value="ភ្ញៀវទូទៅ">ភ្ញៀវទូទៅ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    ចំនួនភ្ញៀវអនុញ្ញាត
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formAllowed}
                    onChange={(e) => setFormAllowed(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-semibold hover:from-amber-300 hover:to-amber-400 shadow-md"
                >
                  រក្សាទុក
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Guest Modal */}
      {isEditModalOpen && selectedGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#141210] rounded-2xl border border-amber-500/30 p-6 shadow-2xl">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-moul text-base text-gold-gradient mb-1">
              កែប្រែព័ត៌មានភ្ញៀវ
            </h3>
            <p className="text-xs text-stone-400 mb-5">ID: {selectedGuest.id}</p>

            <form onSubmit={handleUpdateGuest} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  គោត្តនាម និងនាម / ងារកិត្តិយស
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">លេខទូរស័ព្ទ</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">ក្រុមភ្ញៀវ</label>
                  <select
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="ភ្ញៀវកិត្តិយស (VIP)">ភ្ញៀវកិត្តិយស (VIP)</option>
                    <option value="សាច់ញាតិខាងកូនប្រុស">សាច់ញាតិខាងកូនប្រុស</option>
                    <option value="សាច់ញាតិខាងកូនស្រី">សាច់ញាតិខាងកូនស្រី</option>
                    <option value="មិត្តភក្តិជិតស្និទ្ធ">មិត្តភក្តិជិតស្និទ្ធ</option>
                    <option value="សហការីការងារ">សហការីការងារ</option>
                    <option value="ភ្ញៀវទូទៅ">ភ្ញៀវទូទៅ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    ចំនួនភ្ញៀវអនុញ្ញាត
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formAllowed}
                    onChange={(e) => setFormAllowed(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => handleRegenerateToken(selectedGuest.id)}
                  className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>បង្កើត Token ថ្មី</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-semibold"
                  >
                    កែប្រែ
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Guests Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#141210] rounded-2xl border border-amber-500/30 p-6 shadow-2xl">
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-moul text-base text-gold-gradient mb-1">
              Import បញ្ជីភ្ញៀវ (Bulk Import)
            </h3>
            <p className="text-xs text-stone-400 mb-3">
              បញ្ចូលទិន្នន័យភ្ញៀវមួយជួរម្នាក់តាមទម្រង់៖ <br />
              <code className="text-amber-300 font-mono text-[11px]">
                ឈ្មោះ, លេខទូរស័ព្ទ, ក្រុម, ចំនួនអនុញ្ញាត
              </code>
            </p>

            <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
              <textarea
                rows={6}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={`ឧទាហរណ៍៖\nលោកជំទាវ សុផល, 012333444, ភ្ញៀវកិត្តិយស (VIP), 2\nលោក ប៊ុនរ៉ុង និងភរិយា, 017888999, សាច់ញាតិខាងកូនប្រុស, 3\nកញ្ញា ម៉ារី, 085111222, មិត្តភក្តិ, 1`}
                className="w-full p-3 rounded-xl bg-black/50 border border-stone-700 text-stone-100 font-mono text-xs focus:outline-none focus:border-amber-400"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-semibold"
                >
                  ចាប់ផ្តើម Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Guest Confirmation Modal (Non-blocking in-app modal) */}
      {guestToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#161210] rounded-2xl border border-rose-500/40 p-6 shadow-2xl text-stone-100 font-kantumruy">
            <button
              onClick={() => setGuestToDelete(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-moul text-base text-center text-rose-400 mb-2">
              លុបភ្ញៀវចេញពីបញ្ជី
            </h3>

            <p className="text-xs text-stone-300 text-center mb-6 leading-relaxed">
              តើអ្នកពិតជាចង់លុបភ្ញៀវ <strong className="text-amber-300">"{guestToDelete.fullName}"</strong> ({guestToDelete.group}) ចេញពីបញ្ជីមែនទេ? <br />
              <span className="text-rose-400 text-[11px] block mt-1">
                តំណភ្ជាប់ផ្ទាល់ខ្លួន និងទិន្នន័យឆ្លើយតបរបស់ភ្ញៀវនេះនឹងត្រូវលុបជាអចិន្ត្រៃយ៍។
              </span>
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setGuestToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
              >
                បោះបង់ (Cancel)
              </button>
              <button
                type="button"
                onClick={confirmDeleteGuest}
                disabled={deleting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-900/40 cursor-pointer flex items-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>កំពុងលុប...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>បញ្ជាក់លុបភ្ញៀវ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
