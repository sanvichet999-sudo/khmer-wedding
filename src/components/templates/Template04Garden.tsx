import React from 'react';
import { Calendar, Clock, MapPin, Heart, CheckSquare, Sparkles, Leaf } from 'lucide-react';
import { WeddingEvent, PaymentMethod } from '../../types/fullstack';

interface TemplateProps {
  wedding: WeddingEvent;
  guestName: string;
  allowedGuests?: number;
  paymentMethods: PaymentMethod[];
  onOpenRsvp: () => void;
  onOpenImageModal: (src: string, alt: string) => void;
}

export const Template04Garden: React.FC<TemplateProps> = ({
  wedding,
  guestName,
  onOpenRsvp,
  onOpenImageModal,
}) => {
  return (
    <div className="min-h-screen bg-[#0a120c] text-[#f4faee] font-kantumruy">
      {/* Garden Botanical Header */}
      <div className="max-w-4xl mx-auto px-4 py-14 text-center space-y-7">
        
        {/* Leaf Garland Crest */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
          <Leaf className="w-3.5 h-3.5 text-lime-400" />
          <span>មង្គលការសួនធម្មជាតិ (Khmer Garden Wedding)</span>
          <Leaf className="w-3.5 h-3.5 text-lime-400" />
        </div>

        {/* Guest Greeting */}
        <div className="max-w-xl mx-auto p-5 rounded-2xl bg-[#122015] border border-emerald-600/30 shadow-xl">
          <span className="text-xs text-lime-300 block mb-1">សូមគោរពអញ្ជើញ</span>
          <h2 className="font-moul text-lg sm:text-xl text-emerald-100 leading-relaxed">
            {guestName || 'ឯកឧត្តម លោកជំទាវ លោកអ្នកមានកិត្តិយស'}
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            ចូលរួមពិសាភោជនាហារពេលល្ងាច ក្នុងបរិយាកាសសួនមង្គលដ៏កក់ក្តៅ
          </p>
        </div>

        {/* Couple Names */}
        <div className="my-6">
          <h1 className="font-moul text-2xl sm:text-3xl text-lime-200">
            {wedding.groomNameKhmer}
            <span className="inline-block mx-3 text-lime-400">♥</span>
            {wedding.brideNameKhmer}
          </h1>
          <p className="text-xs text-emerald-400/80 mt-1 font-cinzel tracking-wider">
            {wedding.groomNameEnglish} & {wedding.brideNameEnglish}
          </p>
        </div>

        {/* Couple Photo in Garden Frame */}
        <div
          onClick={() => onOpenImageModal(wedding.coupleImage, wedding.coupleNameKhmer)}
          className="relative max-w-2xl mx-auto rounded-3xl overflow-hidden border-2 border-emerald-600/40 shadow-2xl cursor-pointer group"
        >
          <div className="aspect-4/3 w-full bg-[#152317]">
            <img
              src={wedding.coupleImage}
              alt="កូនកំលោះ និងកូនក្រមុំ ក្នុងឈុតសម្លៀកបំពាក់ប្រពៃណីមង្គលខ្មែរ"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
            <span className="text-xs text-lime-300">ចុចមើលរូបភាពធំ</span>
          </div>
        </div>

        {/* Date and Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left text-xs">
          <div className="p-4 rounded-2xl bg-[#122015] border border-emerald-700/30 flex items-start gap-3">
            <Calendar className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-lime-400 font-bold block mb-0.5">កាលបរិច្ឆេទ</span>
              <p className="font-semibold text-stone-100 text-sm">{wedding.weddingDateKhmer}</p>
              <p className="text-stone-300 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-lime-400" />
                <span>{wedding.weddingTimeKhmer}</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#122015] border border-emerald-700/30 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-lime-400 font-bold block mb-0.5">ទីតាំងកម្មវិធី</span>
              <p className="font-semibold text-stone-100 text-sm">{wedding.venueNameKhmer}</p>
              <p className="text-stone-300 mt-1">{wedding.addressKhmer}</p>
            </div>
          </div>
        </div>

        {/* Parents Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left text-xs bg-[#0e1910] p-4 rounded-2xl border border-emerald-800/40">
          <div>
            <span className="text-lime-400 font-semibold block mb-0.5">មាតាបិតាខាងកូនប្រុស</span>
            <p className="text-stone-200">{wedding.groomParentsKhmer}</p>
          </div>
          <div>
            <span className="text-lime-400 font-semibold block mb-0.5">មាតាបិតាខាងកូនស្រី</span>
            <p className="text-stone-200">{wedding.brideParentsKhmer}</p>
          </div>
        </div>

        {/* RSVP Button */}
        <div className="pt-2">
          <button
            onClick={onOpenRsvp}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-lime-500 to-emerald-600 text-stone-950 font-bold text-xs sm:text-sm hover:from-lime-400 hover:to-emerald-500 shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            <span>ឆ្លើយតបការចូលរួម (RSVP)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
