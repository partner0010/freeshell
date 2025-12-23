/**
 * 사용자 피드백 위젯
 * 리뷰, 평점, 피드백 수집
 */

'use client';

import React, { useState } from 'react';
import { MessageSquare, Star, X, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackData {
  rating: number;
  comment: string;
  type: 'positive' | 'negative' | 'suggestion';
}

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative' | 'suggestion'>('positive');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('평점을 선택해주세요.');
      return;
    }

    const feedback: FeedbackData = {
      rating,
      comment,
      type: feedbackType,
    };

    try {
      // API 호출 (실제로는 서버로 전송)
      console.log('피드백 제출:', feedback);
      
      // 성공 처리
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setRating(0);
        setComment('');
      }, 2000);
    } catch (error) {
      console.error('피드백 제출 실패:', error);
    }
  };

  return (
    <>
      {/* 피드백 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center group"
        aria-label="피드백"
      >
        <MessageSquare size={24} />
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
          !
        </span>
      </button>

      {/* 피드백 모달 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ThumbsUp className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">감사합니다!</h3>
                  <p className="text-gray-600">피드백이 성공적으로 제출되었습니다.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">피드백 남기기</h3>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* 피드백 타입 선택 */}
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setFeedbackType('positive')}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                        feedbackType === 'positive'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <ThumbsUp size={18} className="inline mr-2" />
                      긍정적
                    </button>
                    <button
                      onClick={() => setFeedbackType('negative')}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                        feedbackType === 'negative'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <ThumbsDown size={18} className="inline mr-2" />
                      개선점
                    </button>
                    <button
                      onClick={() => setFeedbackType('suggestion')}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                        feedbackType === 'suggestion'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      💡 제안
                    </button>
                  </div>

                  {/* 평점 */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      만족도 평가
                    </label>
                    <div className="flex gap-2 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-2"
                        >
                          <Star
                            size={32}
                            className={`transition-colors ${
                              star <= (hoverRating || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 코멘트 */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      의견을 남겨주세요
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="피드백을 입력하세요..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
                    />
                  </div>

                  {/* 제출 버튼 */}
                  <button
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    피드백 제출
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

