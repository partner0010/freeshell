'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Star,
  Send,
  X,
  Bug,
  Lightbulb,
  Heart,
  Camera,
  CheckCircle,
} from 'lucide-react';

type FeedbackType = 'bug' | 'idea' | 'feedback' | 'love';

const feedbackTypes = [
  { type: 'bug' as const, icon: Bug, label: '버그 신고', color: 'bg-red-100 text-red-600' },
  { type: 'idea' as const, icon: Lightbulb, label: '아이디어', color: 'bg-yellow-100 text-yellow-600' },
  { type: 'feedback' as const, icon: MessageSquare, label: '피드백', color: 'bg-blue-100 text-blue-600' },
  { type: 'love' as const, icon: Heart, label: '칭찬', color: 'bg-pink-100 text-pink-600' },
];

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'type' | 'form' | 'rating' | 'success'>('type');
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [email, setEmail] = useState('');
  const [includeScreenshot, setIncludeScreenshot] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep('success');
    setIsSubmitting(false);
  };

  const reset = () => {
    setStep('type');
    setSelectedType(null);
    setMessage('');
    setRating(0);
    setEmail('');
    setIncludeScreenshot(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(reset, 300);
  };

  return (
    <>
      {/* 피드백 버튼 */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-6 z-40 w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white"
      >
        <MessageSquare size={20} />
      </motion.button>

      {/* 피드백 모달 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                  {step === 'type' && '어떤 의견인가요?'}
                  {step === 'form' && feedbackTypes.find(t => t.type === selectedType)?.label}
                  {step === 'rating' && '서비스 만족도'}
                  {step === 'success' && '감사합니다!'}
                </h3>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {/* 타입 선택 */}
                {step === 'type' && (
                  <div className="grid grid-cols-2 gap-3">
                    {feedbackTypes.map((type) => (
                      <motion.button
                        key={type.type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedType(type.type);
                          setStep('form');
                        }}
                        className={`p-4 rounded-xl border-2 border-transparent hover:border-primary-300 transition-all ${type.color}`}
                      >
                        <type.icon size={32} className="mx-auto mb-2" />
                        <p className="font-medium">{type.label}</p>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* 폼 */}
                {step === 'form' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {selectedType === 'bug' ? '어떤 문제가 있나요?' : '의견을 들려주세요'}
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="자세히 설명해주세요..."
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 h-32 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이메일 (선택)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="답변을 받고 싶으시면 입력해주세요"
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                    </div>

                    {selectedType === 'bug' && (
                      <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeScreenshot}
                          onChange={(e) => setIncludeScreenshot(e.target.checked)}
                          className="rounded text-primary-500"
                        />
                        <Camera size={18} className="text-gray-500" />
                        <span className="text-sm text-gray-700">현재 화면 스크린샷 첨부</span>
                      </label>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setStep('type')}
                        className="flex-1 py-2 border rounded-xl hover:bg-gray-50"
                      >
                        이전
                      </button>
                      <button
                        onClick={() => setStep('rating')}
                        disabled={!message.trim()}
                        className="flex-1 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50"
                      >
                        다음
                      </button>
                    </div>
                  </div>
                )}

                {/* 평점 */}
                {step === 'rating' && (
                  <div className="text-center space-y-6">
                    <p className="text-gray-600">GRIP을 사용하시면서 얼마나 만족하셨나요?</p>
                    
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            size={40}
                            className={`transition-colors ${
                              star <= (hoverRating || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <p className="text-sm text-gray-500">
                      {rating === 0 && '별점을 선택해주세요'}
                      {rating === 1 && '😞 매우 불만족'}
                      {rating === 2 && '😕 불만족'}
                      {rating === 3 && '😐 보통'}
                      {rating === 4 && '🙂 만족'}
                      {rating === 5 && '😍 매우 만족'}
                    </p>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setStep('form')}
                        className="flex-1 py-2 border rounded-xl hover:bg-gray-50"
                      >
                        이전
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={rating === 0 || isSubmitting}
                        className="flex-1 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                              ⏳
                            </motion.div>
                            제출 중...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            제출하기
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* 성공 */}
                {step === 'success' && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle size={48} className="text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      피드백이 전송되었습니다!
                    </h3>
                    <p className="text-gray-500 mb-6">
                      소중한 의견 감사합니다.<br />
                      더 좋은 서비스를 만들겠습니다.
                    </p>
                    <button
                      onClick={handleClose}
                      className="px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600"
                    >
                      닫기
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

