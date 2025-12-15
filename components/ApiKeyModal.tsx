import React, { useState, useEffect } from 'react';
import { Icons } from './ui/Icons';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
  onClose: () => void;
  currentKey: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, onClose, currentKey }) => {
  const [key, setKey] = useState(currentKey);

  // Sync local state with currentKey prop when it changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setKey(currentKey);
    }
  }, [isOpen, currentKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg p-6 transform transition-all scale-100 border border-surfaceHighlight">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Icons.Settings className="w-5 h-5 text-primary" />
              Setup Gemini API
            </h3>
            <p className="text-sm text-text-muted mt-1">Required to generate content</p>
          </div>

          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors p-1">
            <Icons.X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">

          {/* Guide Section */}
          <div className="bg-surfaceHighlight/30 rounded-xl p-5 border border-surfaceHighlight">
            <h4 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-2">
              <Icons.Sparkles className="w-4 h-4 text-primary" />
              How to get your free key:
            </h4>
            <ol className="text-sm text-text-muted space-y-3 list-decimal list-inside">
              <li>
                Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium inline-flex items-center gap-1 hover:text-primaryHover">
                  Google AI Studio <Icons.ChevronRight className="w-3 h-3" />
                </a>
              </li>
              <li>Log in with your Google account.</li>
              <li>Click the blue <strong>Create API key</strong> button.</li>
              <li>Copy the key starting with <code className="bg-black/50 border border-border px-1.5 py-0.5 rounded text-xs font-mono text-text-main">AIzaSy</code>.</li>
            </ol>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Paste API Key</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 rounded-xl bg-surfaceHighlight border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-mono text-white placeholder-text-muted/50"
            />
            <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
              <Icons.Check className="w-3 h-3" /> Stored safely in Database
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-text-muted hover:text-white font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(key)}
              disabled={!key}
              className={`px-6 py-2 rounded-lg font-medium transition-all shadow-sm
                ${key
                  ? 'bg-primary text-white hover:bg-primaryHover hover:shadow-lg hover:shadow-primary/20'
                  : 'bg-surfaceHighlight text-text-muted cursor-not-allowed'
                }`}
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};