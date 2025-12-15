import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { UploadZone } from './components/UploadZone';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AuthModal } from './components/AuthModal';
import { HistorySidebar } from './components/HistorySidebar';
import { Footer } from './components/Footer';
import { generateContent, fileToGenerativePart } from './services/geminiService';
import { uploadImageToCloudinary } from './services/cloudinaryService';
import { saveGeneration, getUserApiKey, updateUserApiKey } from './services/supabaseService';
import { supabase } from './lib/supabase';
import { AppState, SocialKitConfig } from './types';
import { Icons } from './components/ui/Icons';
import { Features } from './components/pages/Features';
import { About } from './components/pages/About';
import { PrivacyPolicy } from './components/pages/PrivacyPolicy';
import { NotFound } from './components/pages/NotFound';

const DEFAULT_CONFIG: SocialKitConfig = {
  tone: 'playful',
  platforms: ['Instagram', 'TikTok', 'LinkedIn', 'Twitter'],
  includeEmoji: true,
  language: 'English'
};

const Content: React.FC = () => {
  const [state, setState] = useState<AppState>({
    status: 'idle',
    imageFile: null,
    imagePreview: null,
    config: DEFAULT_CONFIG,
    result: null,
    error: null,
    apiKey: '' // Will be loaded from database when user logs in
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      // Load API key from database if user is logged in
      if (session?.user) {
        loadUserApiKey(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // Load API key when user logs in
      if (session?.user) {
        loadUserApiKey(session.user.id);
      } else {
        // Clear API key when user logs out
        setState(prev => ({ ...prev, apiKey: '' }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load user's API key from database
  const loadUserApiKey = async (userId: string) => {
    try {
      const apiKey = await getUserApiKey(userId);
      if (apiKey) {
        setState(prev => ({ ...prev, apiKey }));
      }
    } catch (error) {
      console.error('Failed to load API key:', error);
    }
  };

  // Clear file handler
  const handleClear = () => {
    setState(prev => ({
      ...prev,
      imageFile: null,
      imagePreview: null,
      result: null,
      status: 'idle',
      error: null
    }));
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setState(prev => ({
      ...prev,
      imageFile: file,
      imagePreview: previewUrl,
      status: 'idle', // Ready to generate
      error: null
    }));
  };

  // Handle Generation
  const handleGenerate = async () => {
    if (!state.imageFile) return;

    if (!user) {
      setShowAuth(true);
      return;
    }

    if (!state.apiKey) {
      setShowSettings(true);
      return;
    }

    setState(prev => ({ ...prev, status: 'generating', error: null }));

    try {
      // 1. Upload to Cloudinary
      const uploadResult = await uploadImageToCloudinary(state.imageFile);

      // 2. Convert image to base64 for Gemini (Gemini still needs base64 or a URI it can access, for now base64 is safest client-side)
      const base64Data = await fileToGenerativePart(state.imageFile);
      const mimeType = state.imageFile.type;

      // 3. Call Gemini API
      const result = await generateContent(state.apiKey, base64Data, mimeType, state.config);

      // 4. Save to Supabase
      await saveGeneration(
        user.id,
        uploadResult.url,
        uploadResult.publicId,
        state.config,
        result
      );

      setState(prev => ({
        ...prev,
        status: 'complete',
        result
      }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: err.message || "Something went wrong. Please check your API key and try again."
      }));
    }
  };

  const saveApiKey = async (key: string) => {
    if (!user) {
      console.error('User must be logged in to save API key');
      return;
    }

    try {
      // Save to database
      await updateUserApiKey(user.id, key);
      setState(prev => ({ ...prev, apiKey: key }));
      setShowSettings(false);
    } catch (error) {
      console.error('Failed to save API key:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to save API key. Please try again.'
      }));
    }
  };

  const loadFromHistory = (result: any, imageUrl: string) => {
    setState(prev => ({
      ...prev,
      result,
      imagePreview: imageUrl,
      // We don't have the original File object, so imageFile remains what it was or null.
      // This is fine for viewing credentials results.
      status: 'complete'
    }));
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-background text-text-main pb-10 md:pb-5 relative flex flex-col">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-grid-pattern pointer-events-none fixed"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between max-w-[1600px]">
          <a href='/'>
            <div className="flex items-center ">
              <div className="w-10 h-10 ">
                <img src="/snapkit.png" alt="SnapKit Logo" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple to-primary">
                SnapKit
              </h1>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-base font-medium flex gap-1 items-center transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-text-muted'}`}
            >
              <Icons.Home className="w-5 h-5" /> Home
            </Link>
            <Link
              to="/features"
              className={`text-base font-medium flex gap-1 items-center transition-colors hover:text-primary ${location.pathname === '/features' ? 'text-primary' : 'text-text-muted'}`}
            >
              <Icons.Zap className="w-5 h-5" /> Features
            </Link>
            <Link
              to="/about"
              className={`text-base font-medium flex gap-1 items-center transition-colors hover:text-primary ${location.pathname === '/about' ? 'text-primary' : 'text-text-muted'}`}
            >
              <Icons.Globe className="w-5 h-5" />  About
            </Link>
          </nav>

          <div className="flex items-center gap-4">


            {user ? (
              <>
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors relative z-10"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-primary border transition-all ${showProfileMenu ? 'bg-primary/80 text-white border-primary/80 shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-primary/20 border-primary/30'}`}>
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  <div className={`absolute top-full right-0 mt-3 w-48 bg-surface border border-surfaceHighlight rounded-xl shadow-2xl p-2 transform transition-all duration-200 origin-top-right ${showProfileMenu ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                    <div className="px-3 py-2 border-b border-surfaceHighlight mb-1">
                      <p className="text-xs text-text-muted">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate max-w-[150px]">{user.email?.split('@')[0]}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowHistory(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Icons.History className="w-4 h-4" /> History
                    </button>
                    <button
                      onClick={() => {
                        supabase.auth.signOut();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Icons.LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>

                {/* Settings button - only visible when logged in */}
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 text-text-muted hover:text-white hover:bg-surfaceHighlight rounded-full transition-colors relative"
                  title="API Settings"
                >
                  <Icons.Settings className="w-5 h-5" />
                  {!state.apiKey && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-sm"></span>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="px-5 py-2 bg-primary hover:bg-primaryHover text-white shadow-lg shadow-primary/20 rounded-lg text-sm font-bold transition-all transform hover:scale-105"
              >
                Sign In
              </button>
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-text-muted hover:text-white hover:bg-surfaceHighlight rounded-full transition-colors"
            >
              <Icons.Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 lg:px-8 pt-8 lg:pt-10 max-w-[1600px] relative z-10 w-full">
        <Routes>
          <Route path="/" element={
            <>
              {/* Intro Hero (Only if idle or no image) */}
              {!state.imagePreview && (
                <div className="text-center max-w-4xl mx-auto mb-20 mt-12 animate-fade-in">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-xs font-bold text-primary tracking-wide uppercase">SnapKit  Beta v1.0</span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
                    Transform Photos into{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white ">
                      Viral Content
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-lg md:text-xl text-text-muted mb-12 leading-relaxed max-w-2xl mx-auto">
                    Upload your image and Generate captions, hashtags, and video scripts
                    for Instagram, TikTok and more all in seconds.
                  </p>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap justify-center gap-3 mb-12">
                    <div className="flex items-center gap-2 px-4 py-2 bg-surfaceHighlight rounded-full border border-border">
                      <Icons.Brain className="w-4 h-4 text-primary" />
                      <span className="text-sm text-text-main font-medium">AI-Powered</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-surfaceHighlight rounded-full border border-border">
                      <Icons.Rocket className="w-4 h-4 text-accent" />
                      <span className="text-sm text-text-main font-medium">Instant Results</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-surfaceHighlight rounded-full border border-border">
                      <Icons.Share2 className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-text-main font-medium">Multi-Platform</span>
                    </div>
                  </div>

                  {/* Upload Zone / CTA */}
                  <div className="max-w-lg mx-auto relative group">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                    <div className="relative bg-surface rounded-2xl p-1 border border-surfaceHighlight">
                      {user ? (
                        <UploadZone onFileSelect={handleFileSelect} />
                      ) : (
                        <div className="py-16 px-8 text-center border-2 border-dashed border-surfaceHighlight rounded-xl bg-gradient-to-b from-background/50 to-surfaceHighlight/20">
                          <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                            <Icons.Upload className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3 flex items-center justify-center gap-2">
                            Start Creating Magic
                            <Icons.Wand2 className="w-5 h-5 text-primary" />
                          </h3>
                          <p className="text-text-muted mb-8 text-sm max-w-sm mx-auto">
                            Sign in to upload your first image and watch SnapKit transform it into scroll-stopping content.
                          </p>
                          <button
                            onClick={() => setShowAuth(true)}
                            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all transform hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/40"
                          >
                            Get Started Free
                          </button>
                          <p className="text-xs text-text-muted mt-4">No credit card required • 10 free generations</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Proof / Stats */}
                  <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">100+</div>
                      <div className="text-sm text-text-muted">Content Generated</div>
                    </div>
                    <div className="text-center border-x border-surfaceHighlight">
                      <div className="text-3xl font-bold text-white mb-1">5+</div>
                      <div className="text-sm text-text-muted">Platforms Supported</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">&lt;15s</div>
                      <div className="text-sm text-text-muted">Average Generation</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Setup Area - Split View for Desktop */}
              {state.imagePreview && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                  {/* LEFT COLUMN: Sidebar (Sticky on Desktop) */}
                  <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">

                    {/* Image Preview Card */}
                    <div className="bg-surface rounded-2xl shadow-xl border border-surfaceHighlight overflow-hidden group relative">
                      <div className="aspect-square relative overflow-hidden bg-black/50">
                        <img
                          src={state.imagePreview}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                          <button
                            onClick={handleClear}
                            className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                            title="Remove Image"
                          >
                            <Icons.X className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Config Panel */}
                    <div className="bg-surface rounded-2xl shadow-xl border border-surfaceHighlight p-6 animate-fade-in-up">
                      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <Icons.Settings className="w-4 h-4 text-primary" /> Configuration
                      </h3>

                      <div className="space-y-6">
                        <div>
                          <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-3">Tone of Voice</label>
                          <div className="flex flex-wrap gap-2">
                            {['playful', 'professional', 'minimal', 'inspirational', 'funny'].map((t) => (
                              <button
                                key={t}
                                onClick={() => setState(prev => ({ ...prev, config: { ...prev.config, tone: t as any } }))}
                                className={`px-3 py-2 rounded-lg text-sm transition-all border
                                      ${state.config.tone === t
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                    : 'bg-surfaceHighlight text-text-muted border-transparent hover:border-border hover:text-white'
                                  }`}
                              >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-surfaceHighlight">
                          <label className="text-sm font-medium text-text-muted">Include Emojis</label>
                          <button
                            onClick={() => setState(prev => ({ ...prev, config: { ...prev.config, includeEmoji: !prev.config.includeEmoji } }))}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${state.config.includeEmoji ? 'bg-accent' : 'bg-surfaceHighlight'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${state.config.includeEmoji ? 'translate-x-6' : ''}`} />
                          </button>
                        </div>

                        <button
                          onClick={handleGenerate}
                          disabled={state.status === 'generating'}
                          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all mt-4
                               ${state.status === 'generating'
                              ? 'bg-surfaceHighlight cursor-not-allowed text-text-muted'
                              : 'bg-primary hover:bg-primaryHover hover:shadow-primary/25 hover:scale-[1.02]'
                            }
                             `}
                        >
                          {state.status === 'generating' ? (
                            <>
                              <Icons.RefreshCw className="w-5 h-5 animate-spin" />
                              Generating Magic...
                            </>
                          ) : (
                            <>
                              <Icons.Sparkles className="w-5 h-5" />
                              Generate Social Kit
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Error Message */}
                    {state.error && (
                      <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 flex items-start gap-3 animate-fade-in">
                        <Icons.AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{state.error}</p>
                      </div>
                    )}
                  </div>

                  {/* RIGHT COLUMN: Results Dashboard */}
                  <div className="lg:col-span-8 animate-fade-in-up space-y-6">
                    {!state.result && state.status === 'generating' && (
                      <div className="h-full min-h-[500px] flex flex-col items-center justify-center rounded-2xl bg-surface/50">
                        <div className="flex flex-col items-center space-y-6">
                          {/* Simple spinner */}
                          <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-surfaceHighlight rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                          </div>

                          {/* Loading text */}
                          <div className="text-center">
                            <p className="text-text-muted text-sm">
                              Generating your content...
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {!state.result && state.status !== 'generating' && (
                      <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-surfaceHighlight rounded-2xl bg-surface/50 text-text-muted">
                        <Icons.Sparkles className="w-12 h-12 text-surfaceHighlight mb-4" />
                        <p className="text-lg">Ready to generate content.</p>
                        <p className="text-sm opacity-60">Configure your settings on the left and hit generate.</p>
                      </div>
                    )}

                    {state.result && (
                      <>
                        <ResultsDashboard result={state.result} />

                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          } />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <ApiKeyModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={saveApiKey}
        currentKey={state.apiKey}
      />

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => console.log('Auth success')}
      />

      <HistorySidebar
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        userId={user?.id}
        onSelect={loadFromHistory}
      />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

      {/* Footer */}
      <Footer />

      {/* Mobile Navigation Sidebar */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[280px] bg-surface border-l border-surfaceHighlight shadow-2xl transform transition-transform duration-300 ease-out md:hidden flex flex-col ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-surfaceHighlight/50">
          <span className="font-bold text-lg text-white tracking-tight">Menu</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-text-muted hover:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/'
              ? 'bg-primary/10 text-primary font-medium border border-primary/20'
              : 'text-text-muted hover:text-white hover:bg-white/5'
              }`}
          >
            <Icons.Home className="w-5 h-5" />
            Home
          </Link>
          <Link
            to="/features"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/features'
              ? 'bg-primary/10 text-primary font-medium border border-primary/20'
              : 'text-text-muted hover:text-white hover:bg-white/5'
              }`}
          >
            <Icons.Zap className="w-5 h-5" />
            Features
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/about'
              ? 'bg-primary/10 text-primary font-medium border border-primary/20'
              : 'text-text-muted hover:text-white hover:bg-white/5'
              }`}
          >
            <Icons.Globe className="w-5 h-5" />
            About
          </Link>
          <Link
            to="/privacy-policy"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/privacy-policy'
              ? 'bg-primary/10 text-primary font-medium border border-primary/20'
              : 'text-text-muted hover:text-white hover:bg-white/5'
              }`}
          >
            <Icons.Shield className="w-5 h-5" />
            Privacy Policy
          </Link>
        </div>

        <div className="px-4 pb-4">
          {user ? (
            <button
              onClick={() => {
                supabase.auth.signOut();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
            >
              <Icons.LogOut className="w-5 h-5" />
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => {
                setShowAuth(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium border border-primary/20 hover:bg-primary/20 transition-all justify-center"
            >
              <Icons.LogIn className="w-5 h-5" />
              Sign In
            </button>
          )}
        </div>

        <div className="p-5 border-t border-surfaceHighlight/50 bg-black/20">
          <p className="text-xs text-text-muted text-center">
            © 2024 SnapKit. All rights reserved.
          </p>
        </div>
      </div>
    </div >
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Content />
    </Router>
  )
}

export default App;
