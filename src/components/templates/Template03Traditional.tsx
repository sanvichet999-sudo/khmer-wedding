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

export const Template03Traditional: React.FC<TemplateProps> = ({
  wedding,
  guestName,
  onOpenRsvp,
  onOpenImageModal,
}) => {
  return (
    <div className="min-h-screen bg-[#140a08] text-[#fbf7ee] font-kantumruy">
      {/* Traditional Red & Gold Border Wrapper */}
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-6">
        
        {/* Ancient Khmer Heritage Crest */}
        <div className="inline-block p-2 rounded-2xl bg-gradient-to-b from-[#881337] to-[#4c0519] border-2 border-amber-400/50 shadow-2xl">
          <div className="px-5 py-2 border border-amber-400/30 rounded-xl">
            <span className="font-moul text-xs text-amber-200 tracking-wider">
              សិរីមង្គលអាពាហ៍ពិពាហ៍ប្រពៃណីខ្មែរ
            </span>
          </div>
        </div>

        {/* Guest Honorific */}
        <div className="max-w-xl mx-auto p-5 rounded-2xl bg-[#1f0f0d] border border-amber-500/30 shadow-xl">
          <span className="text-xs text-amber-300 block mb-1">សូមគោរពអញ្ជើញ</span>
          <h2 className="font-moul text-lg sm:text-xl text-amber-100 leading-relaxed">
            {guestName || 'ឯកឧត្តម លោកជំទាវ លោកអ្នកមានកិត្តិយស'}
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            ចូលរួមជាភ្ញៀវកិត្តិយសក្នុងពិធីហែជំនូន កាត់សក់បង្កក់សិរី និងជប់លៀងអាហារពេលល្ងាច
          </p>
        </div>

        {/* Parents Names - Classical Arrangement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-xs">
          <div className="p-4 rounded-xl bg-[#22100d] border border-amber-700/40">
            <span className="text-amber-400 font-bold block mb-1">មាតាបិតាខាងកូនប្រុស</span>
            <p className="font-medium text-stone-100 text-sm">{wedding.groomParentsKhmer}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#22100d] border border-amber-700/40">
            <span className="text-amber-400 font-bold block mb-1">មាតាបិតាខាងកូនស្រី</span>
            <p className="font-medium text-stone-100 text-sm">{wedding.brideParentsKhmer}</p>
          </div>
        </div>

        {/* Couple Names - Heritage Title */}
        <div className="my-8 py-4 border-y border-amber-500/30 bg-[#1d0e0c]/60">
          <span className="text-xs text-amber-400/90 tracking-widest uppercase block mb-2 font-medium">
            គូស្វាមីភរិយាថ្មី
          </span>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <span className="font-moul text-2xl sm:text-3xl text-amber-200">
              {wedding.groomNameKhmer}
            </span>
            <Heart className="w-5 h-5 text-amber-400 fill-amber-400/40" />
            <span className="font-moul text-2xl sm:text-3xl text-amber-200">
              {wedding.brideNameKhmer}
            </span>
          </div>
        </div>

        {/* Royal Attire Photo Showcase */}
        <div
          onClick={() => onOpenImageModal(wedding.heroImage, wedding.coupleNameKhmer)}
          className="relative max-w-2xl mx-auto rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl cursor-pointer group"
        >
          <div className="aspect-video w-full bg-[#200f0c]">
            <img
              src={wedding.heroImage}
              alt="ពិធីសិរីសួស្តី អាពាហ៍ពិពាហ៍បែបប្រពៃណីខ្មែរ"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
            <span className="text-xs text-amber-300 font-medium">ចុចមើលរូបភាពពេញ</span>
          </div>
        </div>

        {/* Ceremony Time & Venue Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left text-xs">
          <div className="p-4 rounded-xl bg-[#1f0f0d] border border-amber-600/30 flex items-start gap-3">
            <Calendar className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-amber-400 font-bold block mb-1">កាលបរិច្ឆេទ & ពេលវេលា</span>
              <p className="font-moul text-xs text-stone-100">{wedding.weddingDateKhmer}</p>
              <p className="text-stone-300 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{wedding.weddingTimeKhmer}</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1f0f0d] border border-amber-600/30 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-amber-400 font-bold block mb-1">ទីតាំងមង្គល</span>
              <p className="font-moul text-xs text-stone-100">{wedding.venueNameKhmer}</p>
              <p className="text-stone-300 mt-1">{wedding.addressKhmer}</p>
            </div>
          </div>
        </div>

        {/* RSVP Action */}
        <div className="pt-4">
          <button
            onClick={onOpenRsvp}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            <span>ឆ្លើយតបការចូលរួម (RSVP)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
