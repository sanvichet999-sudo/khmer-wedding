import React from 'react';
import { Palette, Sparkles, Shirt } from 'lucide-react';
import { WEDDING_DETAILS } from '../data/weddingData';

export const DressCodeSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 border-t border-stone-800/80 relative bg-[#0e0c0b]/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs font-medium mb-3">
          <Palette className="w-3.5 h-3.5" />
          <span>{WEDDING_DETAILS.dressCode.titleKhmer}</span>
        </div>

        <h2 className="font-moul text-xl sm:text-2xl text-gold-gradient mb-3">
          ពណ៌សម្លៀកបំពាក់ប្រធានបទ
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 mb-8 max-w-lg mx-auto">
          {WEDDING_DETAILS.dressCode.descriptionKhmer} ({WEDDING_DETAILS.dressCode.titleEnglish})
        </p>

        {/* Color Palette Swatches */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
          {WEDDING_DETAILS.dressCode.palette.map((color) => (
            <div
              key={color.nameEnglish}
              className="p-4 rounded-xl bg-[#141210] border border-stone-800 flex flex-col items-center shadow-md group hover:border-amber-500/40 transition-colors"
            >
              <div
                className="w-14 h-14 rounded-full mb-3 shadow-inner border-2 transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: color.hex,
                  borderColor: color.border,
                }}
              />
              <span className="font-medium text-xs text-stone-200 block">
                {color.nameKhmer}
              </span>
              <span className="text-[10px] text-stone-400 block font-cinzel">
                {color.nameEnglish}
              </span>
            </div>
          ))}
        </div>

        <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-stone-300">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            លោកអ្នកអាចស្លៀកពាក់ឈុតប្រពៃណីខ្មែរ ឈុតធំ ឬរ៉ូបរាត្រីសមោសរតាមចំណង់ចំណូលចិត្ត
          </span>
        </div>

      </div>
    </section>
  );
};
