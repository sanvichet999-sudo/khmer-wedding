import React, { useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { weddingAudio } from '../utils/audioPlayer';

export const AudioToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleToggle = () => {
    const newState = weddingAudio.toggle();
    setIsPlaying(newState);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      <button
        onClick={handleToggle}
        aria-label={isPlaying ? 'បិទតន្ត្រី' : 'បើកតន្ត្រីពិធីមង្គលការ'}
        className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#181512]/90 backdrop-blur-md border border-amber-500/40 text-amber-200 shadow-xl hover:border-amber-400 hover:text-amber-100 hover:shadow-amber-500/10 transition-all duration-200 cursor-pointer"
      >
        <span className="relative flex h-3 w-3">
          {isPlaying ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </>
          ) : (
            <span className="inline-flex rounded-full h-3 w-3 bg-stone-600"></span>
          )}
        </span>

        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
        ) : (
          <VolumeX className="w-4 h-4 text-stone-400" />
        )}

        <span className="text-xs font-medium tracking-wide hidden sm:inline-block">
          {isPlaying ? 'តន្ត្រីមង្គលការ' : 'បើកតន្ត្រី'}
        </span>

        <Music className="w-3.5 h-3.5 text-amber-400/80 hidden sm:inline-block" />
      </button>
    </div>
  );
};
