/**
 * 전자서명 페이지
 * 모두싸인 스타일의 전자서명 서비스
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileSignature, Upload, Send, CheckCircle, Clock, XCircle,
  FileText, Users, Shield, Download, Eye, Trash2, Search,
  Filter, MoreVertical, Share2, Lock, AlertCircle
} from 'lucide-react';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { AdBanner } from '@/components/ads/AdBanner';

interface Document {
  id: string;
  title: string;
  fileName: string;
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'rejected';
  signers: Array<{
    id: string;
    name: string;
    email: string;
    status: 'pending' | 'signed' | 'rejected';
    signedAt?: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export default function SignaturePage() {
  const [activeTab, setActiveTab] = useState<'create' | 'sent' | 'received' | 'completed'>('create');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // 문서 업로드
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setShowUploadModal(true);
    }
  };

  // 서명 요청 생성
  const handleCreateRequest = async (data: {
    title: string;
    signers: Array<{ name: string; email: string }>;
    message?: string;
  }) => {
    if (!uploadedFile) return;

    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      title: data.title,
      fileName: uploadedFile.name,
      status: 'pending',
      signers: data.signers.map((signer, idx) => ({
        id: `signer-${idx}`,
        name: signer.name,
        email: signer.email,
        status: 'pending',
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후 만료
    };

    setDocuments([newDocument, ...documents]);
    setShowUploadModal(false);
    setUploadedFile(null);
    setActiveTab('sent');
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: Document['status']) => {
    switch (status) {
      case 'completed': return '완료';
      case 'in_progress': return '진행 중';
      case 'pending': return '대기 중';
      case 'rejected': return '거부됨';
      default: return '초안';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <GlobalHeader />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FileSignature className="text-white" size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900">
              전자서명
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            법적 효력이 있는 전자서명으로 문서를 빠르고 안전하게 처리하세요
          </p>
        </motion.div>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 border-b border-gray-200 mb-8 overflow-x-auto">
          {[
            { id: 'create', label: '서명 요청 생성', icon: Upload },
            { id: 'sent', label: '보낸 문서', icon: Send },
            { id: 'received', label: '받은 문서', icon: FileText },
            { id: 'completed', label: '완료된 문서', icon: CheckCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 서명 요청 생성 탭 */}
        {activeTab === 'create' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                새 서명 요청 만들기
              </h2>
              <p className="text-gray-600">
                문서를 업로드하고 서명자를 추가하여 전자서명을 요청하세요
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* 파일 업로드 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  문서 업로드
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Upload className="text-blue-600" size={32} />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">
                        클릭하여 파일 선택 또는 드래그 앤 드롭
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PDF, Word, 이미지 파일 지원 (최대 10MB)
                      </p>
                    </div>
                  </label>
                </div>
                {uploadedFile && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="text-blue-600" size={20} />
                      <div>
                        <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="p-2 hover:bg-blue-100 rounded-lg"
                    >
                      <XCircle className="text-blue-600" size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* 서명 요청 정보 */}
              {uploadedFile && (
                <DocumentRequestForm
                  fileName={uploadedFile.name}
                  onSubmit={handleCreateRequest}
                  onCancel={() => {
                    setUploadedFile(null);
                    setShowUploadModal(false);
                  }}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* 보낸 문서 탭 */}
        {activeTab === 'sent' && (
          <DocumentsList
            documents={documents.filter(doc => doc.status !== 'completed')}
            type="sent"
            onSelect={setSelectedDocument}
          />
        )}

        {/* 받은 문서 탭 */}
        {activeTab === 'received' && (
          <DocumentsList
            documents={[]}
            type="received"
            onSelect={setSelectedDocument}
          />
        )}

        {/* 완료된 문서 탭 */}
        {activeTab === 'completed' && (
          <DocumentsList
            documents={documents.filter(doc => doc.status === 'completed')}
            type="completed"
            onSelect={setSelectedDocument}
          />
        )}

        {/* 광고 배너 */}
        <div className="mt-12">
          <AdBanner position="inline" />
        </div>
      </div>

      {/* 문서 상세 모달 */}
      {selectedDocument && (
        <DocumentDetailModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}

// 서명 요청 폼 컴포넌트
function DocumentRequestForm({
  fileName,
  onSubmit,
  onCancel,
}: {
  fileName: string;
  onSubmit: (data: {
    title: string;
    signers: Array<{ name: string; email: string }>;
    message?: string;
  }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [signers, setSigners] = useState<Array<{ name: string; email: string }>>([{ name: '', email: '' }]);
  const [message, setMessage] = useState('');

  const handleAddSigner = () => {
    setSigners([...signers, { name: '', email: '' }]);
  };

  const handleRemoveSigner = (index: number) => {
    setSigners(signers.filter((_, i) => i !== index));
  };

  const handleSignerChange = (index: number, field: 'name' | 'email', value: string) => {
    const newSigners = [...signers];
    newSigners[index][field] = value;
    setSigners(newSigners);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('문서 제목을 입력하세요.');
      return;
    }

    const validSigners = signers.filter(s => s.name.trim() && s.email.trim());
    if (validSigners.length === 0) {
      alert('최소 1명의 서명자를 추가하세요.');
      return;
    }

    onSubmit({
      title,
      signers: validSigners,
      message,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          문서 제목 *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 계약서, 동의서, 승인서 등"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          서명자 추가 *
        </label>
        <div className="space-y-3">
          {signers.map((signer, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={signer.name}
                onChange={(e) => handleSignerChange(index, 'name', e.target.value)}
                placeholder="이름"
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <input
                type="email"
                value={signer.email}
                onChange={(e) => handleSignerChange(index, 'email', e.target.value)}
                placeholder="이메일"
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
              {signers.length > 1 && (
                <button
                  onClick={() => handleRemoveSigner(index)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  <XCircle size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleAddSigner}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600"
          >
            + 서명자 추가
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          메시지 (선택사항)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="서명자에게 전달할 메시지를 입력하세요..."
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg font-semibold flex items-center justify-center gap-2"
        >
          <Send size={18} />
          서명 요청 보내기
        </button>
      </div>
    </div>
  );
}

// 문서 목록 컴포넌트
function DocumentsList({
  documents,
  type,
  onSelect,
}: {
  documents: Document[];
  type: 'sent' | 'received' | 'completed';
  onSelect: (doc: Document) => void;
}) {
  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-200 text-center">
        <FileText className="text-gray-400 mx-auto mb-4" size={64} />
        <p className="text-gray-600 text-lg">
          {type === 'sent' && '보낸 문서가 없습니다.'}
          {type === 'received' && '받은 문서가 없습니다.'}
          {type === 'completed' && '완료된 문서가 없습니다.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          {type === 'sent' && '보낸 문서'}
          {type === 'received' && '받은 문서'}
          {type === 'completed' && '완료된 문서'}
        </h2>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Search size={18} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Filter size={18} />
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {documents.map((doc) => (
          <DocumentItem
            key={doc.id}
            document={doc}
            onClick={() => onSelect(doc)}
          />
        ))}
      </div>
    </div>
  );
}

// 문서 아이템 컴포넌트
function DocumentItem({
  document,
  onClick,
}: {
  document: Document;
  onClick: () => void;
}) {
  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: Document['status']) => {
    switch (status) {
      case 'completed': return '완료';
      case 'in_progress': return '진행 중';
      case 'pending': return '대기 중';
      case 'rejected': return '거부됨';
      default: return '초안';
    }
  };

  const signedCount = document.signers.filter(s => s.status === 'signed').length;
  const totalSigners = document.signers.length;

  return (
    <div
      onClick={onClick}
      className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-blue-600" size={20} />
            <h3 className="font-semibold text-gray-900">{document.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(document.status)}`}>
              {getStatusLabel(document.status)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{document.fileName}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>서명자 {signedCount}/{totalSigners}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{document.createdAt.toLocaleDateString('ko-KR')}</span>
            </div>
            {document.expiresAt && (
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span>만료: {document.expiresAt.toLocaleDateString('ko-KR')}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-200 rounded-lg">
            <Eye size={18} />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-lg">
            <Download size={18} />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-lg">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// 문서 상세 모달 컴포넌트
function DocumentDetailModal({
  document,
  onClose,
}: {
  document: Document;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{document.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <XCircle size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">서명자 목록</h3>
              <div className="space-y-2">
                {document.signers.map((signer) => (
                  <div
                    key={signer.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{signer.name}</p>
                      <p className="text-sm text-gray-600">{signer.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {signer.status === 'signed' ? (
                        <>
                          <CheckCircle className="text-green-600" size={20} />
                          <span className="text-sm text-green-600">서명 완료</span>
                        </>
                      ) : signer.status === 'rejected' ? (
                        <>
                          <XCircle className="text-red-600" size={20} />
                          <span className="text-sm text-red-600">거부됨</span>
                        </>
                      ) : (
                        <>
                          <Clock className="text-yellow-600" size={20} />
                          <span className="text-sm text-yellow-600">대기 중</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
              <Shield className="text-blue-600" size={20} />
              <p className="text-sm text-blue-700">
                모든 문서는 암호화되어 안전하게 저장되며, 법적 효력이 있습니다.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

