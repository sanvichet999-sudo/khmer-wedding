import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Sparkles, Heart } from 'lucide-react';
import { weddingAudio } from '../utils/audioPlayer';

interface EnvelopeModalProps {
  guestName: string;
  onOpen: () => void;
}

export const EnvelopeModal: React.FC<EnvelopeModalProps> = ({ guestName, onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenEnvelope = () => {
    setIsOpening(true);

    // Fire celebratory gold and rose confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#E5C07B', '#FDFBF7', '#E0A899', '#B88628'],
      });
    } catch {
      // safe fallback
    }

    // Try starting serene music
    weddingAudio.play();

    // Trigger reveal transition
    setTimeout(() => {
      onOpen();
    }, 700);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="សំបុត្រអញ្ជើញអាពាហ៍ពិពាហ៍"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-700 ${
        isOpening ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient gold particles */}
      <div className="absolute inset-0 bg-radial-luxury pointer-events-none" />

      <div className="relative w-full max-w-lg mx-auto transform transition-transform duration-700 scale-100">
        {/* Envelope Outer Container */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#1c1815] via-[#161311] to-[#0e0c0b] p-7 md:p-9 border border-amber-500/40 shadow-2xl shadow-amber-950/40 text-center overflow-hidden">
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/50 pointer-events-none" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/50 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/50 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/50 pointer-events-none" />

          {/* Golden Lotus Seal Header */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-lg shadow-amber-500/20 mb-4 p-0.5">
            <div className="w-full h-full rounded-full bg-[#181412] flex items-center justify-center">
              <Mail className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          {/* Traditional Khmer Wedding Seal Tagline */}
          <p className="text-xs uppercase tracking-widest text-amber-400 font-medium mb-1">
            សិរីសួស្តី អាពាហ៍ពិពាហ៍
          </p>

          <h1 className="font-moul text-xl sm:text-2xl text-gold-gradient mb-2 tracking-wide">
            សំបុត្រអញ្ជើញមង្គលការ
          </h1>

          <p className="text-xs sm:text-sm text-stone-400 mb-6">
            Wedding Celebration & Evening Dinner Reception
          </p>

          <div className="h-px w-28 mx-auto bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mb-6" />

          {/* Personalized Guest Badge */}
          <div className="py-4 px-5 rounded-xl bg-amber-500/5 border border-amber-400/20 mb-7">
            <span className="text-xs text-amber-300/80 block mb-1">
              សូមគោរពអញ្ជើញ
            </span>
            <span className="font-moul text-base sm:text-lg text-amber-100 leading-relaxed block">
              {guestName || 'ឯកឧត្តម លោកជំទាវ លោកអ្នកមានកិត្តិយស'}
            </span>
            <span className="text-xs text-stone-400 mt-1 block">
              ចូលរួមជាអធិបតី និងភ្ញៀវកិត្តិយសក្នុងពិធីអាពាហ៍ពិពាហ៍ និងពិធីជប់លៀងអាហារពេលល្ងាច
            </span>
          </div>

          {/* Couple Wordmark */}
          <div className="flex items-center justify-center gap-3 text-stone-300 mb-8 font-moul text-sm sm:text-base">
            <span className="text-amber-200">សុខ វិចិត្រ</span>
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/60 animate-pulse" />
            <span className="text-amber-200">ជា ចរិយា</span>
          </div>

          {/* Click to Open Button */}
          <button
            onClick={handleOpenEnvelope}
            disabled={isOpening}
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 w-full sm:w-auto rounded-xl font-medium text-stone-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-xl shadow-amber-500/25 transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-stone-900 group-hover:rotate-12 transition-transform" />
            <span className="font-medium text-sm sm:text-base">ចុចបើកសំបុត្រអញ្ជើញ</span>
          </button>

          <p className="text-[11px] text-stone-400 mt-4">
            ចុចដើម្បីទស្សនាព័ត៌មានលម្អិត កាលបរិច្ឆេទ ទីតាំង និងឆ្លើយតបការអញ្ជើញ
          </p>
        </div>
      </div>
    </div>
  );
};
