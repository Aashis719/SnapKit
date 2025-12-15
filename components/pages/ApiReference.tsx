import React from 'react';
import { Icons } from '../ui/Icons';

export const ApiReference: React.FC = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-4 lg:px-8 max-w-[1000px]">

            <div className="mb-12 animate-fade-in">
                <h1 className="text-4xl font-bold text-white mb-4">API Reference</h1>
                <p className="text-xl text-text-muted">Integrate SnapKit's powerful generation engine directly into your applications.</p>
            </div>

            <div className="grid gap-12 animate-fade-in-up">
                {/* Authentication */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg text-primary"><Icons.Lock className="w-6 h-6" /></div>
                        <h2 className="text-2xl font-bold text-white">Authentication</h2>
                    </div>
                    <div className="bg-surface/50 border border-surfaceHighlight rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-surfaceHighlight bg-black/20">
                            <p className="text-text-muted mb-4">All API requests require a valid API key in the header.</p>
                            <code className="text-sm font-mono text-accent bg-accent/10 py-1 px-3 rounded">Authorization: Bearer YOUR_API_KEY</code>
                        </div>
                    </div>
                </section>

                {/* Endpoints */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Icons.Zap className="w-6 h-6" /></div>
                        <h2 className="text-2xl font-bold text-white">Generate Content</h2>
                    </div>

                    <div className="bg-surface/50 border border-surfaceHighlight rounded-xl overflow-hidden">
                        <div className="flex items-center gap-4 p-4 border-b border-surfaceHighlight bg-black/20">
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 font-bold rounded text-sm">POST</span>
                            <code className="text-white font-mono">/v1/generate</code>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Request Body</h3>
                                <div className="bg-black/50 rounded-lg p-4 border border-surfaceHighlight">
                                    <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                                        {`{
  "image": "base64_encoded_string",
  "config": {
    "tone": "playful",
    "platforms": ["instagram", "twitter"],
    "includeEmoji": true
  }
}`}
                                    </pre>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Response</h3>
                                <div className="bg-black/50 rounded-lg p-4 border border-surfaceHighlight">
                                    <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                                        {`{
  "status": "success",
  "data": {
    "instagram": {
      "caption": "Living my best life! ✨ #vibes",
      "hashtags": ["#lifestyle", "#adventure"]
    }
    // ... other platforms
  }
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="p-6 bg-surfaceHighlight/30 rounded-xl border border-dashed border-surfaceHighlight text-center">
                    <p className="text-text-muted">This is a preview of the public API. Full documentation is available for enterprise partners.</p>
                </div>

            </div>
        </div>
    );
};
