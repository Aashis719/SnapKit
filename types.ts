export interface SocialKitConfig {
  tone: 'playful' | 'professional' | 'minimal' | 'inspirational' | 'funny';
  platforms: string[];
  includeEmoji: boolean;
  language: string;
}

export interface CaptionVariation {
  platform: string;
  text: string;
  hook: string;
  cta: string;
}

export interface HashtagSet {
  category: 'Reach (High Vol)' | 'Niche (Targeted)' | 'Community (Low Vol)';
  tags: string[];
}

export interface VideoScript {
  title: string;
  hook: string;
  scene_breakdown: Array<{ timestamp: string; visual: string; audio: string }>;
  cta: string;
}

export interface SocialKitResult {
  analysis: {
    summary: string;
    mood: string;
    keywords: string[];
  };
  captions: CaptionVariation[];
  hashtags: HashtagSet[];
  scripts: {
    tiktok: VideoScript;
    shorts: VideoScript;
  };
  linkedin_post: string;
  twitter_thread: string[];
}

export type AppStatus = 'idle' | 'uploading' | 'analyzing' | 'generating' | 'complete' | 'error';

export interface AppState {
  status: AppStatus;
  imageFile: File | null;
  imagePreview: string | null;
  config: SocialKitConfig;
  result: SocialKitResult | null;
  error: string | null;
  apiKey: string;
}
