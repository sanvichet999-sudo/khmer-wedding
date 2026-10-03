import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles, Heart, CheckSquare, Gift, Navigation, Copy, Check } from 'lucide-react';
import { WeddingEvent, PaymentMethod } from '../../types/fullstack';
import { toKhmerNumber } from '../../utils/khmerNumerals';

interface TemplateProps {
  wedding: WeddingEvent;
  guestName: string;
  allowedGuests?: number;
  paymentMethods: PaymentMethod[];
  onOpenRsvp: () => void;
  onOpenImageModal: (src: string, alt: string) => void;
}

export const Template01Royal: React.FC<TemplateProps> = ({
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
    <div className="min-h-screen bg-[#0c0b0a] text-stone-100 font-kantumruy">
      {/* Royal Gold Top Arch */}
      <div className="relative pt-12 pb-16 text-center max-w-4xl mx-auto px-4">
        
        {/* Khmer Royal Emblem */}
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
          <div className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
            <span>សិរីសួស្តី អាពាហ៍ពិពាហ៍រាជវាំង</span>
          </div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
        </div>

        {/* Guest Honorific Salutation */}
        <div className="max-w-xl mx-auto mb-6 p-4 rounded-2xl bg-[#161210] border border-amber-500/30 shadow-xl">
          <p className="text-xs text-stone-300 mb-1">យើងខ្ញុំសូមគោរពអញ្ជើញ</p>
          <h2 className="font-moul text-lg sm:text-xl text-gold-gradient leading-relaxed">
            {guestName || 'ឯកឧត្តម លោកជំទាវ លោកអ្នកមានកិត្តិយស'}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            អញ្ជើញចូលរួមជាអធិបតី និងភ្ញៀវកិត្តិយស ក្នុងពិធីមង្គលការ និងពិធីជប់លៀងអាហារពេលល្ងាច
          </p>
        </div>

        {/* Parents Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8 text-xs">
          <div className="p-4 rounded-xl bg-[#14100e] border border-stone-800">
            <span className="text-amber-400 font-medium block mb-1">មាតាបិតាខាងកូនប្រុស</span>
            <p className="font-medium text-stone-100 text-sm leading-relaxed">{wedding.groomParentsKhmer}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#14100e] border border-stone-800">
            <span className="text-amber-400 font-medium block mb-1">មាតាបិតាខាងកូនស្រី</span>
            <p className="font-medium text-stone-100 text-sm leading-relaxed">{wedding.brideParentsKhmer}</p>
          </div>
        </div>

        {/* Couple Names */}
        <div className="my-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <div>
              <span className="text-xs text-amber-400/80 block mb-0.5">កូនប្រុស</span>
              <span className="font-moul text-2xl sm:text-3xl text-gold-gradient block">
                {wedding.groomNameKhmer}
              </span>
            </div>

            <div className="p-2.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-rose-400">
              <Heart className="w-5 h-5 fill-rose-500/30" />
            </div>

            <div>
              <span className="text-xs text-amber-400/80 block mb-0.5">កូនក្រមុំ</span>
              <span className="font-moul text-2xl sm:text-3xl text-gold-gradient block">
                {wedding.brideNameKhmer}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Photo with Ornate Golden Border */}
        <div
          onClick={() => onOpenImageModal(wedding.heroImage, wedding.coupleNameKhmer)}
          className="relative max-w-3xl mx-auto my-8 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl cursor-pointer group"
        >
          <div className="aspect-video w-full bg-[#181412]">
            <img
              src={wedding.heroImage}
              alt="កូនកំលោះ និងកូនក្រមុំ ក្នុងឈុតសម្លៀកបំពាក់ប្រពៃណីមង្គលខ្មែរ"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
            <span className="text-xs text-amber-300 font-medium">ចុចដើម្បីពង្រីករូបភាព</span>
          </div>
        </div>

        {/* Date and Venue Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto my-8 text-left text-xs">
          <div className="p-4 rounded-xl bg-[#141210] border border-amber-500/30 flex items-start gap-3">
            <Calendar className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-amber-400 font-semibold block mb-0.5">កាលបរិច្ឆេទ</span>
              <p className="font-moul text-sm text-stone-100">{wedding.weddingDateKhmer}</p>
              <p className="text-stone-400 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{wedding.weddingTimeKhmer}</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#141210] border border-amber-500/30 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-amber-400 font-semibold block mb-0.5">ទីតាំងរៀបចំពិធី</span>
              <p className="font-moul text-sm text-stone-100">{wedding.venueNameKhmer}</p>
              <p className="text-stone-300 mt-1">{wedding.addressKhmer}</p>
            </div>
          </div>
        </div>

        {/* Quick RSVP CTA */}
        <div className="pt-2">
          <button
            onClick={onOpenRsvp}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold text-xs sm:text-sm hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            <span>ឆ្លើយតបការចូលរួម (RSVP)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
