import React, { useState, useEffect } from 'react';
import {
  Users,
  Send,
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Gift,
  Plus,
  RefreshCw,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { DashboardStats } from '../../types/fullstack';
import { api } from '../../services/api';
import { toKhmerNumber } from '../../utils/khmerNumerals';

interface DashboardTabProps {
  onNavigateToGuests: () => void;
  onNavigateToAttendance: () => void;
  onNavigateToTemplate: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  onNavigateToGuests,
  onNavigateToAttendance,
  onNavigateToTemplate,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getStats();
      setStats(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-stone-400">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mb-3" />
        <p className="text-xs">កំពុងផ្ទុកទិន្នន័យស្ថិតិ...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center bg-rose-500/10 border border-rose-500/30 rounded-2xl max-w-lg mx-auto">
        <p className="text-xs text-rose-300 mb-3">{error || 'Something went wrong.'}</p>
        <button
          onClick={loadStats}
          className="px-4 py-2 rounded-lg bg-stone-800 text-stone-200 text-xs font-medium hover:bg-stone-700 cursor-pointer"
        >
          ព្យាយាមម្តងទៀត
        </button>
      </div>
    );
  }

  const responseRate = stats.totalGuests > 0
    ? Math.round(((stats.totalConfirmed + stats.totalDeclined + stats.totalMaybe) / stats.totalGuests) * 100)
    : 0;

  const openRate = stats.totalGuests > 0
    ? Math.round((stats.totalGuestsOpenedLink / stats.totalGuests) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <h2 className="font-moul text-xl text-gold-gradient mb-1">
            ផ្ទាំងទិន្នន័យសង្ខេប (Wedding Dashboard)
          </h2>
          <p className="text-xs text-stone-400">
            ត្រួតពិនិត្យចំនួនភ្ញៀវ ការបើកមើលសំបុត្រ និងការឆ្លើយតបវត្តមានក្នុងពេលជាក់ស្តែង
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadStats}
            className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-700"
            title="ទាញយកទិន្នន័យថ្មី"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ធ្វើបច្ចុប្បន្នភាព</span>
          </button>

          <button
            onClick={onNavigateToGuests}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>បន្ថែមភ្ញៀវថ្មី</span>
          </button>
        </div>
      </div>

      {/* Primary Statistic Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Guests */}
        <div
          onClick={onNavigateToGuests}
          className="p-5 rounded-2xl bg-[#141210] border border-amber-500/30 hover:border-amber-400/60 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">ភ្ញៀវក្នុងបញ្ជីសរុប</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-moul text-2xl sm:text-3xl text-stone-100 tabular-nums">
              {toKhmerNumber(stats.totalGuests)}
            </span>
            <span className="text-xs text-stone-400 font-mono">({stats.totalGuests})</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-2 block">
            សំបុត្រអញ្ជើញក្នុងប្រព័ន្ធ
          </span>
        </div>

        {/* Invitations Sent / Opened */}
        <div className="p-5 rounded-2xl bg-[#141210] border border-stone-800 hover:border-sky-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">បានបើកមើល Link</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-moul text-2xl sm:text-3xl text-sky-300 tabular-nums">
              {toKhmerNumber(stats.totalGuestsOpenedLink)}
            </span>
            <span className="text-xs text-stone-400 font-mono">({openRate}%)</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-2 block">
            បានផ្ញើ៖ {toKhmerNumber(stats.totalInvitationsSent)} នាក់
          </span>
        </div>

        {/* Confirmed Attending */}
        <div
          onClick={onNavigateToAttendance}
          className="p-5 rounded-2xl bg-[#141210] border border-emerald-500/30 hover:border-emerald-400/60 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">បានបញ្ជាក់ «ចូលរួម»</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-moul text-2xl sm:text-3xl text-emerald-400 tabular-nums">
              {toKhmerNumber(stats.totalConfirmed)}
            </span>
            <span className="text-xs text-stone-400 font-mono">({stats.totalConfirmed})</span>
          </div>
          <span className="text-[11px] text-emerald-400/90 mt-2 block font-medium">
            អត្រាឆ្លើយតប៖ {responseRate}%
          </span>
        </div>

        {/* Total Expected Headcount */}
        <div
          onClick={onNavigateToAttendance}
          className="p-5 rounded-2xl bg-gradient-to-br from-[#1c1813] to-[#12100e] border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">មនុស្សរំពឹងទុកចូលរួម</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-moul text-2xl sm:text-3xl text-gold-gradient tabular-nums">
              {toKhmerNumber(stats.totalExpectedAttendees)}
            </span>
            <span className="text-xs text-stone-400 font-mono">នាក់ ({stats.totalExpectedAttendees})</span>
          </div>
          <span className="text-[11px] text-amber-300/80 mt-2 block">
            គណនាតាមចំនួនកៅអីបញ្ជាក់
          </span>
        </div>

      </div>

      {/* Secondary Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Not Attending */}
        <div className="p-4 rounded-xl bg-[#141210] border border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-stone-400 block">មិនអាចចូលរួម</span>
              <span className="font-moul text-base text-rose-300">
                {toKhmerNumber(stats.totalDeclined)} នាក់
              </span>
            </div>
          </div>
          <span className="text-xs text-stone-400 font-mono">{stats.totalDeclined}</span>
        </div>

        {/* Maybe / Undecided */}
        <div className="p-4 rounded-xl bg-[#141210] border border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-stone-400 block">មិនទាន់ប្រាកដ</span>
              <span className="font-moul text-base text-amber-300">
                {toKhmerNumber(stats.totalMaybe)} នាក់
              </span>
            </div>
          </div>
          <span className="text-xs text-stone-400 font-mono">{stats.totalMaybe}</span>
        </div>

        {/* Not Responded Yet */}
        <div className="p-4 rounded-xl bg-[#141210] border border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-stone-800 text-stone-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-stone-400 block">មិនទាន់ឆ្លើយតប</span>
              <span className="font-moul text-base text-stone-300">
                {toKhmerNumber(stats.totalNotResponded)} នាក់
              </span>
            </div>
          </div>
          <span className="text-xs text-stone-400 font-mono">{stats.totalNotResponded}</span>
        </div>

      </div>

      {/* Visual Progress Bar & Group Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Progress Overview Card */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#141210] border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-moul text-sm text-stone-200">
              វឌ្ឍនភាពនៃការឆ្លើយតបវត្តមាន
            </h3>
            <span className="text-xs text-amber-400 font-semibold">{responseRate}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 rounded-full bg-stone-900 overflow-hidden flex">
            <div
              style={{ width: `${stats.totalGuests > 0 ? (stats.totalConfirmed / stats.totalGuests) * 100 : 0}%` }}
              className="bg-emerald-500 h-full transition-all"
              title={`ចូលរួម: ${stats.totalConfirmed}`}
            />
            <div
              style={{ width: `${stats.totalGuests > 0 ? (stats.totalMaybe / stats.totalGuests) * 100 : 0}%` }}
              className="bg-amber-500 h-full transition-all"
              title={`មិនទាន់ប្រាកដ: ${stats.totalMaybe}`}
            />
            <div
              style={{ width: `${stats.totalGuests > 0 ? (stats.totalDeclined / stats.totalGuests) * 100 : 0}%` }}
              className="bg-rose-500 h-full transition-all"
              title={`មិនអាចចូលរួម: ${stats.totalDeclined}`}
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 pt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>បានបញ្ជាក់ ({stats.totalConfirmed})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>មិនទាន់ប្រាកដ ({stats.totalMaybe})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>មិនចូលរួម ({stats.totalDeclined})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-700" />
              <span>រង់ចាំឆ្លើយ ({stats.totalNotResponded})</span>
            </div>
          </div>
        </div>

        {/* Group Breakdown Card */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#141210] border border-stone-800 space-y-4">
          <h3 className="font-moul text-sm text-stone-200">
            ស្ថិតិតាមក្រុមភ្ញៀវ (Guest Groups)
          </h3>

          <div className="space-y-3">
            {stats.groupStats.map((grp) => {
              const pct = grp.count > 0 ? Math.round((grp.confirmed / grp.count) * 100) : 0;
              return (
                <div key={grp.group} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-300 font-medium">{grp.group}</span>
                    <span className="text-stone-400">
                      ចូលរួម {toKhmerNumber(grp.confirmed)} / {toKhmerNumber(grp.count)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-900 overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="bg-amber-400 h-full rounded-full transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div
          onClick={onNavigateToTemplate}
          className="p-5 rounded-2xl bg-[#141210] border border-stone-800 hover:border-amber-500/40 transition-all flex items-center justify-between cursor-pointer group"
        >
          <div>
            <h4 className="font-moul text-sm text-amber-200 mb-1 group-hover:text-amber-300">
              កែសម្រួល Wedding Template
            </h4>
            <p className="text-xs text-stone-400">
              ផ្លាស់ប្តូរអត្ថបទ, ពណ៌, រូបភាព និងបើក/បិទ Sections ជាមួយ Live Preview
            </p>
          </div>
          <span className="text-xs text-amber-400 group-hover:translate-x-1 transition-transform">
            កែប្រែ →
          </span>
        </div>

        <div
          onClick={onNavigateToAttendance}
          className="p-5 rounded-2xl bg-[#141210] border border-stone-800 hover:border-amber-500/40 transition-all flex items-center justify-between cursor-pointer group"
        >
          <div>
            <h4 className="font-moul text-sm text-amber-200 mb-1 group-hover:text-amber-300">
              គ្រប់គ្រងការឆ្លើយតប (Attendance Table)
            </h4>
            <p className="text-xs text-stone-400">
              មើលលម្អិតចំនួនភ្ញៀវ, ប្រភេទម្ហូប និងសារជូនពរដែលបានផ្ញើ
            </p>
          </div>
          <span className="text-xs text-amber-400 group-hover:translate-x-1 transition-transform">
            មើលបញ្ជី →
          </span>
        </div>
      </div>
    </div>
  );
};
