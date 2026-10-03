import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Search,
  RefreshCw,
  Edit3,
  UserCheck,
  Utensils,
  MessageSquare,
  X,
  Check,
} from 'lucide-react';
import { AttendanceRecord, api } from '../../services/api';
import { toKhmerNumber } from '../../utils/khmerNumerals';

export const AttendanceTab: React.FC = () => {
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [responseFilter, setResponseFilter] = useState('all');

  // Edit Modal
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState<string>('confirmed');
  const [editCount, setEditCount] = useState<number>(1);
  const [editNote, setEditNote] = useState<string>('');

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const data = await api.getAttendance({
        search: search.trim() || undefined,
        response: responseFilter !== 'all' ? responseFilter : undefined,
      });
      setAttendanceList(data);
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [responseFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAttendance();
  };

  const handleOpenEdit = (rec: AttendanceRecord) => {
    setEditingRecord(rec);
    setEditStatus(rec.attendanceStatus);
    setEditCount(rec.confirmedCount || rec.allowedGuests || 1);
    setEditNote(rec.rsvp?.message || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    try {
      await api.updateAttendance(editingRecord.guestId, {
        attendanceStatus: editStatus,
        guestCount: editStatus === 'confirmed' ? Number(editCount) : 0,
        note: editNote,
      });
      setEditingRecord(null);
      loadAttendance();
    } catch (err) {
      alert('Failed to update attendance');
    }
  };

  // Summaries
  const totalInvited = attendanceList.length;
  const totalResponded = attendanceList.filter((a) => a.attendanceStatus !== 'not_responded').length;
  const totalConfirmed = attendanceList.filter((a) => a.attendanceStatus === 'confirmed').length;
  const totalDeclined = attendanceList.filter((a) => a.attendanceStatus === 'declined').length;
  const totalPending = attendanceList.filter((a) => a.attendanceStatus === 'not_responded').length;
  const totalExpectedHeadcount = attendanceList
    .filter((a) => a.attendanceStatus === 'confirmed')
    .reduce((sum, a) => sum + (a.confirmedCount || 1), 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h2 className="font-moul text-xl text-gold-gradient mb-1">
            ការឆ្លើយតបវត្តមាន (Attendance & RSVPs)
          </h2>
          <p className="text-xs text-stone-400">
            បញ្ជីភ្ញៀវដែលបានឆ្លើយតបតាមរយៈតំណភ្ជាប់អញ្ជើញ និងកត់ត្រាចំនួនមនុស្សពិតប្រាកដ
          </p>
        </div>

        <button
          onClick={loadAttendance}
          className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1.5 cursor-pointer border border-stone-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>ធ្វើបច្ចុប្បន្នភាព</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="p-3.5 rounded-xl bg-[#141210] border border-stone-800">
          <span className="text-[11px] text-stone-400 block mb-1">អញ្ជើញសរុប</span>
          <span className="font-moul text-lg text-stone-100">
            {toKhmerNumber(totalInvited)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#141210] border border-stone-800">
          <span className="text-[11px] text-stone-400 block mb-1">បានឆ្លើយតប</span>
          <span className="font-moul text-lg text-sky-400">
            {toKhmerNumber(totalResponded)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#141210] border border-emerald-500/30">
          <span className="text-[11px] text-emerald-400 block mb-1">នឹងចូលរួម (Yes)</span>
          <span className="font-moul text-lg text-emerald-300">
            {toKhmerNumber(totalConfirmed)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#141210] border border-rose-500/30">
          <span className="text-[11px] text-rose-400 block mb-1">មិនចូលរួម (No)</span>
          <span className="font-moul text-lg text-rose-300">
            {toKhmerNumber(totalDeclined)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#141210] border border-stone-800">
          <span className="text-[11px] text-stone-400 block mb-1">រង់ចាំឆ្លើយតប</span>
          <span className="font-moul text-lg text-stone-400">
            {toKhmerNumber(totalPending)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#1c1813] to-[#12100e] border border-amber-500/40">
          <span className="text-[11px] text-amber-300 block mb-1 font-medium">ចំនួនភ្ញៀវរំពឹងទុក</span>
          <span className="font-moul text-lg text-gold-gradient">
            {toKhmerNumber(totalExpectedHeadcount)} នាក់
          </span>
        </div>

      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-[#141210] border border-stone-800 flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ស្វែងរកតាមឈ្មោះភ្ញៀវ ឬលេខទូរស័ព្ទ..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/40 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={responseFilter}
            onChange={(e) => setResponseFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-black/40 border border-stone-700 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
          >
            <option value="all">ការឆ្លើយតបទាំងអស់</option>
            <option value="confirmed">ចូលរួម (Confirmed)</option>
            <option value="declined">មិនចូលរួម (Declined)</option>
            <option value="maybe">មិនទាន់ច្បាស់ (Maybe)</option>
            <option value="not_responded">មិនទាន់ឆ្លើយតប (Pending)</option>
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="rounded-2xl border border-stone-800 bg-[#141210] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181512] text-stone-400 border-b border-stone-800 font-medium">
              <tr>
                <th className="py-3.5 px-4">ឈ្មោះភ្ញៀវ (Guest Name)</th>
                <th className="py-3.5 px-3">សំបុត្រអញ្ជើញ</th>
                <th className="py-3.5 px-3">ការឆ្លើយតប (Response)</th>
                <th className="py-3.5 px-3 text-center">ចំនួនភ្ញៀវ (Headcount)</th>
                <th className="py-3.5 px-3">ចំណង់ចំណូលចិត្ត & សារ</th>
                <th className="py-3.5 px-3">កាលបរិច្ឆេទឆ្លើយតប</th>
                <th className="py-3.5 px-3 text-right">កែប្រែ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {attendanceList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    មិនមានទិន្នន័យត្រូវនឹងការស្វែងរកទេ។
                  </td>
                </tr>
              ) : (
                attendanceList.map((item) => (
                  <tr key={item.guestId} className="hover:bg-stone-900/50 transition-colors">
                    {/* Guest Name & Group */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-100 text-sm">
                        {item.guestName}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        {item.group} · {item.phone || 'គ្មានលេខ'}
                      </div>
                    </td>

                    {/* Invitation Status */}
                    <td className="py-3.5 px-3">
                      {item.invitationStatus === 'opened' ? (
                        <span className="text-[11px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                          បានបើកមើល (Opened)
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
                          បានផ្ញើ (Sent)
                        </span>
                      )}
                    </td>

                    {/* Response */}
                    <td className="py-3.5 px-3">
                      {item.attendanceStatus === 'confirmed' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>នឹងចូលរួម</span>
                        </span>
                      )}
                      {item.attendanceStatus === 'declined' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>មិនចូលរួម</span>
                        </span>
                      )}
                      {item.attendanceStatus === 'maybe' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>មិនទាន់ច្បាស់</span>
                        </span>
                      )}
                      {item.attendanceStatus === 'not_responded' && (
                        <span className="text-[11px] text-stone-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>រង់ចាំឆ្លើយតប</span>
                        </span>
                      )}
                    </td>

                    {/* Headcount */}
                    <td className="py-3.5 px-3 text-center">
                      {item.attendanceStatus === 'confirmed' ? (
                        <span className="font-bold text-amber-300 font-mono text-sm">
                          {item.confirmedCount} <span className="text-[11px] text-stone-400">/ {item.allowedGuests}</span>
                        </span>
                      ) : (
                        <span className="text-stone-500 font-mono">0 / {item.allowedGuests}</span>
                      )}
                    </td>

                    {/* Note & Dietary */}
                    <td className="py-3.5 px-3 max-w-[200px]">
                      {item.rsvp ? (
                        <div>
                          {item.rsvp.dietaryPreference && item.rsvp.dietaryPreference !== 'standard' && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded mr-1">
                              {item.rsvp.dietaryPreference === 'vegetarian' ? 'បួស' : 'ហាឡាល'}
                            </span>
                          )}
                          <span className="text-[11px] text-stone-300 truncate block">
                            {item.rsvp.message || 'គ្មានសារ'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-stone-600">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-3 text-[11px] text-stone-400">
                      {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('km-KH') : '—'}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-200 transition-colors cursor-pointer border border-stone-700"
                        title="កែប្រែស្ថានភាព"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Attendance Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#141210] rounded-2xl border border-amber-500/30 p-6 shadow-2xl">
            <button
              onClick={() => setEditingRecord(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-moul text-base text-gold-gradient mb-1">
              កែប្រែស្ថានភាពវត្តមាន (Attendance Override)
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              ភ្ញៀវ៖ <strong className="text-amber-200">{editingRecord.guestName}</strong> (អនុញ្ញាត {editingRecord.allowedGuests} នាក់)
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  ស្ថានភាពវត្តមាន (Response Status)
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="confirmed">បានបញ្ជាក់ «នឹងចូលរួម» (Confirmed)</option>
                  <option value="declined">មិនអាចចូលរួម (Declined)</option>
                  <option value="maybe">មិនទាន់ច្បាស់ (Maybe)</option>
                  <option value="not_responded">មិនទាន់ឆ្លើយតប (Pending)</option>
                </select>
              </div>

              {editStatus === 'confirmed' && (
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    ចំនួនភ្ញៀវជាក់ស្តែង (Headcount) - អតិបរមា {editingRecord.allowedGuests} នាក់
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={editingRecord.allowedGuests}
                    value={editCount}
                    onChange={(e) => setEditCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  កំណត់ចំណាំ / សារជូនពរ
                </label>
                <textarea
                  rows={2}
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="ចំណាំបន្ថែមពីភ្ញៀវ..."
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-semibold"
                >
                  រក្សាទុក
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
