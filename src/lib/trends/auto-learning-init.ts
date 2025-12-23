/**
 * 자동 학습 시스템 초기화
 * 서버 시작 시 자동 트렌드 수집 시작
 */

import { autoLearningSystem } from './auto-learning-system';

// 서버 시작 시 자동 트렌드 수집 시작 (1시간마다)
if (typeof window === 'undefined') {
  // 서버 사이드에서만 실행
  autoLearningSystem.startAutoCollection(60); // 1시간마다
}

export {};

