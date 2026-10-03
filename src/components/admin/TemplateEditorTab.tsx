import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Layout,
  Type,
  Palette,
  Image as ImageIcon,
  Save,
  Check,
  Eye,
  Smartphone,
  Monitor,
  RefreshCw,
  Upload,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Layers,
  Crown,
  Heart,
  Moon,
  Leaf,
  Flower2,
  CheckCircle2,
  X,
  Utensils,
  MessageSquare,
  Phone,
  User,
  Users,
  QrCode,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { WeddingEvent, WeddingTemplate, TemplateSectionConfig } from '../../types/fullstack';
import { api } from '../../services/api';
import { Template01Royal } from '../templates/Template01Royal';
import { Template02Modern } from '../templates/Template02Modern';
import { Template03Traditional } from '../templates/Template03Traditional';
import { Template04Garden } from '../templates/Template04Garden';
import { Template05Midnight } from '../templates/Template05Midnight';

interface TemplateEditorTabProps {
  initialWedding?: WeddingEvent | null;
  initialTemplate?: WeddingTemplate | null;
  onTemplateUpdated: (updatedWedding: WeddingEvent, updatedTemplate: WeddingTemplate) => void;
}

interface TemplatePreset {
  id: 'tmpl-01' | 'tmpl-02' | 'tmpl-03' | 'tmpl-04' | 'tmpl-05';
  titleKhmer: string;
  titleEnglish: string;
  badge: string;
  description: string;
  themeColors: string[];
  gradientClass: string;
  cardBg: string;
  accentColor: string;
  tag: string;
  icon: React.ReactNode;
}

const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'tmpl-01',
    titleKhmer: 'រាជរដ្ឋមង្គល',
    titleEnglish: 'Royal Khmer Gold Palace',
    badge: 'Royal Traditional',
    description: 'ក្បូរក្បាច់រាជវាំងខ្មែរពណ៌មាសឆ្អិនឆ្អៅ សាកសមសម្រាប់ពិធីមង្គលការបែបប្រពៃណីរាជវាំងដ៏ឧត្តុង្គឧត្តម។',
    themeColors: ['#d97706', '#f59e0b', '#78350f', '#0c0b0a'],
    gradientClass: 'from-amber-600 via-amber-500 to-amber-300',
    cardBg: '#141210',
    accentColor: '#d97706',
    tag: 'ពេញនិយមបំផុត (Popular)',
    icon: <Crown className="w-4 h-4 text-amber-400" />,
  },
  {
    id: 'tmpl-02',
    titleKhmer: 'សម័យទំនើបប្រណីត',
    titleEnglish: 'Modern Minimalist Champagne',
    badge: 'Modern Clean',
    description: 'រចនាបថទាន់សម័យ ឆើតឆាយ ប្រើពណ៌ Rose Gold & Champagne សម្រាប់ពិធីជប់លៀងអាហារពេលល្ងាចបែបស៊ីវិល័យ។',
    themeColors: ['#fb7185', '#f43f5e', '#e2e8f0', '#ffffff'],
    gradientClass: 'from-rose-400 via-pink-300 to-amber-200',
    cardBg: '#faf8f5',
    accentColor: '#e11d48',
    tag: 'ទាន់សម័យ (Modern)',
    icon: <Sparkles className="w-4 h-4 text-rose-400" />,
  },
  {
    id: 'tmpl-03',
    titleKhmer: 'បុរាណប្រពៃណីខ្មែរ',
    titleEnglish: 'Heritage Classical Crimson Silk',
    badge: 'Khmer Heritage',
    description: 'ក្បាច់ផ្កាចន្ទន៍ និងសូត្រខ្មែរពណ៌ក្រហមឈាមជ្រូក & មាស បង្កប់នូវភាពថ្លៃថ្នូរ និងមង្គលការខ្មែរបុរាណ។',
    themeColors: ['#b91c1c', '#dc2626', '#f59e0b', '#140a08'],
    gradientClass: 'from-red-600 via-rose-500 to-amber-400',
    cardBg: '#1a0d0b',
    accentColor: '#b91c1c',
    tag: 'ប្រពៃណីដើម (Heritage)',
    icon: <Flower2 className="w-4 h-4 text-rose-500" />,
  },
  {
    id: 'tmpl-04',
    titleKhmer: 'ធម្មជាតិមនោរម្យ',
    titleEnglish: 'Romantic Botanical Garden',
    badge: 'Garden Romance',
    description: 'បរិយាកាសសួនមង្គល ផ្កាម្លិះ និងកុលាបស្រស់ ពណ៌បៃតងខ្ចី និង Pastel ផ្អែមល្ហែម សាកសមពិធីបែបសួន។',
    themeColors: ['#10b981', '#059669', '#a3e635', '#0a120c'],
    gradientClass: 'from-emerald-500 via-teal-400 to-lime-300',
    cardBg: '#0f1a12',
    accentColor: '#10b981',
    tag: 'បរិយាកាសសួន (Botanical)',
    icon: <Leaf className="w-4 h-4 text-emerald-400" />,
  },
  {
    id: 'tmpl-05',
    titleKhmer: 'រាត្រីតារារះ',
    titleEnglish: 'Grand Midnight Celestial Gala',
    badge: 'Celestial Luxury',
    description: 'រាត្រីសមោសរពន្លឺតារារះ ពណ៌ទឹកប៊ិចរាជវាំង Sapphire & Midnight Blue ក្រោមពន្លឺតារាមាសដ៏ត្រចះត្រចង់។',
    themeColors: ['#38bdf8', '#6366f1', '#fbbf24', '#070b14'],
    gradientClass: 'from-sky-400 via-indigo-400 to-amber-300',
    cardBg: '#0d1527',
    accentColor: '#38bdf8',
    tag: 'រាត្រីសមោសរ (Gala Dinner)',
    icon: <Moon className="w-4 h-4 text-sky-400" />,
  },
];

export const TemplateEditorTab: React.FC<TemplateEditorTabProps> = ({
  initialWedding,
  initialTemplate,
  onTemplateUpdated,
}) => {
  const [wedding, setWedding] = useState<WeddingEvent | null>(initialWedding || null);
  const [template, setTemplate] = useState<WeddingTemplate | null>(initialTemplate || null);
  const [loading, setLoading] = useState(!initialWedding || !initialTemplate);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  // Interactive Live RSVP Modal Preview state (Requirement 3)
  const [isPreviewRsvpOpen, setIsPreviewRsvpOpen] = useState(false);
  const [previewRsvpChoice, setPreviewRsvpChoice] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [previewRsvpCount, setPreviewRsvpCount] = useState<number>(2);
  const [previewRsvpDietary, setPreviewRsvpDietary] = useState<'standard' | 'vegetarian' | 'halal' | 'none'>('standard');
  const [previewRsvpGuestName, setPreviewRsvpGuestName] = useState('ឯកឧត្តម លោកជំទាវ លោកអ្នកមានកិត្តិយស');
  const [previewRsvpPhone, setPreviewRsvpPhone] = useState('012 888 999');
  const [previewRsvpMessage, setPreviewRsvpMessage] = useState('សូមប្រសិទ្ធពរជ័យ សិរីសួស្តី ជ័យមង្គល វិបុលសុខ ដល់គូស្វាមីភរិយាថ្មី!');
  const [previewRsvpSubmitted, setPreviewRsvpSubmitted] = useState(false);
  
  // Editor Navigation Tabs (Includes the 5 Templates Selector as primary tab)
  const [activeEditorTab, setActiveEditorTab] = useState<'templates' | 'content' | 'design' | 'sections' | 'images'>('templates');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [previewMode, setPreviewMode] = useState<'full' | 'sections'>('full');

  // Load current data
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        if (!initialWedding || !initialTemplate) {
          setLoading(true);
        }
        const [wData, tData] = await Promise.all([
          api.getWedding().catch(() => null),
          api.getTemplate().catch(() => null),
        ]);
        if (isMounted) {
          if (wData?.wedding) setWedding(wData.wedding);
          if (tData) setTemplate(tData);
        }
      } catch (err) {
        console.warn('Notice: Using default template data in editor:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [initialWedding, initialTemplate]);

  const handleSelectTemplate = async (templateId: 'tmpl-01' | 'tmpl-02' | 'tmpl-03' | 'tmpl-04' | 'tmpl-05') => {
    if (!wedding || !template) return;
    const preset = TEMPLATE_PRESETS.find((p) => p.id === templateId);
    if (!preset) return;

    const updatedWedding: WeddingEvent = {
      ...wedding,
      selectedTemplateId: templateId,
    };

    const updatedTemplate: WeddingTemplate = {
      ...template,
      templateId,
      nameKhmer: preset.titleKhmer,
      nameEnglish: preset.titleEnglish,
      theme: {
        ...template.theme,
        accentColor: preset.accentColor,
        cardBg: preset.cardBg,
      },
    };

    setWedding(updatedWedding);
    setTemplate(updatedTemplate);
    onTemplateUpdated(updatedWedding, updatedTemplate);

    try {
      await api.selectTemplate(templateId);
      await api.updateWedding(updatedWedding);
      await api.updateTemplate(updatedTemplate);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.warn('Failed to sync template choice to server:', err);
    }
  };

  const handleWeddingChange = (field: keyof WeddingEvent, value: string) => {
    if (!wedding) return;
    setWedding({ ...wedding, [field]: value });
  };

  const handleThemeChange = (key: 'accentColor' | 'primaryFont' | 'displayFont' | 'cardBg', val: string) => {
    if (!template) return;
    setTemplate({
      ...template,
      theme: { ...template.theme, [key]: val },
    });
  };

  const handleToggleSection = (sectionId: string) => {
    if (!template) return;
    const updated = template.sections.map((s: TemplateSectionConfig) => (s.id === sectionId ? { ...s, enabled: !s.enabled } : s));
    setTemplate({ ...template, sections: updated });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (!template) return;
    const newSections = [...template.sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;

    // re-assign sortOrder
    newSections.forEach((s, idx) => (s.sortOrder = idx + 1));
    setTemplate({ ...template, sections: newSections });
  };

  const handleImageUpload = (field: 'heroImage' | 'coupleImage' | 'banquetImage' | 'venueImage') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !wedding) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await api.uploadImage(base64, file.name, file.type);
          setWedding({ ...wedding, [field]: res.url });
        } catch {
          // fallback to base64
          setWedding({ ...wedding, [field]: base64 });
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleSaveAll = async () => {
    if (!wedding || !template) return;
    try {
      setSaving(true);
      setSaveError('');
      await Promise.all([
        api.updateWedding(wedding),
        api.updateTemplate(template),
        api.selectTemplate(wedding.selectedTemplateId),
      ]);
      setSaveSuccess(true);
      onTemplateUpdated(wedding, template);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError('បរាជ័យក្នុងការរក្សាទុក។ សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត ហើយសាកល្បងម្តងទៀត។');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !wedding || !template) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-stone-400">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mb-3" />
        <p className="text-xs">កំពុងផ្ទុក Template Editor...</p>
      </div>
    );
  }

  const currentPreset = TEMPLATE_PRESETS.find((p) => p.id === wedding.selectedTemplateId) || TEMPLATE_PRESETS[0];

  return (
    <div className="space-y-6">
      
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h2 className="font-moul text-xl text-gold-gradient mb-1">
            កែសម្រួល Wedding Template (Live Editor)
          </h2>
          <p className="text-xs text-stone-400">
            ជ្រើសរើស Template ថ្មីទាំង ៥ កែប្រែខ្លឹមសារ ពណ៌ រូបភាព និងមើលការផ្លាស់ប្តូរភ្លាមៗលើ Live Preview
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg shadow-sm">
              <Check className="w-4 h-4" />
              <span>បានរក្សាទុកជោគជ័យ!</span>
            </span>
          )}

          {saveError && (
            <span className="text-xs text-rose-400 flex items-center gap-1 bg-rose-950/60 border border-rose-800/60 px-3 py-1.5 rounded-lg shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{saveError}</span>
            </span>
          )}

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50 transition-all"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក Template'}</span>
          </button>
        </div>
      </div>

      {/* Quick Active Template Status Bar */}
      <div className="p-3 bg-[#141210] border border-amber-500/20 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            {currentPreset.icon}
          </div>
          <div>
            <div className="text-[10px] text-stone-400 uppercase tracking-wider">
              Template កំពុងប្រើប្រាស់ (Active Template):
            </div>
            <div className="font-moul text-sm text-stone-100 flex items-center gap-2">
              <span className="text-gold-gradient">{currentPreset.titleKhmer}</span>
              <span className="text-[10px] text-stone-400 font-normal">({currentPreset.titleEnglish})</span>
            </div>
          </div>
        </div>

        {/* 5 Quick Template Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {TEMPLATE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectTemplate(preset.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                wedding.selectedTemplateId === preset.id
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <span>{preset.titleKhmer}</span>
              {wedding.selectedTemplateId === preset.id && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Dual Pane Layout: Left Controls | Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Pane: Editor Controls (6 cols on lg) */}
        <div className="lg:col-span-6 bg-[#141210] rounded-2xl border border-stone-800 p-5 space-y-5">
          
          {/* Editor Sub-Tabs (Includes 5 Templates Selector) */}
          <div className="flex items-center gap-1 p-1 bg-black/50 rounded-xl border border-stone-800 text-xs overflow-x-auto no-scrollbar">
            
            <button
              onClick={() => setActiveEditorTab('templates')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeEditorTab === 'templates'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Templates (៥ ម៉ូដ)</span>
            </button>

            <button
              onClick={() => setActiveEditorTab('content')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeEditorTab === 'content'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>ខ្លឹមសារ</span>
            </button>

            <button
              onClick={() => setActiveEditorTab('design')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeEditorTab === 'design'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>រចនា & ពណ៌</span>
            </button>

            <button
              onClick={() => setActiveEditorTab('sections')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeEditorTab === 'sections'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Sections</span>
            </button>

            <button
              onClick={() => setActiveEditorTab('images')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeEditorTab === 'images'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>រូបភាព</span>
            </button>

          </div>

          {/* SUB-TAB 0: 5 TEMPLATES SELECTOR (Requested Feature) */}
          {activeEditorTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-moul text-sm text-stone-100">
                    ជ្រើសរើស Template អាពាហ៍ពិពាហ៍ថ្មី (Select from 5 Templates)
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    ចុចលើ Template ណាមួយ ដើម្បីប្តូររូបរាងភ្លាមៗក្នុង Live Preview ដោយមិនបាត់បង់ទិន្នន័យ
                  </p>
                </div>
              </div>

              {/* Grid of 5 Unique Template Cards */}
              <div className="space-y-3">
                {TEMPLATE_PRESETS.map((preset, index) => {
                  const isSelected = wedding.selectedTemplateId === preset.id;

                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectTemplate(preset.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                        isSelected
                          ? 'bg-[#1a1713] border-amber-400 ring-2 ring-amber-400/30 shadow-xl'
                          : 'bg-black/40 border-stone-800 hover:border-stone-700 hover:bg-stone-900/50'
                      }`}
                    >
                      {/* Active Pill Badge */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold flex items-center gap-1 shadow-md">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>កំពុងប្រើប្រាស់</span>
                        </div>
                      )}

                      <div className="flex items-start gap-3.5">
                        
                        {/* Number Index & Icon */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                            : 'bg-stone-800 border-stone-700 text-stone-400'
                        }`}>
                          {preset.icon}
                        </div>

                        <div className="flex-1 space-y-1.5 pr-20">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800/80 text-stone-400 font-mono">
                              ម៉ូដទី {index + 1}
                            </span>
                            <span className="text-[10px] text-amber-400/90 font-medium">
                              {preset.tag}
                            </span>
                          </div>

                          <h4 className="font-moul text-sm text-stone-100 group-hover:text-amber-300 transition-colors">
                            {preset.titleKhmer}
                          </h4>
                          <p className="text-[11px] text-stone-400 font-cinzel">
                            {preset.titleEnglish}
                          </p>

                          <p className="text-[11px] text-stone-300 leading-relaxed pt-1">
                            {preset.description}
                          </p>

                          {/* Theme Color Palette Swatches */}
                          <div className="flex items-center gap-2 pt-2">
                            <span className="text-[10px] text-stone-500">កូដពណ៌ចម្បង៖</span>
                            <div className="flex items-center gap-1.5">
                              {preset.themeColors.map((color, i) => (
                                <span
                                  key={i}
                                  className="w-3.5 h-3.5 rounded-full border border-stone-700 shadow-sm"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Action Bar */}
                      <div className="mt-3 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-stone-500">
                          {isSelected ? '✓ បានអនុវត្តលើទំព័រសំបុត្រ' : 'ចុចលើប្រអប់នេះដើម្បីជ្រើសរើស'}
                        </span>

                        <button
                          type="button"
                          className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-stone-800 text-stone-300 group-hover:bg-amber-500 group-hover:text-stone-950'
                          }`}
                        >
                          {isSelected ? 'កំពុងជ្រើសរើស' : 'ជ្រើសរើស Template នេះ'}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-Tab 1: Content & Texts */}
          {activeEditorTab === 'content' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>ការកែប្រែនៅទីនេះនឹងបង្ហាញក្នុង Live Preview ខាងស្តាំភ្លាមៗ</span>
              </div>

              {/* Groom & Bride Names */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    ឈ្មោះកូនកំលោះ (Khmer)
                  </label>
                  <input
                    type="text"
                    value={wedding.groomNameKhmer}
                    onChange={(e) => handleWeddingChange('groomNameKhmer', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    ឈ្មោះកូនក្រមុំ (Khmer)
                  </label>
                  <input
                    type="text"
                    value={wedding.brideNameKhmer}
                    onChange={(e) => handleWeddingChange('brideNameKhmer', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Parents Names */}
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  មាតាបិតាខាងកូនប្រុស
                </label>
                <input
                  type="text"
                  value={wedding.groomParentsKhmer}
                  onChange={(e) => handleWeddingChange('groomParentsKhmer', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  មាតាបិតាខាងកូនស្រី
                </label>
                <input
                  type="text"
                  value={wedding.brideParentsKhmer}
                  onChange={(e) => handleWeddingChange('brideParentsKhmer', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    កាលបរិច្ឆេទ (Khmer)
                  </label>
                  <input
                    type="text"
                    value={wedding.weddingDateKhmer}
                    onChange={(e) => handleWeddingChange('weddingDateKhmer', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    ម៉ោងពិធីជប់លៀង
                  </label>
                  <input
                    type="text"
                    value={wedding.weddingTimeKhmer}
                    onChange={(e) => handleWeddingChange('weddingTimeKhmer', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Venue & Hall */}
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  ទីតាំងមង្គលការ / អគារសាល
                </label>
                <input
                  type="text"
                  value={wedding.venueNameKhmer}
                  onChange={(e) => handleWeddingChange('venueNameKhmer', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  អាសយដ្ឋានទីតាំង
                </label>
                <input
                  type="text"
                  value={wedding.addressKhmer}
                  onChange={(e) => handleWeddingChange('addressKhmer', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Closing Message */}
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  សារថ្លែងអំណរគុណ
                </label>
                <textarea
                  rows={3}
                  value={wedding.closingMessageKhmer}
                  onChange={(e) => handleWeddingChange('closingMessageKhmer', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Design & Palette */}
          {activeEditorTab === 'design' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-moul text-stone-200 text-sm">
                ការកំណត់រចនាបថ និងពុម្ពអក្សរ
              </h4>

              {/* Accent Color */}
              <div>
                <label className="block text-stone-300 font-medium mb-1.5">
                  ពណ៌ Accent (Metallic Accent)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={template.theme.accentColor}
                    onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                    className="w-10 h-10 rounded-xl border border-stone-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={template.theme.accentColor}
                    onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                    className="w-32 px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Card Background Color */}
              <div>
                <label className="block text-stone-300 font-medium mb-1.5">
                  ពណ៌ផ្ទៃខាងក្រោយកាត (Card Background)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={template.theme.cardBg}
                    onChange={(e) => handleThemeChange('cardBg', e.target.value)}
                    className="w-10 h-10 rounded-xl border border-stone-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={template.theme.cardBg}
                    onChange={(e) => handleThemeChange('cardBg', e.target.value)}
                    className="w-32 px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    ពុម្ពអក្សរចំណងជើង (Display Font)
                  </label>
                  <select
                    value={template.theme.displayFont}
                    onChange={(e) => handleThemeChange('displayFont', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="font-moul">Moul (ក្បាច់បុរាណរាជវាំង)</option>
                    <option value="font-battambang">Battambang (អក្សរឆ្លាក់បែបសម័យ)</option>
                    <option value="font-kantumruy">Kantumruy Pro (អក្សរសម័យទំនើប)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    ពុម្ពអក្សរតួសេចក្តី (Body Font)
                  </label>
                  <select
                    value={template.theme.primaryFont}
                    onChange={(e) => handleThemeChange('primaryFont', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="font-kantumruy">Kantumruy Pro (ងាយស្រួលអាន)</option>
                    <option value="font-battambang">Battambang</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Sections Toggle & Order */}
          {activeEditorTab === 'sections' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-moul text-stone-200 text-sm">
                រៀបចំផ្នែកនានានៅលើសំបុត្រ (Sections Order)
              </h4>
              <p className="text-[11px] text-stone-400">
                បើក ឬបិទផ្នែកណាមួយ (Section) ហើយរៀបចំលំដាប់ឡើងលើ/ចុះក្រោម៖
              </p>

              <div className="space-y-2">
                {template.sections.map((section: TemplateSectionConfig, idx: number) => (
                  <div
                    key={section.id}
                    className="p-3 rounded-xl bg-black/40 border border-stone-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={section.enabled}
                        onChange={() => handleToggleSection(section.id)}
                        className="rounded border-stone-700 text-amber-500 focus:ring-amber-400"
                      />
                      <div>
                        <span className={`font-medium ${section.enabled ? 'text-stone-200' : 'text-stone-500 line-through'}`}>
                          {section.titleKhmer || section.nameKhmer}
                        </span>
                        <span className="text-[10px] text-stone-500 block font-mono">
                          Type: {section.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveSection(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSection(idx, 'down')}
                        disabled={idx === template.sections.length - 1}
                        className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Tab 4: Image Management */}
          {activeEditorTab === 'images' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-moul text-stone-200 text-sm">
                គ្រប់គ្រងរូបភាព Pre-wedding & ទីតាំង
              </h4>

              <div className="grid grid-cols-2 gap-3">
                
                {/* Hero Image */}
                <div className="p-3 rounded-xl bg-black/40 border border-stone-800 space-y-2">
                  <span className="font-medium text-stone-300 block text-[11px]">
                    រូបភាពចម្បង (Hero Banner)
                  </span>
                  <div className="aspect-video rounded-lg overflow-hidden border border-stone-700 bg-black">
                    <img src={wedding.heroImage} alt="Hero" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleImageUpload('heroImage')}
                    className="w-full py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>ប្តូររូបភាព</span>
                  </button>
                </div>

                {/* Couple Image */}
                <div className="p-3 rounded-xl bg-black/40 border border-stone-800 space-y-2">
                  <span className="font-medium text-stone-300 block text-[11px]">
                    រូបថតគូស្នេហ៍ (Couple Photo)
                  </span>
                  <div className="aspect-video rounded-lg overflow-hidden border border-stone-700 bg-black">
                    <img src={wedding.coupleImage} alt="Couple" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleImageUpload('coupleImage')}
                    className="w-full py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>ប្តូររូបភាព</span>
                  </button>
                </div>

                {/* Banquet Image */}
                <div className="p-3 rounded-xl bg-black/40 border border-stone-800 space-y-2">
                  <span className="font-medium text-stone-300 block text-[11px]">
                    រូបភាពតុអាហារ (Banquet)
                  </span>
                  <div className="aspect-video rounded-lg overflow-hidden border border-stone-700 bg-black">
                    <img src={wedding.banquetImage} alt="Banquet" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleImageUpload('banquetImage')}
                    className="w-full py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>ប្តូររូបភាព</span>
                  </button>
                </div>

                {/* Venue Image */}
                <div className="p-3 rounded-xl bg-black/40 border border-stone-800 space-y-2">
                  <span className="font-medium text-stone-300 block text-[11px]">
                    រូបភាពអគារទីតាំង (Venue)
                  </span>
                  <div className="aspect-video rounded-lg overflow-hidden border border-stone-700 bg-black">
                    <img src={wedding.venueImage} alt="Venue" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleImageUpload('venueImage')}
                    className="w-full py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>ប្តូររូបភាព</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Right Pane: Real-Time Live Preview (6 cols on lg) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Live Preview Controls Header */}
          <div className="flex items-center justify-between p-2.5 bg-[#141210] rounded-2xl border border-stone-800 text-xs">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-stone-200">
                Live Preview ({currentPreset.titleKhmer})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Device Toggle */}
              <div className="flex items-center p-0.5 rounded-lg bg-black/60 border border-stone-800 text-stone-400">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-amber-500 text-stone-950 font-bold' : 'hover:text-stone-200'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-amber-500 text-stone-950 font-bold' : 'hover:text-stone-200'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* View Mode: Full Template vs Dynamic Sections */}
              <button
                type="button"
                onClick={() => setPreviewMode(previewMode === 'full' ? 'sections' : 'full')}
                className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-[11px] font-medium border border-stone-700 cursor-pointer"
              >
                {previewMode === 'full' ? 'ម៉ូដ៖ ពេញលេញ' : 'ម៉ូដ៖ Sections'}
              </button>
            </div>
          </div>

          {/* Preview Container Mockup */}
          <div className="w-full flex justify-center">
            <div
              className={`rounded-2xl border-2 border-stone-700 overflow-hidden shadow-2xl transition-all duration-300 ${
                previewDevice === 'mobile' ? 'w-full max-w-[390px] h-[720px]' : 'w-full h-[720px]'
              } flex flex-col`}
              style={{ backgroundColor: currentPreset.cardBg }}
            >
              {/* Device Header Bar */}
              <div className="py-2 px-4 bg-[#12100e] border-b border-stone-800 flex items-center justify-between text-[11px] text-stone-400 shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="font-moul text-amber-300 truncate">
                    {wedding.groomNameKhmer} & {wedding.brideNameKhmer}
                  </span>
                </div>
                <span className="text-[10px] text-amber-400 font-medium shrink-0">
                  {currentPreset.titleKhmer}
                </span>
              </div>

              {/* Scrollable Live Preview Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                
                {previewMode === 'full' ? (
                  /* RENDER ACCORDING TO SELECTED OF THE 5 TEMPLATES */
                  <div>
                    {wedding.selectedTemplateId === 'tmpl-01' && (
                      <Template01Royal
                        wedding={wedding}
                        guestName="ឯកឧត្តម លោកជំទាវ លោកអ្នកមានកិត្តិយស"
                        paymentMethods={[]}
                        onOpenRsvp={() => {
                          setIsPreviewRsvpOpen(true);
                          setPreviewRsvpSubmitted(false);
                        }}
                        onOpenImageModal={() => {}}
                      />
                    )}
                    {wedding.selectedTemplateId === 'tmpl-02' && (
                      <Template02Modern
                        wedding={wedding}
                        guestName="ឯកឧត្តម លោកជំទាវ លោកអ្នកមានកិត្តិយស"
                        paymentMethods={[]}
                        onOpenRsvp={() => {
                          setIsPreviewRsvpOpen(true);
                          setPreviewRsvpSubmitted(false);
                        }}
                        onOpenImageModal={() => {}}
                      />
                    )}
                    {wedding.selectedTemplateId === 'tmpl-03' && (
                      <Template03Traditional
                        wedding={wedding}
                        guestName="ឯកឧត្តម លោកជំទាវ លោកអ្នកមានកិត្តិយស"
                        paymentMethods={[]}
                        onOpenRsvp={() => {
                          setIsPreviewRsvpOpen(true);
                          setPreviewRsvpSubmitted(false);
                        }}
                        onOpenImageModal={() => {}}
                      />
                    )}
                    {wedding.selectedTemplateId === 'tmpl-04' && (
                      <Template04Garden
                        wedding={wedding}
                        guestName="ឯកឧត្តម លោកជំទាវ លោកអ្នកមានកិត្តិយស"
                        paymentMethods={[]}
                        onOpenRsvp={() => {
                          setIsPreviewRsvpOpen(true);
                          setPreviewRsvpSubmitted(false);
                        }}
                        onOpenImageModal={() => {}}
                      />
                    )}
                    {wedding.selectedTemplateId === 'tmpl-05' && (
                      <Template05Midnight
                        wedding={wedding}
                        guestName="ឯកឧត្តម លោកជំទាវ លោកអ្នកមានកិត្តិយស"
                        paymentMethods={[]}
                        onOpenRsvp={() => {
                          setIsPreviewRsvpOpen(true);
                          setPreviewRsvpSubmitted(false);
                        }}
                        onOpenImageModal={() => {}}
                      />
                    )}
                  </div>
                ) : (
                  /* SECTIONS PREVIEW */
                  <div className="p-4 space-y-6 text-stone-100">
                    
                    {/* Hero Preview */}
                    {template.sections.find((s: TemplateSectionConfig) => s.type === 'hero')?.enabled && (
                      <div className="text-center space-y-3 pt-2">
                        <span className="text-[10px] uppercase tracking-widest text-amber-400">
                          សិរីសួស្តី អាពាហ៍ពិពាហ៍
                        </span>
                        <h3 className="font-moul text-lg text-gold-gradient leading-relaxed">
                          {wedding.groomNameKhmer} & {wedding.brideNameKhmer}
                        </h3>
                        <p className="text-[11px] text-stone-300">
                          {wedding.weddingDateKhmer}
                        </p>
                        <p className="text-[10px] text-amber-300">
                          ពិធីជប់លៀង៖ {wedding.weddingTimeKhmer}
                        </p>
                        <div className="rounded-xl overflow-hidden aspect-video border border-amber-500/30">
                          <img src={wedding.heroImage} alt="Hero" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}

                    {/* Parents Preview */}
                    {template.sections.find((s: TemplateSectionConfig) => s.type === 'couple')?.enabled && (
                      <div className="p-3 rounded-xl bg-[#141210] border border-stone-800 text-[11px] space-y-2">
                        <div>
                          <span className="text-amber-400/80 block font-medium">មាតាបិតាខាងប្រុស៖</span>
                          <p className="text-stone-200">{wedding.groomParentsKhmer}</p>
                        </div>
                        <div>
                          <span className="text-amber-400/80 block font-medium">មាតាបិតាខាងស្រី៖</span>
                          <p className="text-stone-200">{wedding.brideParentsKhmer}</p>
                        </div>
                      </div>
                    )}

                    {/* Venue Preview */}
                    {template.sections.find((s: TemplateSectionConfig) => s.type === 'venue')?.enabled && (
                      <div className="p-3 rounded-xl bg-[#141210] border border-stone-800 text-[11px] space-y-1.5">
                        <span className="text-amber-400 font-medium block">ទីតាំងរៀបចំពិធី៖</span>
                        <p className="font-moul text-xs text-stone-100">{wedding.venueNameKhmer}</p>
                        <p className="text-[10px] text-stone-300">{wedding.addressKhmer}</p>
                      </div>
                    )}

                    {/* Closing Message */}
                    {template.sections.find((s: TemplateSectionConfig) => s.type === 'closing')?.enabled && (
                      <div className="text-center p-3 rounded-xl bg-black/40 border border-stone-800 text-[10px] text-stone-300 leading-relaxed">
                        {wedding.closingMessageKhmer}
                      </div>
                    )}

                  </div>
                )}

              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive RSVP Live Preview Modal */}
      {isPreviewRsvpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#141210] rounded-2xl border border-amber-500/40 p-6 shadow-2xl overflow-hidden text-stone-100 max-h-[90vh] overflow-y-auto font-kantumruy">
            
            {/* Close Button */}
            <button
              onClick={() => setIsPreviewRsvpOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!previewRsvpSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPreviewRsvpSubmitted(true);
                  if (previewRsvpChoice === 'yes') {
                    confetti({
                      particleCount: 80,
                      spread: 70,
                      origin: { y: 0.6 },
                      colors: ['#D4AF37', '#E5C07B', '#FFFFFF', '#F43F5E', '#10B981'],
                    });
                  }
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-medium mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>សាកល្បង RSVP Live Preview</span>
                  </div>
                  <h3 className="font-moul text-base text-gold-gradient">
                    ឆ្លើយតបការចូលរួម (RSVP Preview)
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    សាកល្បងដំណើរការឆ្លើយតបវត្តមានដែលភ្ញៀវពិតប្រាកដនឹងជួបប្រទះ
                  </p>
                </div>

                {/* Attendance Choice Buttons */}
                <div>
                  <label className="block text-stone-300 font-medium mb-1.5">
                    វត្តមានចូលរួមរបស់លោកអ្នក <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewRsvpChoice('yes')}
                      className={`py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                        previewRsvpChoice === 'yes'
                          ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold shadow-md'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                      <span className="block text-[11px]">នឹងចូលរួម</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewRsvpChoice('no')}
                      className={`py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                        previewRsvpChoice === 'no'
                          ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 font-bold shadow-md'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <X className="w-4 h-4 mx-auto mb-1 text-rose-400" />
                      <span className="block text-[11px]">មិនចូលរួម</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewRsvpChoice('maybe')}
                      className={`py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                        previewRsvpChoice === 'maybe'
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold shadow-md'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <Heart className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                      <span className="block text-[11px]">មិនទាន់ច្បាស់</span>
                    </button>
                  </div>
                </div>

                {/* If Yes: Guest Count & Dietary */}
                {previewRsvpChoice === 'yes' && (
                  <>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">
                        ចំនួនអ្នកចូលរួម (Guest Count)
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setPreviewRsvpCount(Math.max(1, previewRsvpCount - 1))}
                          className="w-8 h-8 rounded-lg bg-stone-800 text-stone-200 font-bold hover:bg-stone-700 cursor-pointer flex items-center justify-center border border-stone-700"
                        >
                          -
                        </button>
                        <span className="font-moul text-base text-amber-300 font-mono w-16 text-center">
                          {previewRsvpCount} នាក់
                        </span>
                        <button
                          type="button"
                          onClick={() => setPreviewRsvpCount(Math.min(5, previewRsvpCount + 1))}
                          className="w-8 h-8 rounded-lg bg-stone-800 text-stone-200 font-bold hover:bg-stone-700 cursor-pointer flex items-center justify-center border border-stone-700"
                        >
                          +
                        </button>
                        <span className="text-[11px] text-stone-400 ml-2">
                          (កូតាអនុញ្ញាតសម្រាប់សំបុត្រនេះ)
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-300 font-medium mb-1">
                        ចំណង់ចំណូលចិត្តអាហារ (Dietary Preference)
                      </label>
                      <select
                        value={previewRsvpDietary}
                        onChange={(e) => setPreviewRsvpDietary(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-200 focus:outline-none focus:border-amber-400"
                      >
                        <option value="standard">អាហារទូទៅ (Standard Banquet)</option>
                        <option value="vegetarian">អាហារបួស (Vegetarian)</option>
                        <option value="halal">អាហារហាឡាល (Halal)</option>
                        <option value="none">គ្មានការកំណត់ (No restriction)</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Name */}
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    ឈ្មោះភ្ញៀវកិត្តិយស
                  </label>
                  <input
                    type="text"
                    value={previewRsvpGuestName}
                    onChange={(e) => setPreviewRsvpGuestName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    លេខទូរស័ព្ទ ឬ Telegram
                  </label>
                  <input
                    type="text"
                    value={previewRsvpPhone}
                    onChange={(e) => setPreviewRsvpPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Wishes Message */}
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    ពាក្យជូនពរដល់គូស្នេហ៍
                  </label>
                  <textarea
                    rows={2}
                    value={previewRsvpMessage}
                    onChange={(e) => setPreviewRsvpMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPreviewRsvpOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium transition-colors cursor-pointer"
                  >
                    បិទ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>បញ្ជាក់ការឆ្លើយតប (Submit RSVP)</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Success Confirmation Card */
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="font-moul text-lg text-gold-gradient mb-1">
                    ការឆ្លើយតបបានជោគជ័យ!
                  </h3>
                  <p className="text-xs text-stone-300">
                    សូមអរគុណយ៉ាងជ្រាលជ្រៅចំពោះការឆ្លើយតបវត្តមាន
                  </p>
                </div>

                {/* Digital Ticket Pass Card */}
                <div className="p-4 rounded-xl bg-[#181512] border border-amber-500/30 text-left text-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="text-stone-400">ឈ្មោះភ្ញៀវ៖</span>
                    <strong className="text-amber-300 font-medium">{previewRsvpGuestName}</strong>
                  </div>
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="text-stone-400">ស្ថានភាព៖</span>
                    <span className="text-emerald-400 font-semibold">
                      {previewRsvpChoice === 'yes' ? `នឹងចូលរួម (${previewRsvpCount} នាក់)` : previewRsvpChoice === 'no' ? 'មិនចូលរួម' : 'មិនទាន់ច្បាស់'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="text-stone-400">កាលបរិច្ឆេទ៖</span>
                    <span className="text-stone-200">{wedding.weddingDateKhmer}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">ទីតាំង៖</span>
                    <span className="text-stone-200">{wedding.venueNameKhmer}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPreviewRsvpSubmitted(false)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium cursor-pointer"
                  >
                    សាកល្បងម្តងទៀត
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPreviewRsvpOpen(false)}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold cursor-pointer"
                  >
                    រួចរាល់
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
