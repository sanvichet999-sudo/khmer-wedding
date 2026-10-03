import React, { useState, useEffect } from 'react';
import { MessageSquareHeart, Heart, Send, Sparkles, User } from 'lucide-react';
import { GuestWish } from '../types/wedding';
import { INITIAL_WISHES } from '../data/weddingData';

interface GuestbookSectionProps {
  initialGuestName: string;
}

const WISHES_STORAGE_KEY = 'wedding_wishes_vichet_chariya';

const PRESET_WISHES = [
  'សូមជូនពរឱ្យអ្នកទាំងពីរមានសុភមង្គលពេញមួយជីវិត ស្រឡាញ់គ្នារហូតដល់ចាស់កោងខ្នង!',
  'សូមឱ្យគ្រួសារថ្មីនេះត្រជាក់ត្រជុំ រកស៊ីមានបាន និងឆាប់មានបុត្រាបុត្រីគួរឱ្យស្រឡាញ់!',
  'អបអរសាទរថ្ងៃសិរីសួស្តីមង្គលការ! សូមឱ្យក្តីស្រឡាញ់ស្ថិតស្ថេរគង់វង្សជានិរន្តរ៍!',
  'ជូនពរឱ្យជីវិតអាពាហ៍ពិពាហ៍ពោរពេញដោយស្នាមញញឹម ជោគជ័យ និងវិបុលសុខគ្រប់ប្រការ!',
];

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({ initialGuestName }) => {
  const [wishes, setWishes] = useState<GuestWish[]>(INITIAL_WISHES);
  const [authorName, setAuthorName] = useState(initialGuestName);
  const [relationship, setRelationship] = useState('មិត្តភក្តិ');
  const [message, setMessage] = useState('');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHES_STORAGE_KEY);
      if (saved) {
        setWishes(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !authorName.trim()) return;

    const newWish: GuestWish = {
      id: 'wish_' + Date.now(),
      guestName: authorName.trim(),
      message: message.trim(),
      relationship: relationship,
      timestamp: 'ទើបតែសរសេរ',
      likes: 1,
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    setMessage('');

    try {
      localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleLike = (id: string) => {
    if (likedMap[id]) return;

    setLikedMap((prev) => ({ ...prev, [id]: true }));
    const updated = wishes.map((w) => (w.id === id ? { ...w, likes: w.likes + 1 } : w));
    setWishes(updated);

    try {
      localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <section id="guestbook-section" className="py-14 md:py-20 border-t border-stone-800/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs font-medium mb-3">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>សៀវភៅជូនពរឌីជីថល</span>
          </div>
          <h2 className="font-moul text-xl sm:text-2xl text-gold-gradient mb-3">
            ពាក្យជូនពរដល់គូស្វាមីភរិយាថ្មី
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            សូមផ្ញើសារជូនពរដ៏មានអត្ថន័យ ដើម្បីជាអនុស្សាវរីយ៍ដ៏មានតម្លៃក្នុងថ្ងៃមង្គល
          </p>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-[#141210] border border-amber-500/30 shadow-xl mb-12 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-stone-300 mb-1 font-medium">
                ឈ្មោះរបស់អ្នក
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="ឈ្មោះភ្ញៀវ ឬក្រុមគ្រួសារ..."
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1 font-medium">
                ទំនាក់ទំនង / ងារ
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
              >
                <option value="ភ្ញៀវកិត្តិយស">ភ្ញៀវកិត្តិយស</option>
                <option value="មិត្តភក្តិ">មិត្តភក្តិ</option>
                <option value="សាច់ញាតិខាងកូនប្រុស">សាច់ញាតិខាងកូនប្រុស</option>
                <option value="សាច់ញាតិខាងកូនស្រី">សាច់ញាតិខាងកូនស្រី</option>
                <option value="សហការីការងារ">សហការីការងារ</option>
              </select>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[11px] text-amber-400/90 block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>ជ្រើសរើសពាក្យជូនពរគំរូរហ័ស៖</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_WISHES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessage(preset)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-800/80 hover:bg-amber-500/20 text-stone-300 hover:text-amber-200 border border-stone-700/60 transition-colors text-left cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-stone-300 mb-1 font-medium">
              ខ្លឹមសារពាក្យជូនពរ
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="សូមសរសេរពាក្យជូនពររបស់អ្នកនៅទីនេះ..."
              required
              className="w-full p-3 rounded-xl bg-black/40 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-semibold text-xs flex items-center gap-2 hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ផ្ញើពាក្យជូនពរ</span>
            </button>
          </div>
        </form>

        {/* Wishes List */}
        <div className="space-y-4">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className="p-5 rounded-2xl bg-[#141210] border border-stone-800/90 hover:border-amber-500/30 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h4 className="font-moul text-xs sm:text-sm text-amber-200">
                    {wish.guestName}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                    <span>{wish.relationship}</span>
                    <span>·</span>
                    <span>{wish.timestamp}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleLike(wish.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                    likedMap[wish.id]
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-stone-800/60 text-stone-400 hover:text-rose-400'
                  }`}
                  title="ចូលចិត្តពាក្យជូនពរនេះ"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${likedMap[wish.id] ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                  <span className="tabular-nums font-mono text-[11px]">{wish.likes}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-kantumruy">
                {wish.message}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
