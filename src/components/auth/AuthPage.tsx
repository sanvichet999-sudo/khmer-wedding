import React, { useState } from 'react';
import {
  Phone,
  ShieldCheck,
  User,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ExternalLink,
  Heart,
  QrCode,
  Users,
} from 'lucide-react';
import { api } from '../../services/api';
import { AuthResponse } from '../../types/fullstack';

interface AuthPageProps {
  onLoginSuccess: (authData: AuthResponse) => void;
  onPreviewPublicInvitation: () => void;
  onOpenInvitationToken: (token: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  onPreviewPublicInvitation,
  onOpenInvitationToken,
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  
  // Login / Signup Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  
  // Loading & Feedback
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState<string | null>(null);

  // Guest Quick Token Search
  const [guestTokenInput, setGuestTokenInput] = useState('');

  // Handle Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const clean = phone.replace(/[\s-+]/g, '');
    if (clean.length < 8) {
      setError('សូមបញ្ចូលលេខទូរស័ព្ទឱ្យបានត្រឹមត្រូវ (យ៉ាងហោច ៨ ខ្ទង់)');
      return;
    }

    if (tab === 'signup' && !fullName.trim()) {
      setError('សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក');
      return;
    }

    try {
      setSendingOtp(true);
      const res = await api.sendOtp(clean);
      setStep('otp');
      setSimulatedOtpNotice(`លេខកូដ OTP សម្រាប់ផ្ទៀងផ្ទាត់គឺ: ${res.code}`);
      setOtpCode(res.code); // Pre-fill for seamless frictionless UX
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'បរាជ័យក្នុងការផ្ញើ OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const clean = phone.replace(/[\s-+]/g, '');
    if (!otpCode || otpCode.trim().length !== 6) {
      setError('សូមបញ្ចូលលេខកូដ OTP ចំនួន ៦ ខ្ទង់');
      return;
    }

    try {
      setVerifying(true);
      const res = await api.verifyOtp(clean, otpCode.trim(), tab === 'signup' ? fullName.trim() : undefined);
      onLoginSuccess(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'លេខកូដ OTP មិនត្រឹមត្រូវ');
    } finally {
      setVerifying(false);
    }
  };

  // Quick One-Click Seed Login for Demo & Testing
  const handleQuickSeedLogin = async (seedPhone: string, seedName: string) => {
    setError('');
    setVerifying(true);
    try {
      // 012888999 & 016777888 are pre-seeded in server
      const res = await api.verifyOtp(seedPhone, '123456', seedName);
      onLoginSuccess(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed demo login');
    } finally {
      setVerifying(false);
    }
  };

  const handleGuestTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestTokenInput.trim()) return;
    onOpenInvitationToken(guestTokenInput.trim());
  };

  return (
    <div className="min-h-screen bg-[#080706] text-stone-100 flex flex-col font-kantumruy relative overflow-hidden">
      
      {/* Decorative Golden Ambient Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-amber-600/15 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 border-b border-stone-800/80 bg-[#0f0e0c]/80 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center text-stone-950 font-bold shadow-md shadow-amber-500/20">
            <Heart className="w-4 h-4 fill-stone-950" />
          </div>
          <div>
            <h1 className="font-moul text-sm sm:text-base text-gold-gradient tracking-wide leading-tight">
              ប្រព័ន្ធគ្រប់គ្រងសំបុត្រអាពាហ៍ពិពាហ៍
            </h1>
            <p className="text-[10px] text-stone-400">
              Khmer Wedding Invitation & Guest Management System
            </p>
          </div>
        </div>

        <button
          onClick={onPreviewPublicInvitation}
          className="text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">មើលគំរូសំបុត្រអញ្ជើញ</span>
        </button>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6">

          {/* Central Logo & Welcome Crest */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-[#241f17] to-[#14120e] border border-amber-500/30 shadow-xl shadow-amber-500/10 text-amber-400 mb-1">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="font-moul text-xl sm:text-2xl text-gold-gradient">
              {tab === 'login' ? 'ចូលគ្រប់គ្រងកម្មវិធី' : 'បង្កើតគណនីកម្មវិធីថ្មី'}
            </h2>
            <p className="text-xs text-stone-400 max-w-xs mx-auto">
              {tab === 'login'
                ? 'សូមបញ្ចូលលេខទូរស័ព្ទរបស់អ្នក ដើម្បីទទួលលេខកូដ OTP និងចូលទៅកាន់ផ្ទាំង Admin'
                : 'ចុះឈ្មោះដោយប្រើលេខទូរស័ព្ទផ្ទាល់ខ្លួន ដើម្បីចាប់ផ្តើមរៀបចំសំបុត្រ និងគ្រប់គ្រងភ្ញៀវ'}
            </p>
          </div>

          {/* Switch Tab (Login vs Sign Up) */}
          <div className="bg-[#14120e] p-1 rounded-xl border border-stone-800 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setStep('phone');
                setError('');
                setSimulatedOtpNotice(null);
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              ចូលគណនី (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setStep('phone');
                setError('');
                setSimulatedOtpNotice(null);
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                tab === 'signup'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              ចុះឈ្មោះថ្មី (Sign Up)
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-[#12100e]/90 border border-amber-500/25 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative">
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* OTP Notification Toast */}
            {simulatedOtpNotice && step === 'otp' && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-700/80 text-emerald-200 text-xs flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span className="font-medium">{simulatedOtpNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpCode(simulatedOtpNotice.replace(/\D/g, ''))}
                  className="text-[11px] underline text-emerald-300 font-bold hover:text-emerald-100 cursor-pointer"
                >
                  បញ្ចូលស្វ័យប្រវត្តិ
                </button>
              </div>
            )}

            {step === 'phone' ? (
              /* STEP 1: Phone & Name Input */
              <form onSubmit={handleRequestOtp} className="space-y-4">
                {tab === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">
                      ឈ្មោះពេញ ឬឈ្មោះម្ចាស់កម្មវិធី (Full Name) *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="ឧទាហរណ៍៖ សុខ វិចិត្រ"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-black/60 border border-stone-700 focus:border-amber-400 focus:outline-none text-stone-100 text-sm transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    លេខទូរស័ព្ទ (Phone Number) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="012 888 999 ឬ 098 xxx xxx"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-black/60 border border-stone-700 focus:border-amber-400 focus:outline-none text-stone-100 text-sm transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    លេខកូដផ្ទៀងផ្ទាត់ OTP ៦ ខ្ទង់ នឹងត្រូវបានផ្ញើជូនតាមលេខនេះ
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={sendingOtp}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-60"
                >
                  {sendingOtp ? (
                    <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{tab === 'login' ? 'ស្នើសុំលេខកូដ OTP' : 'បន្តទៅផ្ទៀងផ្ទាត់ OTP'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STEP 2: OTP Verification */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-stone-300">
                      លេខកូដ OTP (៦ ខ្ទង់) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setStep('phone')}
                      className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                    >
                      ប្តូរលេខទូរស័ព្ទ
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-black/60 border border-stone-700 focus:border-amber-400 focus:outline-none text-stone-100 text-center tracking-[0.4em] font-mono text-lg transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    បានផ្ញើទៅកាន់៖ <strong className="text-amber-300">{phone}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={sendingOtp}
                    className="flex-1 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors border border-stone-700 cursor-pointer"
                  >
                    ផ្ញើ OTP ម្តងទៀត
                  </button>
                  <button
                    type="submit"
                    disabled={verifying}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20 disabled:opacity-60"
                  >
                    {verifying ? (
                      <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>{tab === 'login' ? 'ផ្ទៀងផ្ទាត់ & ចូល' : 'បង្កើតគណនី'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Demo Quick Accounts Section */}
            <div className="mt-6 pt-5 border-t border-stone-800/90 text-xs">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  ចូលសាកល្បងរហ័ស (Demo Accounts):
                </span>
                <span className="text-[10px] text-amber-400/80 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                  Data Isolated
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickSeedLogin('012888999', 'សុខ វិចិត្រ')}
                  className="p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                      A
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-stone-200 group-hover:text-amber-300 truncate">
                        សុខ វិចិត្រ (User A)
                      </div>
                      <div className="text-[10px] text-stone-500">012 888 999</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickSeedLogin('016777888', 'កែវ ដារា')}
                  className="p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-[10px]">
                      B
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-stone-200 group-hover:text-amber-300 truncate">
                        កែវ ដារា (User B)
                      </div>
                      <div className="text-[10px] text-stone-500">016 777 888</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Guest Direct Invitation Access Box */}
          <div className="bg-[#12100e]/70 border border-stone-800/80 rounded-2xl p-4 text-xs text-stone-300 space-y-2.5">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold text-stone-200">
                តើលោកអ្នកជាភ្ញៀវកិត្តិយស? (Are you a wedding guest?)
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              ប្រសិនបើលោកអ្នកមានកូដសំបុត្រអញ្ជើញ (Invitation Token) សូមបញ្ចូលនៅទីនេះ ដើម្បីបើកមើលសំបុត្រផ្ទាល់ខ្លួន៖
            </p>
            <form onSubmit={handleGuestTokenSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={guestTokenInput}
                onChange={(e) => setGuestTokenInput(e.target.value)}
                placeholder="ឧទាហរណ៍៖ khw-vip01"
                className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 font-medium border border-stone-700 transition-colors cursor-pointer shrink-0"
              >
                បើកសំបុត្រ
              </button>
            </form>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-stone-900 py-3 text-center text-[11px] text-stone-400">
        © 2026 Khmer Royal Wedding Platform • Multi-Tenant & Safe Isolated Architecture
      </footer>

    </div>
  );
};
