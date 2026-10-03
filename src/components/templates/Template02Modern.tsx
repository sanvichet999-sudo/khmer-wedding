import React from 'react';
import { Calendar, Clock, MapPin, Heart, CheckSquare, Sparkles } from 'lucide-react';
import { WeddingEvent, PaymentMethod } from '../../types/fullstack';

interface TemplateProps {
  wedding: WeddingEvent;
  guestName: string;
  allowedGuests?: number;
  paymentMethods: PaymentMethod[];
  onOpenRsvp: () => void;
  onOpenImageModal: (src: string, alt: string) => void;
}

export const Template02Modern: React.FC<TemplateProps> = ({
  wedding,
  guestName,
  onOpenRsvp,
  onOpenImageModal,
}) => {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 font-kantumruy">
      {/* Modern Minimal Header */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-8">
        
        {/* Minimal Kbach Emblem */}
        <div className="inline-block">
          <span className="text-[11px] tracking-[0.25em] uppercase font-semibold text-stone-500 border-b border-stone-300 pb-1">
            Wedding Celebration · អាពាហ៍ពិពាហ៍
          </span>
        </div>

        {/* Couple Names - Modern Typography */}
        <div className="space-y-2">
          <h1 className="font-battambang text-3xl sm:text-4xl text-stone-900 font-bold tracking-tight">
            {wedding.groomNameKhmer}
            <span className="inline-block mx-3 text-amber-600 font-light">&</span>
            {wedding.brideNameKhmer}
          </h1>
          <p className="text-xs text-stone-500 font-cinzel tracking-widest uppercase">
            {wedding.groomNameEnglish} & {wedding.brideNameEnglish}
          </p>
        </div>

        {/* Personalized Guest Invitation Strip */}
        <div className="max-w-lg mx-auto p-4 rounded-xl bg-white border border-stone-200/80 shadow-sm">
          <span className="text-[11px] text-stone-400 block mb-0.5">សូមគោរពអញ្ជើញ</span>
          <span className="font-battambang text-base text-stone-900 font-bold block">
            {guestName || 'ឯកឧត្តម លោកជំទាវ លោកអ្នកមានកិត្តិយស'}
          </span>
          <span className="text-[11px] text-stone-500 mt-1 block">
            ចូលរួមជាកិត្តិយសក្នុងពិធីមង្គលការ និងពិធីជប់លៀងអាហារពេលល្ងាច
          </span>
        </div>

        {/* Full-bleed Minimalist Couple Photo */}
        <div
          onClick={() => onOpenImageModal(wedding.coupleImage, wedding.coupleNameKhmer)}
          className="relative max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
        >
          <div className="aspect-4/3 w-full bg-stone-200">
            <img
              src={wedding.coupleImage}
              alt="រូបថតអនុស្សាវរីយ៍ Pre-Wedding នៃគូស្នេហ៍"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-5">
            <span className="text-xs text-stone-200">ចុចដើម្បីមើលរូបភាពធំ</span>
          </div>
        </div>

        {/* Clean Date & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left text-xs">
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex items-start gap-3">
            <Calendar className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">កាលបរិច្ឆេទ</span>
              <p className="font-semibold text-stone-900 text-sm mt-0.5">{wedding.weddingDateKhmer}</p>
              <p className="text-stone-500 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{wedding.weddingTimeKhmer}</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">ទីតាំងកម្មវិធី</span>
              <p className="font-semibold text-stone-900 text-sm mt-0.5">{wedding.venueNameKhmer}</p>
              <p className="text-stone-500 mt-1">{wedding.addressKhmer}</p>
            </div>
          </div>
        </div>

        {/* Parents Section - Clean 2 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left text-xs bg-stone-100/70 p-4 rounded-xl">
          <div>
            <span className="text-[11px] font-semibold text-stone-500 block mb-0.5">មាតាបិតាខាងកូនប្រុស</span>
            <p className="text-stone-800 font-medium">{wedding.groomParentsKhmer}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-stone-500 block mb-0.5">មាតាបិតាខាងកូនស្រី</span>
            <p className="text-stone-800 font-medium">{wedding.brideParentsKhmer}</p>
          </div>
        </div>

        {/* RSVP Button */}
        <div>
          <button
            onClick={onOpenRsvp}
            className="px-8 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-xs sm:text-sm shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4 text-amber-400" />
            <span>ឆ្លើយតបការចូលរួម (RSVP)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
