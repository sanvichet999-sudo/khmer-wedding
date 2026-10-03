import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckSquare,
  User,
  Users,
  Utensils,
  Phone,
  Send,
  CheckCircle2,
  Edit3,
  Heart,
  HelpCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { RsvpResponse } from '../types/fullstack';

interface RsvpSectionProps {
  initialGuestName: string;
  guestToken?: string;
  allowedGuests?: number;
  initialRsvp?: RsvpResponse | null;
  onRsvpSuccess: (response: 'yes' | 'no' | 'maybe', count: number) => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  initialGuestName,
  guestToken,
  allowedGuests = 2,
  initialRsvp,
  onRsvpSuccess,
}) => {
  const [guestName, setGuestName] = useState(initialGuestName);
  const [attendance, setAttendance] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [additionalNames, setAdditionalNames] = useState('');
  const [dietary, setDietary] = useState<'standard' | 'vegetarian' | 'halal' | 'none'>('standard');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [submittedRsvp, setSubmittedRsvp] = useState<RsvpResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync initial props
  useEffect(() => {
    if (initialGuestName) {
      setGuestName(initialGuestName);
    }
  }, [initialGuestName]);

  useEffect(() => {
    if (initialRsvp) {
      setSubmittedRsvp(initialRsvp);
      setAttendance(initialRsvp.response);
      setGuestCount(initialRsvp.guestCount || 1);
      setAdditionalNames(initialRsvp.additionalGuestNames || '');
      setDietary(initialRsvp.dietaryPreference || 'standard');
      setPhone(initialRsvp.phoneOrTelegram || '');
      setNote(initialRsvp.message || '');
    }
  }, [initialRsvp]);

  const maxAllowed = Math.max(1, allowedGuests);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMsg('សូមមេត្តាបញ្ចូលឈ្មោះរបស់លោកអ្នក');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      if (guestToken) {
        // Real API submission
        const res = await api.submitRsvp(guestToken, {
          response: attendance,
          guestCount: attendance === 'yes' ? Math.min(guestCount, maxAllowed) : 0,
          additionalGuestNames: additionalNames.trim(),
          dietaryPreference: dietary,
          phoneOrTelegram: phone.trim(),
          message: note.trim(),
        });

        setSubmittedRsvp(res.rsvp);
      } else {
        // Fallback local response
        const fallbackRsvp: RsvpResponse = {
          id: 'rsvp-' + Date.now(),
          guestId: 'guest-local',
          guestName: guestName.trim(),
          response: attendance,
          guestCount: attendance === 'yes' ? Math.min(guestCount, maxAllowed) : 0,
          additionalGuestNames: additionalNames.trim(),
          dietaryPreference: dietary,
          phoneOrTelegram: phone.trim(),
          message: note.trim(),
          submittedAt: new Date().toISOString(),
        };
        setSubmittedRsvp(fallbackRsvp);
      }

      setIsEditing(false);

      if (attendance === 'yes') {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.7 },
          colors: ['#D4AF37', '#E5C07B', '#FFFFFF', '#F43F5E'],
        });
      }

      onRsvpSuccess(attendance, attendance === 'yes' ? guestCount : 0);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit RSVP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <section id="rsvp-section" className="py-14 md:py-20 border-t border-stone-800/80 relative">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs font-medium mb-3">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>ឆ្លើយតបការចូលរួម (RSVP)</span>
          </div>
          <h2 className="font-moul text-xl sm:text-2xl text-gold-gradient mb-3">
            ឆ្លើយតបការអញ្ជើញ
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            ដើម្បីភាពងាយស្រួលក្នុងការរៀបចំតុ និងទទួលបដិសណ្ឋារកិច្ចឱ្យបានល្អប្រសើរបំផុត
          </p>
        </div>

        {/* If already submitted and not editing, show ticket badge */}
        {submittedRsvp && !isEditing ? (
          <div className="p-7 rounded-2xl bg-gradient-to-b from-[#181512] to-[#12100e] border border-amber-500/40 shadow-2xl shadow-amber-950/30 text-center relative overflow-hidden">
            
            <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-4">
              {submittedRsvp.response === 'yes' && <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
              {submittedRsvp.response === 'no' && <XCircle className="w-8 h-8 text-rose-400" />}
              {submittedRsvp.response === 'maybe' && <HelpCircle className="w-8 h-8 text-amber-400" />}
            </div>

            <h3 className="font-moul text-lg text-gold-gradient mb-1">
              {submittedRsvp.response === 'yes' && 'អរគុណសម្រាប់ការឆ្លើយតប «ចូលរួម»!'}
              {submittedRsvp.response === 'no' && 'សូមអរគុណសម្រាប់ការជូនដំណឹង'}
              {submittedRsvp.response === 'maybe' && 'បានកត់ត្រា៖ មិនទាន់ប្រាកដ'}
            </h3>

            <p className="text-xs text-stone-300 mb-6">
              {submittedRsvp.response === 'yes' && 'យើងខ្ញុំទន្ទឹងរង់ចាំទទួលស្វាគមន៍វត្តមានដ៏ឧត្តុង្គឧត្តមរបស់លោកអ្នក'}
              {submittedRsvp.response === 'no' && 'ទោះបីមិនបានចូលរួមផ្ទាល់ ក៏សូមអរគុណនូវក្តីស្រឡាញ់ និងការជូនពរ'}
              {submittedRsvp.response === 'maybe' && 'លោកអ្នកអាចកែប្រែការឆ្លើយតបនៅពេលក្រោយបាន'}
            </p>

            {/* Ticket Summary Box */}
            <div className="p-4 rounded-xl bg-black/40 border border-stone-800 text-left space-y-2.5 text-xs text-stone-300 mb-6">
              <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                <span className="text-stone-400">ឈ្មោះភ្ញៀវ៖</span>
                <span className="font-semibold text-amber-200">{submittedRsvp.guestName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                <span className="text-stone-400">ស្ថានភាព៖</span>
                <span
                  className={`font-semibold ${
                    submittedRsvp.response === 'yes'
                      ? 'text-emerald-400'
                      : submittedRsvp.response === 'no'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}
                >
                  {submittedRsvp.response === 'yes' && '✓ នឹងចូលរួម (Attending)'}
                  {submittedRsvp.response === 'no' && '✗ មិនអាចចូលរួម (Declined)'}
                  {submittedRsvp.response === 'maybe' && '? មិនទាន់ប្រាកដ (Maybe)'}
                </span>
              </div>

              {submittedRsvp.response === 'yes' && (
                <>
                  <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                    <span className="text-stone-400">ចំនួនអ្នកចូលរួម៖</span>
                    <span className="font-semibold text-stone-100">
                      {submittedRsvp.guestCount} នាក់ (ពីចំណោមអនុញ្ញាត {maxAllowed} នាក់)
                    </span>
                  </div>

                  {submittedRsvp.additionalGuestNames && (
                    <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                      <span className="text-stone-400">អ្នករួមដំណើរ៖</span>
                      <span className="text-stone-100">{submittedRsvp.additionalGuestNames}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                    <span className="text-stone-400">ប្រភេទម្ហូប៖</span>
                    <span className="text-stone-100">
                      {submittedRsvp.dietaryPreference === 'standard' && 'អាហារទូទៅ'}
                      {submittedRsvp.dietaryPreference === 'vegetarian' && 'អាហារបួស (Vegetarian)'}
                      {submittedRsvp.dietaryPreference === 'halal' && 'អាហារហាឡាល (Halal)'}
                    </span>
                  </div>
                </>
              )}

              {submittedRsvp.phoneOrTelegram && (
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">ទំនាក់ទំនង៖</span>
                  <span className="text-stone-100">{submittedRsvp.phoneOrTelegram}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors cursor-pointer border border-stone-700"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>កែប្រែព័ត៌មានឆ្លើយតប</span>
            </button>
          </div>
        ) : (
          /* RSVP Form */
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-2xl bg-[#141210] border border-amber-500/30 shadow-xl space-y-6"
          >
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Guest Name & Allowed Banner */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-400 block text-[11px]">សំបុត្រអញ្ជើញសម្រាប់៖</span>
                <span className="font-moul text-amber-200 text-sm">{guestName}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 block">កៅអីអនុញ្ញាត (Allowed)</span>
                <span className="font-mono font-bold text-amber-300 text-sm">{maxAllowed} នាក់</span>
              </div>
            </div>

            {/* Attendance Choice: ចូលរួម / មិនអាចចូលរួម / មិនទាន់ប្រាកដ */}
            <div>
              <label className="block text-xs font-medium text-amber-300 mb-2">
                តើលោកអ្នកអាចចូលរួមក្នុងពិធីមង្គលការដែរឬទេ? <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAttendance('yes')}
                  className={`py-3 px-2 rounded-xl border text-xs font-medium transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    attendance === 'yes'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm'
                      : 'bg-black/30 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${attendance === 'yes' ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                  <span>ចូលរួម (Yes)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendance('no')}
                  className={`py-3 px-2 rounded-xl border text-xs font-medium transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    attendance === 'no'
                      ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-sm'
                      : 'bg-black/30 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  <span>មិនអាចចូលរួម</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendance('maybe')}
                  className={`py-3 px-2 rounded-xl border text-xs font-medium transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    attendance === 'maybe'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                      : 'bg-black/30 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>មិនទាន់ប្រាកដ</span>
                </button>
              </div>
            </div>

            {/* Conditional fields if attending */}
            {attendance === 'yes' && (
              <>
                {/* Guest Count Constraint enforced by allowedGuests */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium text-amber-300">
                      ចំនួនអ្នកចូលរួមជាក់ស្តែង (រួមទាំងលោកអ្នក)
                    </label>
                    <span className="text-[11px] text-stone-400 font-mono">
                      (អតិបរមា {maxAllowed} នាក់)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: maxAllowed }, (_, i) => i + 1).map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setGuestCount(cnt)}
                        className={`flex-1 py-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                          guestCount === cnt
                            ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md'
                            : 'bg-black/40 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        {cnt} នាក់
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Guest Names if > 1 */}
                {guestCount > 1 && (
                  <div>
                    <label className="block text-xs font-medium text-amber-300 mb-1">
                      ឈ្មោះអ្នកចូលរួមបន្ថែម (Additional Guests)
                    </label>
                    <input
                      type="text"
                      value={additionalNames}
                      onChange={(e) => setAdditionalNames(e.target.value)}
                      placeholder="ឧ. ភរិយា និងកូនស្រី..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {/* Dietary Preference */}
                <div>
                  <label className="block text-xs font-medium text-amber-300 mb-2">
                    ចំណង់ចំណូលចិត្តមុខម្ហូប (Dietary Preference)
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setDietary('standard')}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                        dietary === 'standard'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : 'bg-black/40 border-stone-800 text-stone-400'
                      }`}
                    >
                      អាហារទូទៅ
                    </button>
                    <button
                      type="button"
                      onClick={() => setDietary('vegetarian')}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                        dietary === 'vegetarian'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : 'bg-black/40 border-stone-800 text-stone-400'
                      }`}
                    >
                      អាហារបួស (Vegetarian)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDietary('halal')}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                        dietary === 'halal'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : 'bg-black/40 border-stone-800 text-stone-400'
                      }`}
                    >
                      អាហារហាឡាល (Halal)
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Phone or Telegram */}
            <div>
              <label className="block text-xs font-medium text-amber-300 mb-1">
                លេខទូរស័ព្ទ ឬ Telegram សម្រាប់ទាក់ទង
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="012 xxx xxx"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Note / Blessing */}
            <div>
              <label className="block text-xs font-medium text-amber-300 mb-1">
                ពាក្យពេចន៍ផ្តាំផ្ញើ ឬសារជូនពរ
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="សរសេរពាក្យជូនពរដល់គូស្វាមីភរិយាថ្មី..."
                className="w-full p-3 rounded-xl bg-black/40 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-semibold text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>កំពុងបញ្ជាក់...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>បញ្ជាក់ការឆ្លើយតប (Confirm RSVP)</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </section>
  );
};
