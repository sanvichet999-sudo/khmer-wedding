import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Heart, CheckSquare, Sparkles, Moon, Star, Copy, Check } from 'lucide-react';
import { WeddingEvent, PaymentMethod } from '../../types/fullstack';

interface TemplateProps {
  wedding: WeddingEvent;
  guestName: string;
  allowedGuests?: number;
  paymentMethods: PaymentMethod[];
  onOpenRsvp: () => void;
  onOpenImageModal: (src: string, alt: string) => void;
}

export const Template05Midnight: React.FC<TemplateProps> = ({
  wedding,
  guestName,
  paymentMethods,
  onOpenRsvp,
  onOpenImageModal,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-sky-100 font-kantumruy relative overflow-hidden">
      {/* Celestial Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-indigo-600/20 via-sky-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 py-14 text-center space-y-7 relative z-10">
        
        {/* Starry Moon Crest */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-sky-400/40 text-sky-200 text-xs font-medium shadow-lg shadow-sky-950/50">
          <Moon className="w-3.5 h-3.5 text-amber-300" />
          <span>រាត្រីតារារះ (Grand Midnight Celestial Gala)</span>
          <Star className="w-3.5 h-3.5 text-amber-300" />
        </div>

        {/* Guest Honorific Card */}
        <div className="max-w-xl mx-auto p-5 rounded-2xl bg-[#0d1527]/90 border border-sky-500/30 shadow-2xl backdrop-blur-md">
          <span className="text-xs text-sky-300/80 block mb-1">សូមគោរពអញ្ជើញ</span>
          <h2 className="font-moul text-lg sm:text-xl text-sky-100 leading-relaxed drop-shadow">
            {guestName || 'ឯកឧត្តម លោកជំទាវ លោកអ្នកមានកិត្តិយស'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            អញ្ជើញចូលរួមពិធីជប់លៀងរាត្រីសមោសរ និងពិធីមង្គលការក្រោមពន្លឺតារាដ៏ត្រចះត្រចង់
          </p>
        </div>

        {/* Couple Names */}
        <div className="my-6">
          <span className="text-[11px] text-amber-300/90 tracking-widest uppercase block mb-1">
            សិរីសួស្តី អាពាហ៍ពិពាហ៍
          </span>
          <h1 className="font-moul text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-amber-200 to-sky-300 leading-relaxed">
            {wedding.groomNameKhmer}
            <span className="inline-block mx-3 text-amber-400">✧</span>
            {wedding.brideNameKhmer}
          </h1>
          <p className="text-xs text-sky-300/70 mt-1 font-cinzel tracking-wider">
            {wedding.groomNameEnglish} & {wedding.brideNameEnglish}
          </p>
        </div>

        {/* Couple Photo in Starry Sapphire Frame */}
        <div
          onClick={() => onOpenImageModal(wedding.coupleImage, wedding.coupleNameKhmer)}
          className="relative max-w-2xl mx-auto rounded-3xl overflow-hidden border-2 border-sky-400/40 shadow-2xl shadow-sky-950/80 cursor-pointer group"
        >
          <div className="aspect-4/3 w-full bg-[#0a1122]">
            <img
              src={wedding.coupleImage}
              alt={wedding.coupleNameKhmer}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent opacity-70" />
        </div>

        {/* Parents Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-xs">
          <div className="p-4 rounded-2xl bg-[#0d1527]/90 border border-sky-900/80">
            <span className="text-amber-300 font-medium block mb-1">មាតាបិតាខាងកូនប្រុស</span>
            <p className="font-medium text-sky-100 text-sm">{wedding.groomParentsKhmer}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{wedding.groomParentsEnglish}</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#0d1527]/90 border border-sky-900/80">
            <span className="text-amber-300 font-medium block mb-1">មាតាបិតាខាងកូនស្រី</span>
            <p className="font-medium text-sky-100 text-sm">{wedding.brideParentsKhmer}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{wedding.brideParentsEnglish}</p>
          </div>
        </div>

        {/* Key Event Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-xs">
          <div className="p-4 rounded-2xl bg-[#0d1527]/90 border border-sky-900/80 flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">កាលបរិច្ឆេទមង្គល</span>
              <span className="font-semibold text-sky-100 block text-xs">{wedding.weddingDateKhmer}</span>
              <span className="text-[10px] text-amber-300/80">{wedding.lunarDateKhmer}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0d1527]/90 border border-sky-900/80 flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">វេលាម៉ោងពិសាភោជនាហារ</span>
              <span className="font-semibold text-amber-200 block text-xs">{wedding.weddingTimeKhmer}</span>
              <span className="text-[10px] text-slate-400">{wedding.weddingTimeEnglish}</span>
            </div>
          </div>
        </div>

        {/* Venue Information */}
        <div className="p-5 rounded-2xl bg-[#0d1527]/90 border border-sky-900/80 max-w-2xl mx-auto text-left space-y-2 text-xs">
          <div className="flex items-center gap-2 text-sky-300 font-medium">
            <MapPin className="w-4 h-4 text-sky-400" />
            <span>ទីតាំងប្រារព្ធពិធីមង្គលការ</span>
          </div>
          <p className="font-moul text-sm text-sky-100">{wedding.venueNameKhmer}</p>
          <p className="text-slate-300 text-xs">{wedding.addressKhmer}</p>
        </div>

        {/* RSVP Action Button */}
        <div className="pt-2">
          <button
            onClick={onOpenRsvp}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-300 hover:from-sky-300 hover:to-amber-200 text-slate-950 font-bold text-xs shadow-xl shadow-sky-900/50 flex items-center gap-2 mx-auto cursor-pointer transition-all hover:scale-105"
          >
            <CheckSquare className="w-4 h-4" />
            <span>បញ្ជាក់វត្តមានចូលរួម (RSVP Now)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
