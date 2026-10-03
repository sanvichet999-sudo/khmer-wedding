import React, { useState, useEffect } from 'react';
import { EnvelopeModal } from './components/EnvelopeModal';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { ScheduleSection } from './components/ScheduleSection';
import { VenueSection } from './components/VenueSection';
import { GallerySection } from './components/GallerySection';
import { DressCodeSection } from './components/DressCodeSection';
import { RsvpSection } from './components/RsvpSection';
import { GuestbookSection } from './components/GuestbookSection';
import { GiftEnvelopeSection } from './components/GiftEnvelopeSection';
import { ShareLinkModal } from './components/ShareLinkModal';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { AudioToggle } from './components/AudioToggle';
import { Footer } from './components/Footer';
import { AdminLayout } from './components/admin/AdminLayout';
import { AuthPage } from './components/auth/AuthPage';
import { Template01Royal } from './components/templates/Template01Royal';
import { Template02Modern } from './components/templates/Template02Modern';
import { Template03Traditional } from './components/templates/Template03Traditional';
import { Template04Garden } from './components/templates/Template04Garden';
import { Template05Midnight } from './components/templates/Template05Midnight';
import { WeddingEvent, WeddingTemplate, TemplateSectionConfig, PaymentMethod, RsvpResponse, User, AuthResponse } from './types/fullstack';
import { api } from './services/api';
import { AlertCircle, ShieldCheck, ArrowLeft, Eye } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'auth' | 'admin' | 'guest' | 'preview'>('auth');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [wedding, setWedding] = useState<WeddingEvent | null>(null);
  const [template, setTemplate] = useState<WeddingTemplate | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  
  const [activeGuest, setActiveGuest] = useState<{
    id?: string;
    fullName: string;
    group?: string;
    allowedGuests: number;
    invitationToken?: string;
  }>({
    fullName: 'ឯកឧត្តម លោកជំទាវ លោកអ្នកមានកិត្តិយស',
    allowedGuests: 2,
  });

  const [currentRsvp, setCurrentRsvp] = useState<RsvpResponse | null>(null);
  const [guestNotFound, setGuestNotFound] = useState<boolean>(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    src: string;
    alt: string;
  }>({
    isOpen: false,
    src: '',
    alt: '',
  });

  // Extract URL parameters (e.g. ?token=khw-vip01 or /invitation/:token or ?admin=true)
  const initializeApp = async () => {
    try {
      setLoading(true);
      setGuestNotFound(false);

      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get('token');
      const adminParam = params.get('admin');

      // Check path-based invitation URL: /invitation/{token}
      const pathname = window.location.pathname;
      let pathToken = '';
      if (pathname.startsWith('/invitation/')) {
        pathToken = pathname.replace('/invitation/', '').trim();
      }

      const activeToken = tokenParam || pathToken;

      // 1. IF GUEST INVITATION TOKEN IS PRESENT:
      // The user is an invited Guest! Directly show their personalized digital invitation
      if (activeToken) {
        try {
          const inv = await api.getInvitation(activeToken);
          setWedding(inv.wedding);
          if (inv.template) setTemplate(inv.template);
          setPaymentMethods(inv.paymentMethods || []);
          setActiveGuest({
            id: inv.guest.id,
            fullName: inv.guest.fullName,
            group: inv.guest.group,
            allowedGuests: inv.guest.allowedGuests || 2,
            invitationToken: inv.guest.invitationToken,
          });
          setCurrentRsvp(inv.rsvp);
          setViewMode('guest');
          setLoading(false);
          return;
        } catch (err) {
          console.warn('Guest token not found:', activeToken, err);
          setGuestNotFound(true);
          // Load public fallback
          try {
            const pub = await api.getPublicWedding();
            setWedding(pub.wedding);
            if (pub.template) setTemplate(pub.template);
            setPaymentMethods(pub.paymentMethods || []);
          } catch {}
          setViewMode('guest');
          setLoading(false);
          return;
        }
      }

      // 2. IF NO INVITATION TOKEN:
      // Check if user is already logged in (has valid session token)
      const existingSessionToken = api.getToken();
      if (existingSessionToken) {
        try {
          const meData = await api.getMe();
          setCurrentUser(meData.user);
          setWedding(meData.wedding);
          setViewMode('admin');
          setLoading(false);
          return;
        } catch {
          api.removeToken();
          setCurrentUser(null);
        }
      }

      // 3. User is NOT logged in and has NO invitation token:
      // Requirement 1: User ត្រូវ Login / Create Account ជាមុនសិន
      setViewMode('auth');
    } catch (err) {
      console.error('Failed to initialize app:', err);
      setViewMode('auth');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  const handleLoginSuccess = (authData: AuthResponse) => {
    setCurrentUser(authData.user);
    setWedding(authData.wedding);
    setViewMode('admin');
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setViewMode('auth');
  };

  const handleOpenGuestToken = async (token: string) => {
    try {
      setLoading(true);
      const inv = await api.getInvitation(token);
      setWedding(inv.wedding);
      if (inv.template) setTemplate(inv.template);
      setPaymentMethods(inv.paymentMethods || []);
      setActiveGuest({
        id: inv.guest.id,
        fullName: inv.guest.fullName,
        group: inv.guest.group,
        allowedGuests: inv.guest.allowedGuests || 2,
        invitationToken: inv.guest.invitationToken,
      });
      setCurrentRsvp(inv.rsvp);
      setIsEnvelopeOpen(false); // allow re-opening envelope
      setViewMode('guest');
      // Update browser URL without reload
      window.history.pushState({}, '', `/?token=${token}`);
    } catch {
      setGuestNotFound(true);
      setViewMode('guest');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewPublic = async () => {
    try {
      setLoading(true);
      const pub = await api.getPublicWedding();
      setWedding(pub.wedding);
      if (pub.template) setTemplate(pub.template);
      setPaymentMethods(pub.paymentMethods || []);
      setActiveGuest({
        fullName: 'ឯកឧត្តម លោកជំទាវ លោកអ្នកមានកិត្តិយស',
        allowedGuests: 2,
      });
      setCurrentRsvp(null);
      setIsEnvelopeOpen(false);
      setViewMode('preview');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenImage = (src: string, alt: string) => {
    setLightboxState({ isOpen: true, src, alt });
  };

  const scrollToRsvp = () => {
    const el = document.getElementById('rsvp-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVenue = () => {
    const el = document.getElementById('venue-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenGuestPreviewFromAdmin = async (token?: string) => {
    if (token) {
      await handleOpenGuestToken(token);
    } else {
      await handlePreviewPublic();
    }
  };

  const handleTemplateUpdated = (updatedWedding: WeddingEvent, updatedTemplate: WeddingTemplate) => {
    setWedding(updatedWedding);
    setTemplate(updatedTemplate);
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080706] text-stone-100 flex flex-col items-center justify-center p-6 font-kantumruy">
        <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mb-4" />
        <h2 className="font-moul text-lg text-gold-gradient mb-1">
          កំពុងរៀបចំប្រព័ន្ធ...
        </h2>
        <p className="text-xs text-stone-400">Loading Wedding System</p>
      </div>
    );
  }

  // 2. Authentication View (Login / Sign Up)
  if (viewMode === 'auth') {
    return (
      <AuthPage
        onLoginSuccess={handleLoginSuccess}
        onPreviewPublicInvitation={handlePreviewPublic}
        onOpenInvitationToken={handleOpenGuestToken}
      />
    );
  }

  // 3. Admin Management Portal View
  if (viewMode === 'admin') {
    return (
      <AdminLayout
        currentUser={currentUser}
        wedding={wedding}
        template={template}
        onLogout={handleLogout}
        onExitAdmin={() => setViewMode('auth')}
        onOpenGuestPreview={handleOpenGuestPreviewFromAdmin}
        onTemplateUpdated={handleTemplateUpdated}
      />
    );
  }

  // 4. Guest Invitation View & Public Preview View
  const isSectionEnabled = (type: string) => {
    if (!template || !template.sections) return true;
    const sec = template.sections.find((s: TemplateSectionConfig) => s.type === type);
    return sec ? sec.enabled : true;
  };

  return (
    <div className="min-h-screen bg-[#0c0b0a] text-stone-100 flex flex-col font-kantumruy selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Banner indicating context (Guest vs Preview) */}
      <div className="bg-[#12100e] border-b border-stone-800/80 px-4 py-2 flex items-center justify-between text-xs text-stone-400">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="truncate">
            {activeGuest.invitationToken ? (
              <span>
                សំបុត្រអញ្ជើញផ្ទាល់ខ្លួន៖ <strong className="text-amber-300 font-medium">{activeGuest.fullName}</strong> (កូដ {activeGuest.invitationToken})
              </span>
            ) : (
              <span>ទិដ្ឋភាពសំបុត្រអញ្ជើញសាធារណៈ (Public Preview)</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentUser ? (
            <button
              onClick={() => setViewMode('admin')}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ត្រឡប់ទៅ Admin ({currentUser.fullName})</span>
            </button>
          ) : (
            <button
              onClick={() => setViewMode('auth')}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ចូលគ្រប់គ្រង (Admin Login)</span>
            </button>
          )}
        </div>
      </div>

      {/* Guest Not Found Alert if invalid token */}
      {guestNotFound && (
        <div className="bg-rose-950/80 border-b border-rose-800 p-3 text-center text-xs text-rose-200 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>
            រកមិនឃើញទិន្នន័យភ្ញៀវតាមតំណភ្ជាប់នេះទេ។ កំពុងបង្ហាញគំរូសំបុត្រអញ្ជើញទូទៅ។
          </span>
        </div>
      )}

      {/* Virtual Opening Envelope Modal on first arrival */}
      {!isEnvelopeOpen && (
        <EnvelopeModal
          guestName={activeGuest.fullName}
          onOpen={() => setIsEnvelopeOpen(true)}
        />
      )}

      {/* Top Bar Navigation */}
      <Navigation
        coupleName={wedding?.coupleNameKhmer || 'វិចិត្រ & ចរិយា'}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onNavigateToRsvp={scrollToRsvp}
        onOpenAdmin={() => (currentUser ? setViewMode('admin') : setViewMode('auth'))}
      />

      <main className="flex-1">
        {/* Active Selected Template (Requirement 3: strict consistency with saved template) */}
        {wedding && isSectionEnabled('hero') && (
          <div>
            {wedding.selectedTemplateId === 'tmpl-02' ? (
              <Template02Modern
                wedding={wedding}
                guestName={activeGuest.fullName}
                allowedGuests={activeGuest.allowedGuests}
                paymentMethods={paymentMethods}
                onOpenRsvp={scrollToRsvp}
                onOpenImageModal={handleOpenImage}
              />
            ) : wedding.selectedTemplateId === 'tmpl-03' ? (
              <Template03Traditional
                wedding={wedding}
                guestName={activeGuest.fullName}
                allowedGuests={activeGuest.allowedGuests}
                paymentMethods={paymentMethods}
                onOpenRsvp={scrollToRsvp}
                onOpenImageModal={handleOpenImage}
              />
            ) : wedding.selectedTemplateId === 'tmpl-04' ? (
              <Template04Garden
                wedding={wedding}
                guestName={activeGuest.fullName}
                allowedGuests={activeGuest.allowedGuests}
                paymentMethods={paymentMethods}
                onOpenRsvp={scrollToRsvp}
                onOpenImageModal={handleOpenImage}
              />
            ) : wedding.selectedTemplateId === 'tmpl-05' ? (
              <Template05Midnight
                wedding={wedding}
                guestName={activeGuest.fullName}
                allowedGuests={activeGuest.allowedGuests}
                paymentMethods={paymentMethods}
                onOpenRsvp={scrollToRsvp}
                onOpenImageModal={handleOpenImage}
              />
            ) : (
              <Template01Royal
                wedding={wedding}
                guestName={activeGuest.fullName}
                allowedGuests={activeGuest.allowedGuests}
                paymentMethods={paymentMethods}
                onOpenRsvp={scrollToRsvp}
                onOpenImageModal={handleOpenImage}
              />
            )}
          </div>
        )}

        {/* Detailed Program Schedule */}
        {isSectionEnabled('schedule') && <ScheduleSection />}

        {/* Specific Venue Location & Interactive Directions */}
        {isSectionEnabled('venue') && (
          <VenueSection wedding={wedding || undefined} onOpenImageModal={handleOpenImage} />
        )}

        {/* High-Res Visual Photo Gallery */}
        {isSectionEnabled('gallery') && (
          <GallerySection onOpenImageModal={handleOpenImage} />
        )}

        {/* Dress Code & Theme Color Palette */}
        {isSectionEnabled('dressCode') && <DressCodeSection />}

        {/* Interactive RSVP Form with Allowed Guests enforcement */}
        {isSectionEnabled('rsvp') && (
          <RsvpSection
            initialGuestName={activeGuest.fullName}
            guestToken={activeGuest.invitationToken}
            allowedGuests={activeGuest.allowedGuests}
            initialRsvp={currentRsvp}
            onRsvpSuccess={() => {
              if (activeGuest.invitationToken) {
                handleOpenGuestToken(activeGuest.invitationToken);
              }
            }}
          />
        )}

        {/* Digital Wishing Guestbook */}
        {isSectionEnabled('guestbook') && (
          <GuestbookSection initialGuestName={activeGuest.fullName} />
        )}

        {/* Traditional Wedding Gift Envelope / KHQR */}
        {isSectionEnabled('gift') && (
          <GiftEnvelopeSection paymentMethods={paymentMethods} />
        )}
      </main>

      {/* Audio Ambient Player Toggle */}
      <AudioToggle />

      {/* Footer with Couple Contacts & Thank-You Blessings */}
      {isSectionEnabled('closing') && <Footer />}

      {/* Shareable Link Generator Modal */}
      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentGuestName={activeGuest.fullName}
      />

      {/* Image Fullscreen Lightbox Modal */}
      <ImageLightboxModal
        isOpen={lightboxState.isOpen}
        src={lightboxState.src}
        alt={lightboxState.alt}
        onClose={() => setLightboxState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
