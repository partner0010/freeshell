'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, FileText, Download, Upload, Loader2, CheckCircle } from 'lucide-react';
// Meeting notes functionality - to be implemented with SHELL AI
interface MeetingNote {
  title: string;
  summary: string;
  keyPoints: string[];
  actionItems: Array<{
    task: string;
    assignee: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  participants: string[];
  date: Date;
  duration: number;
  transcript?: string;
}

async function generateMeetingNotes(
  audioFile: File,
  options?: { language?: string; includeTranscript?: boolean; includeActionItems?: boolean }
): Promise<MeetingNote> {
  // TODO: Implement with SHELL AI
  throw new Error('Meeting notes feature will be implemented with SHELL AI');
}
import { GlobalHeader } from '@/components/layout/GlobalHeader';

export default function MeetingNotesPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [meetingNote, setMeetingNote] = useState<MeetingNote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setError('오디오 파일만 업로드 가능합니다.');
      return;
    }

    setAudioFile(file);
    setError(null);
    setMeetingNote(null);
  };

  const handleGenerate = async () => {
    if (!audioFile) {
      setError('오디오 파일을 먼저 업로드해주세요.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const note = await generateMeetingNotes(audioFile, {
        language: 'ko',
        includeTranscript: true,
        includeActionItems: true,
      });
      setMeetingNote(note);
    } catch (err: any) {
      setError(err.message || '회의 노트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!meetingNote) return;

    const content = `
# ${meetingNote.title}

**날짜:** ${meetingNote.date.toLocaleDateString('ko-KR')}
**시간:** ${Math.floor(meetingNote.duration / 60)}분
**참석자:** ${meetingNote.participants.join(', ')}

## 요약
${meetingNote.summary}

## 핵심 포인트
${meetingNote.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

## 액션 아이템
${meetingNote.actionItems.map((item, i) => 
  `${i + 1}. **${item.task}** - 담당: ${item.assignee} (우선순위: ${item.priority})`
).join('\n')}

## 회의록
${meetingNote.transcript}
    `.trim();

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meetingNote.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <GlobalHeader />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Mic className="text-purple-600" size={32} />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900">
              SHELL AI 회의 노트
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            회의 음성을 자동으로 전문적인 노트로 변환합니다
          </p>
        </div>

        {/* 파일 업로드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 mb-8"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                회의 오디오 파일 업로드
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="audio-upload"
                />
                <label
                  htmlFor="audio-upload"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <Upload className="text-gray-400" size={48} />
                  <div>
                    <p className="text-gray-700 font-semibold">
                      {audioFile ? audioFile.name : '오디오 파일을 선택하세요'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      MP3, WAV, M4A 등 오디오 형식 지원
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!audioFile || isProcessing}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  회의 노트 생성 중...
                </>
              ) : (
                <>
                  <FileText size={20} />
                  회의 노트 생성
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* 결과 표시 */}
        {meetingNote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{meetingNote.title}</h2>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                다운로드
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">날짜</p>
                <p className="font-semibold text-gray-900">
                  {meetingNote.date.toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">시간</p>
                <p className="font-semibold text-gray-900">
                  {Math.floor(meetingNote.duration / 60)}분
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">참석자</p>
                <p className="font-semibold text-gray-900">{meetingNote.participants.length}명</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">액션 아이템</p>
                <p className="font-semibold text-gray-900">{meetingNote.actionItems.length}개</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">요약</h3>
              <p className="text-gray-700">{meetingNote.summary}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">핵심 포인트</h3>
              <ul className="space-y-2">
                {meetingNote.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={18} />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {meetingNote.actionItems.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">액션 아이템</h3>
                <div className="space-y-3">
                  {meetingNote.actionItems.map((item, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{item.task}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            담당: {item.assignee} • 우선순위: {item.priority}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : item.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {meetingNote.transcript && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">회의록</h3>
                <div className="p-4 bg-gray-50 rounded-xl max-h-96 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap">{meetingNote.transcript}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

