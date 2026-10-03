import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle2, GlassWater, Sparkles, Download, ExternalLink } from 'lucide-react';
import { WEDDING_SCHEDULE } from '../data/weddingData';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

export const ScheduleSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'evening' | 'morning'>('all');

  const morningIds = ['procession', 'monk-blessing', 'haircut', 'family-lunch'];
  const eveningIds = ['evening-welcome', 'evening-dinner', 'evening-cake', 'evening-dance'];

  const filteredItems = WEDDING_SCHEDULE.filter((item) => {
    if (filter === 'morning') return morningIds.includes(item.id);
    if (filter === 'evening') return eveningIds.includes(item.id);
    return true;
  });

  return (
    <section id="schedule-section" className="py-14 md:py-20 border-t border-stone-800/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs font-medium mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>ពេលវេលា និងកម្មវិធីលម្អិត</span>
          </div>
          <h2 className="font-moul text-xl sm:text-2xl text-gold-gradient mb-3">
            កាលវិភាគពិធីមង្គលការ & ពិធីជប់លៀង
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            សូមគោរពអញ្ជើញលោកអ្នកអញ្ជើញចូលរួមតាមពេលវេលា និងកម្មវិធីដូចខាងក្រោម
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 p-1.5 bg-[#141210] rounded-xl border border-stone-800 max-w-md mx-auto mb-10">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            កម្មវិធីទាំងអស់
          </button>
          <button
            onClick={() => setFilter('evening')}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              filter === 'evening'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            ពិធីជប់លៀងពេលល្ងាច
          </button>
          <button
            onClick={() => setFilter('morning')}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              filter === 'morning'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            ពិធីប្រពៃណីពេលព្រឹក
          </button>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 sm:pl-8 border-l border-amber-500/30 space-y-8 my-8 ml-3 sm:ml-6">
          {filteredItems.map((item) => {
            const isEvening = eveningIds.includes(item.id);
            return (
              <div key={item.id} className="relative group">
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                    isEvening
                      ? 'bg-amber-400 border-amber-300 text-stone-950 shadow-md shadow-amber-500/30'
                      : 'bg-[#181512] border-amber-500/40 text-amber-400'
                  }`}
                >
                  {isEvening ? (
                    <Sparkles className="w-3 h-3" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </div>

                {/* Timeline Card */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    isEvening
                      ? 'bg-gradient-to-br from-[#1a1714] to-[#12100e] border-amber-500/40 shadow-lg shadow-amber-950/20'
                      : 'bg-[#13110f] border-stone-800/90'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        isEvening
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      {item.time} ({item.timeEnglish})
                    </span>

                    <span className="text-xs text-stone-400">{item.location}</span>
                  </div>

                  <h3 className="font-moul text-base text-stone-100 mb-1">
                    {item.titleKhmer}
                  </h3>
                  <p className="text-xs text-stone-400 mb-2 font-cinzel">
                    {item.titleEnglish}
                  </p>

                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {item.descriptionKhmer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add to Calendar Actions */}
        <div className="mt-12 p-6 rounded-2xl bg-[#141210] border border-amber-500/30 text-center max-w-xl mx-auto">
          <Calendar className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <h4 className="font-medium text-stone-200 text-sm mb-1">
            កុំភ្លេចកត់ចំណាំថ្ងៃមង្គលក្នុងប្រតិទិនរបស់អ្នក
          </h4>
          <p className="text-xs text-stone-400 mb-4">
            ថ្ងៃអាទិត្យ ទី១៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦ វេលាម៉ោង ០៥:០០ ល្ងាច
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-amber-500 text-stone-950 hover:bg-amber-400 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>បន្ថែមទៅ Google Calendar</span>
            </a>

            <button
              onClick={downloadIcsFile}
              className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ទាញយក Apple / Outlook (.ics)</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
