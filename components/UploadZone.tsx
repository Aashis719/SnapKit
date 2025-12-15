import React, { useCallback, useState } from 'react';
import { Icons } from './ui/Icons';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  return (
    <div
      className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
        ${isDragging 
          ? 'border-primary bg-primary/10 scale-[1.01] shadow-[0_0_30px_rgba(139,92,246,0.15)]' 
          : 'border-surfaceHighlight hover:border-primary/50 hover:bg-surfaceHighlight/50 bg-surface'
        }
        h-64 flex flex-col items-center justify-center p-8 text-center
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileInput}
      />
      
      <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-primary/20 text-primary' : 'bg-surfaceHighlight text-text-muted group-hover:bg-primary/10 group-hover:text-primary'}`}>
        <Icons.Upload className="w-8 h-8" />
      </div>
      
      <h3 className="text-lg font-semibold text-text-main mb-2">
        {isDragging ? 'Drop it like it\'s hot!' : 'Upload your photo'}
      </h3>
      
      <p className="text-sm text-text-muted max-w-xs mx-auto">
        Drag & drop or click to browse. Supports JPG, PNG, WEBP up to 10MB.
      </p>
    </div>
  );
};