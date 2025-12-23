/**
 * 전자서명 문서 상세 및 서명 페이지
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FileSignature, CheckCircle, XCircle, Shield,
  PenTool, Eraser, FileText
} from 'lucide-react';
import { GlobalHeader } from '@/components/layout/GlobalHeader';

export default function SignatureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;
  
  const [document, setDocument] = useState<any>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');

  // 서명 그리기
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : '#000000';
    ctx.lineWidth = currentTool === 'eraser' ? 20 : 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleEnd = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
    }
  };

  // 서명 완료
  const handleComplete = async () => {
    if (!signatureData) {
      alert('서명을 그려주세요.');
      return;
    }

    try {
      const response = await fetch(`/api/signature/${documentId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: signatureData }),
      });

      if (response.ok) {
        alert('서명이 완료되었습니다!');
        router.push('/signature');
      }
    } catch (error) {
      console.error('서명 완료 오류:', error);
      alert('서명 완료 중 오류가 발생했습니다.');
    }
  };

  // 캔버스 초기화
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 200;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <GlobalHeader />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">전자서명</h1>
            <p className="text-gray-600">문서에 서명을 완료하세요</p>
          </div>

          {/* 문서 미리보기 */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="flex items-center justify-center h-64">
              <FileText className="text-gray-400" size={64} />
            </div>
            <p className="text-center text-gray-600 mt-4">문서 미리보기 영역</p>
          </div>

          {/* 서명 영역 */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              서명하기
            </label>
            <div className="border-2 border-gray-300 rounded-xl p-4 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setCurrentTool('pen')}
                  className={`p-2 rounded-lg ${currentTool === 'pen' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <PenTool size={18} />
                </button>
                <button
                  onClick={() => setCurrentTool('eraser')}
                  className={`p-2 rounded-lg ${currentTool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <Eraser size={18} />
                </button>
                <button
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        setSignatureData(null);
                      }
                    }
                  }}
                  className="ml-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  지우기
                </button>
              </div>
              <canvas
                ref={canvasRef}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair"
                style={{ touchAction: 'none' }}
              />
            </div>
          </div>

          {/* 보안 정보 */}
          <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-3">
            <Shield className="text-blue-600 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-blue-900 mb-1">법적 효력 보장</p>
              <p className="text-sm text-blue-700">
                이 전자서명은 전자서명법에 따라 법적 효력을 가지며, 암호화되어 안전하게 저장됩니다.
              </p>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold"
            >
              취소
            </button>
            <button
              onClick={handleComplete}
              disabled={!signatureData}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={18} />
              서명 완료
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

