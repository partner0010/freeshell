'use client';

import React, { useState } from 'react';
import { FileSignature, FileText, Map } from 'lucide-react';
import { ElectronicSignature } from './ElectronicSignature';
import { DocumentMapLoader } from './DocumentMapLoader';

export function SignaturePanel() {
  const [loadedDocument, setLoadedDocument] = useState<{
    type: 'document' | 'map';
    content?: string | File;
    url?: string;
  } | null>(null);

  const handleDocumentLoad = (file: File) => {
    setLoadedDocument({
      type: 'document',
      content: file,
    });
  };

  const handleMapLoad = () => {
    setLoadedDocument({
      type: 'map',
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
            <FileSignature className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">전자결재 시스템</h3>
            <p className="text-xs text-gray-500">서명, 도장, 문서/지도에 그림 그리기</p>
          </div>
        </div>
        <DocumentMapLoader
          onDocumentLoad={handleDocumentLoad}
          onMapLoad={handleMapLoad}
        />
        {loadedDocument && (
          <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              {loadedDocument.type === 'document' ? '📄 문서가 로드되었습니다' : '🗺️ 지도 모드가 활성화되었습니다'}
            </p>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <ElectronicSignature
          document={loadedDocument || undefined}
          onSave={(data) => {
            // 마이페이지에 저장
            const item = {
              id: `sig-${Date.now()}`,
              type: 'signature' as const,
              title: `전자서명 ${new Date().toLocaleString()}`,
              description: '전자서명 문서',
              createdAt: new Date(),
              data: data,
              thumbnail: data.image,
            };
            const existing = JSON.parse(localStorage.getItem('grip-saved-items') || '[]');
            localStorage.setItem('grip-saved-items', JSON.stringify([item, ...existing]));
            alert('마이페이지에 저장되었습니다!');
          }}
        />
      </div>
    </div>
  );
}

