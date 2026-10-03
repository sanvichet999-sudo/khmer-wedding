import React from 'react';
import { X } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  src,
  alt,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="រូបភាពធំ"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
    >
      <div
        className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="បិទ"
          className="absolute -top-12 right-0 p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-amber-500/30"
        />

        {alt && (
          <p className="mt-3 text-center text-xs sm:text-sm text-stone-200 font-medium max-w-2xl px-4 py-1.5 rounded-lg bg-black/60">
            {alt}
          </p>
        )}
      </div>
    </div>
  );
};
