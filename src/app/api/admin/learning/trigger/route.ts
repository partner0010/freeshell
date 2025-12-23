/**
 * AI 자동 학습 트리거 API
 * 주기적으로 온라인에서 학습하도록 트리거
 */

import { NextRequest, NextResponse } from 'next/server';
import { onlineLearningSystem } from '@/lib/ai/online-learning';
import { AutonomousLearningSystem } from '@/lib/ai/autonomous-learning';
import { AISecurityEnhancer } from '@/lib/security/ai-security-enhancer';
import { AISecurityGuard } from '@/lib/security/ai-security-guard';
import { SelfHealingSystem } from '@/lib/automation/self-healing';

const securityGuard = new AISecurityGuard();
const securityEnhancer = new AISecurityEnhancer(securityGuard);
const selfHealing = new SelfHealingSystem();
const learningSystem = new AutonomousLearningSystem(securityEnhancer, selfHealing);

export async function POST(request: NextRequest) {
  try {
    // 온라인에서 최신 트렌드 수집
    const learningResult = await onlineLearningSystem.learnFromAllSources();
    
    // 자율 학습 시스템에 통합
    const tasks = await learningSystem.learnFromOnline();
    await learningSystem.analyzeAndPrioritize();
    const proposals = await learningSystem.createAdminProposals();

    return NextResponse.json({
      success: true,
      message: '온라인 학습이 완료되었습니다.',
      learningResult,
      tasks: tasks.length,
      proposals: proposals.length,
      timestamp: new Date(),
    });
  } catch (error: any) {
    console.error('온라인 학습 트리거 오류:', error);
    return NextResponse.json(
      { error: '온라인 학습 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 학습된 데이터 조회
    const learnedData = onlineLearningSystem.getLearnedData();
    const lastFetchTimes = {
      github: onlineLearningSystem.getLastFetchTime('github'),
      npm: onlineLearningSystem.getLastFetchTime('npm'),
      security: onlineLearningSystem.getLastFetchTime('security'),
      ai: onlineLearningSystem.getLastFetchTime('ai'),
    };

    return NextResponse.json({
      success: true,
      learnedData: learnedData.slice(0, 20), // 최근 20개만
      lastFetchTimes,
      totalTrends: learnedData.length,
    });
  } catch (error: any) {
    console.error('학습 데이터 조회 오류:', error);
    return NextResponse.json(
      { error: '학습 데이터 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

