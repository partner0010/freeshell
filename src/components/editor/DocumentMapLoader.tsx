'use client';

import React, { useRef } from 'react';
import { FileText, Map } from 'lucide-react';

interface DocumentMapLoaderProps {
  onDocumentLoad?: (file: File) => void;
  onMapLoad?: () => void;
}

export function DocumentMapLoader({ onDocumentLoad, onMapLoad }: DocumentMapLoaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onDocumentLoad) {
      onDocumentLoad(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-left flex items-center gap-2 cursor-pointer transition-colors">
        <FileText size={16} />
        문서 불러오기
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleFileSelect}
        />
      </label>
      <button
        onClick={() => {
          if (onMapLoad) {
            onMapLoad();
          }
        }}
        className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-left flex items-center gap-2 transition-colors"
      >
        <Map size={16} />
        지도 불러오기
      </button>
    </div>
  );
}

