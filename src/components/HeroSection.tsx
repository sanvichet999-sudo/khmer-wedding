import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckSquare, Heart, Sparkles } from 'lucide-react';
import { WEDDING_DETAILS } from '../data/weddingData';
import { toKhmerNumber } from '../utils/khmerNumerals';
import { WeddingEvent } from '../types/fullstack';

interface HeroSectionProps {
  guestName: string;
  wedding?: WeddingEvent;
  onOpenRsvp: () => void;
  onViewLocation: () => void;
  onOpenImageModal: (src: string, alt: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  guestName,
  wedding,
  onOpenRsvp,
  onViewLocation,
  onOpenImageModal,
}) => {
  const eventDate = wedding?.weddingDate || WEDDING_DETAILS.eventDateISO;
  const groomNameKhmer = wedding?.groomNameKhmer || WEDDING_DETAILS.groom.nameKhmer;
  const groomNameEnglish = wedding?.groomNameEnglish || WEDDING_DETAILS.groom.nameEnglish;
  const groomParentsKhmer = wedding?.groomParentsKhmer || WEDDING_DETAILS.groom.parentsKhmer;
  const groomParentsEnglish = wedding?.groomParentsEnglish || WEDDING_DETAILS.groom.parentsEnglish;
  const brideNameKhmer = wedding?.brideNameKhmer || WEDDING_DETAILS.bride.nameKhmer;
  const brideNameEnglish = wedding?.brideNameEnglish || WEDDING_DETAILS.bride.nameEnglish;
  const brideParentsKhmer = wedding?.brideParentsKhmer || WEDDING_DETAILS.bride.parentsKhmer;
  const brideParentsEnglish = wedding?.brideParentsEnglish || WEDDING_DETAILS.bride.parentsEnglish;
  const dateKhmer = wedding?.weddingDateKhmer || WEDDING_DETAILS.dateKhmer;
  const lunarDateKhmer = wedding?.lunarDateKhmer || WEDDING_DETAILS.lunarDateKhmer;
  const dinnerTimeKhmer = wedding?.weddingTimeKhmer || WEDDING_DETAILS.dinnerTimeKhmer;
  const venueNameKhmer = wedding?.venueNameKhmer || WEDDING_DETAILS.venue.nameKhmer;
  const addressKhmer = wedding?.addressKhmer || WEDDING_DETAILS.venue.addressKhmer;
  const addressEnglish = wedding?.addressEnglish || WEDDING_DETAILS.venue.addressEnglish;
  const heroImage = wedding?.heroImage || '/src/assets/images/hero_khmer_wedding_1791004183585.jpg';

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const targetDate = new Date(eventDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [eventDate]);

  return (
    <section id="hero-section" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Background Subtle Gradient & Lotus Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-radial-luxury pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        
        {/* Traditional Khmer Auspicious Emblem */}
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>សិរីសួស្តី អាពាហ៍ពិពាហ៍</span>
          </div>
          <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>

        {/* Personalized Guest Invitation Salutation */}
        <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-[#141210]/80 border border-amber-500/25 shadow-lg backdrop-blur-sm">
          <p className="text-xs sm:text-sm text-stone-300 mb-1">
            យើងខ្ញុំសូមគោរពអញ្ជើញ
          </p>
          <h2 className="font-moul text-base sm:text-xl text-gold-gradient leading-relaxed">
            {guestName || 'ឯកឧត្តម លោកជំទាវ លោកអ្នកមានកិត្តិយស'}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            និងក្រុមគ្រួសារ អញ្ជើញចូលរួមជាអធិបតី និងភ្ញៀវកិត្តិយស ក្នុងពិធីសិរីមង្គលអាពាហ៍ពិពាហ៍ និងពិធីជប់លៀងអាហារពេលល្ងាច
          </p>
        </div>

        {/* Parents and Families Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-[#13110f]/70 border border-stone-800/80">
            <span className="text-amber-400/80 font-medium block mb-1">មាតាបិតាខាងកូនប្រុស</span>
            <p className="font-medium text-stone-200 text-sm sm:text-base leading-relaxed">
              {groomParentsKhmer}
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">{groomParentsEnglish}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#13110f]/70 border border-stone-800/80">
            <span className="text-amber-400/80 font-medium block mb-1">មាតាបិតាខាងកូនស្រី</span>
            <p className="font-medium text-stone-200 text-sm sm:text-base leading-relaxed">
              {brideParentsKhmer}
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">{brideParentsEnglish}</p>
          </div>
        </div>

        {/* Bride and Groom Names */}
        <div className="my-6">
          <p className="text-xs text-stone-400 uppercase tracking-widest mb-2 font-medium">
            សិរីសួស្តីអាពាហ៍ពិពាហ៍រវាង
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <div className="text-center">
              <span className="text-xs text-amber-400/80 block mb-0.5">កូនប្រុស</span>
              <span className="font-moul text-2xl sm:text-3xl text-gold-gradient block">
                {groomNameKhmer}
              </span>
              <span className="text-xs text-stone-400 font-cinzel tracking-wider">
                {groomNameEnglish}
              </span>
            </div>

            <div className="flex items-center justify-center p-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-rose-400">
              <Heart className="w-5 h-5 fill-rose-500/30" />
            </div>

            <div className="text-center">
              <span className="text-xs text-amber-400/80 block mb-0.5">កូនស្រី</span>
              <span className="font-moul text-2xl sm:text-3xl text-gold-gradient block">
                {brideNameKhmer}
              </span>
              <span className="text-xs text-stone-400 font-cinzel tracking-wider">
                {brideNameEnglish}
              </span>
            </div>
          </div>
        </div>

        {/* Main Hero Photo Container with High-Res Generated Image */}
        <div className="relative max-w-4xl mx-auto my-8 rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl shadow-amber-950/40 group">
          <div className="relative aspect-video w-full bg-[#161311]">
            <img
              src={heroImage}
              alt="កូនកំលោះ និងកូនក្រមុំ ក្នុងឈុតសម្លៀកបំពាក់ប្រពៃណីមង្គលខ្មែរ"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0a] via-transparent to-black/20" />

            <button
              onClick={() =>
                onOpenImageModal(
                  heroImage,
                  'កូនកំលោះ និងកូនក្រមុំ ក្នុងឈុតសម្លៀកបំពាក់ប្រពៃណីមង្គលខ្មែរ'
                )
              }
              className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-xs text-white hover:bg-black/80 transition-colors cursor-pointer"
            >
              ពង្រីករូបភាពពេញ
            </button>
          </div>
        </div>

        {/* Auspicious Date and Venue Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto my-8 text-left">
          
          {/* Specific Date & Time */}
          <div className="p-5 rounded-2xl bg-[#141210]/90 border border-amber-500/30 shadow-md flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase text-amber-400 tracking-wider font-medium block mb-1">
                កាលបរិច្ឆេទ & ពេលវេលាជាក់លាក់
              </span>
              <p className="font-moul text-base text-stone-100 mb-1 leading-snug">
                {dateKhmer}
              </p>
              <p className="text-xs text-stone-400 mb-2">{lunarDateKhmer}</p>
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>ពិធីជប់លៀងអាហារពេលល្ងាច៖ {dinnerTimeKhmer}</span>
              </div>
            </div>
          </div>

          {/* Specific Location */}
          <div className="p-5 rounded-2xl bg-[#141210]/90 border border-amber-500/30 shadow-md flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase text-amber-400 tracking-wider font-medium block mb-1">
                ទីតាំងរៀបចំពិធីជាក់លាក់
              </span>
              <p className="font-moul text-base text-stone-100 mb-1 leading-snug">
                {venueNameKhmer}
              </p>
              <p className="text-xs text-stone-300 mb-1">{addressKhmer}</p>
              <p className="text-[11px] text-stone-400">{addressEnglish}</p>
            </div>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="max-w-2xl mx-auto my-8 p-6 rounded-2xl bg-gradient-to-b from-[#181512] to-[#100e0c] border border-amber-500/30 shadow-xl">
          <p className="text-xs uppercase tracking-widest text-amber-400 mb-4 font-medium">
            រាប់ថយក្រោយឆ្ពោះទៅកាន់រាត្រីមង្គលការ
          </p>

          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/15">
              <span className="font-moul text-xl sm:text-3xl text-gold-gradient block tabular-nums">
                {toKhmerNumber(timeLeft.days)}
              </span>
              <span className="text-[11px] sm:text-xs text-stone-400 block mt-0.5">ថ្ងៃ (Days)</span>
              <span className="text-[10px] text-stone-400 block tabular-nums font-mono">({timeLeft.days})</span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/15">
              <span className="font-moul text-xl sm:text-3xl text-gold-gradient block tabular-nums">
                {toKhmerNumber(timeLeft.hours)}
              </span>
              <span className="text-[11px] sm:text-xs text-stone-400 block mt-0.5">ម៉ោង (Hours)</span>
              <span className="text-[10px] text-stone-400 block tabular-nums font-mono">({timeLeft.hours})</span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/15">
              <span className="font-moul text-xl sm:text-3xl text-gold-gradient block tabular-nums">
                {toKhmerNumber(timeLeft.minutes)}
              </span>
              <span className="text-[11px] sm:text-xs text-stone-400 block mt-0.5">នាទី (Mins)</span>
              <span className="text-[10px] text-stone-400 block tabular-nums font-mono">({timeLeft.minutes})</span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/15">
              <span className="font-moul text-xl sm:text-3xl text-gold-gradient block tabular-nums">
                {toKhmerNumber(timeLeft.seconds)}
              </span>
              <span className="text-[11px] sm:text-xs text-stone-400 block mt-0.5">វិនាទី (Secs)</span>
              <span className="text-[10px] text-stone-400 block tabular-nums font-mono">({timeLeft.seconds})</span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6">
          <button
            onClick={onOpenRsvp}
            className="px-6 py-3 rounded-xl font-medium text-stone-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer text-sm sm:text-base"
          >
            <CheckSquare className="w-4 h-4" />
            <span>ឆ្លើយតបការចូលរួម (RSVP Now)</span>
          </button>

          <button
            onClick={onViewLocation}
            className="px-6 py-3 rounded-xl font-medium text-amber-200 bg-[#161311] border border-amber-500/40 hover:bg-amber-500/10 hover:border-amber-400 transition-all flex items-center gap-2 cursor-pointer text-sm sm:text-base"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>មើលទីតាំងលើផែនទី</span>
          </button>
        </div>

      </div>
    </section>
  );
};
