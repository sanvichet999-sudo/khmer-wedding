import React, { useState } from 'react';
import { Camera, Maximize2, Tag } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/weddingData';

interface GallerySectionProps {
  onOpenImageModal: (src: string, alt: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onOpenImageModal }) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const tags = ['all', 'ប្រពៃណីខ្មែរ', 'អាហារពេលល្ងាច', 'អនុស្សាវរីយ៍', 'ទីតាំងកម្មវិធី'];

  const filteredPhotos = selectedTag === 'all'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter((p) => p.tag === selectedTag);

  return (
    <section id="gallery-section" className="py-14 md:py-20 border-t border-stone-800/80 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs font-medium mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>កម្រងរូបភាពដ៏ស្រស់ស្អាត</span>
          </div>
          <h2 className="font-moul text-xl sm:text-2xl text-gold-gradient mb-3">
            រូបភាពអនុស្សាវរីយ៍ & សាលពិធីជប់លៀង
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            រូបថតសម្លៀកបំពាក់ប្រពៃណី ឈុតរាត្រីសមោសរ និងទិដ្ឋភាពសាលពិធីជប់លៀងអាហារពេលល្ងាច
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-amber-500 text-stone-950 font-semibold'
                  : 'bg-[#181512] text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {tag === 'all' ? 'រូបភាពទាំងអស់' : tag}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onOpenImageModal(photo.src, photo.captionKhmer)}
              className="group relative rounded-2xl overflow-hidden bg-[#141210] border border-amber-500/20 hover:border-amber-400/50 transition-all duration-300 shadow-lg cursor-pointer"
            >
              <div className="aspect-16/10 w-full overflow-hidden bg-[#181512]">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Scrim Overlay & Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-medium text-amber-300 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                    {photo.tag}
                  </span>
                  <div className="p-1.5 rounded-full bg-black/50 text-stone-300 group-hover:text-amber-300 transition-colors">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h3 className="font-moul text-sm text-stone-100 mb-1 leading-snug">
                  {photo.captionKhmer}
                </h3>
                <p className="text-[11px] text-stone-300 line-clamp-1">
                  {photo.captionEnglish}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
