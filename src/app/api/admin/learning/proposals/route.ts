/**
 * AI 학습 및 관리자 제안 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { AutonomousLearningSystem } from '@/lib/ai/autonomous-learning';
import { AISecurityEnhancer } from '@/lib/security/ai-security-enhancer';
import { AISecurityGuard } from '@/lib/security/ai-security-guard';
import { SelfHealingSystem } from '@/lib/automation/self-healing';

const securityGuard = new AISecurityGuard();
const securityEnhancer = new AISecurityEnhancer(securityGuard);
const selfHealing = new SelfHealingSystem();
const learningSystem = new AutonomousLearningSystem(securityEnhancer, selfHealing);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const proposals = learningSystem.getAdminProposals(
      status as any || undefined
    );

    return NextResponse.json({
      success: true,
      proposals,
    });
  } catch (error: any) {
    console.error('제안 조회 오류:', error);
    return NextResponse.json(
      { error: '제안 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, proposalId, decision, feedback, modifications } = await request.json();

    if (action === 'learn') {
      // 온라인에서 학습
      const tasks = await learningSystem.learnFromOnline();
      await learningSystem.analyzeAndPrioritize();
      const proposals = await learningSystem.createAdminProposals();

      return NextResponse.json({
        success: true,
        tasks,
        proposals,
      });
    } else if (action === 'respond' && proposalId) {
      // 관리자 응답
      const proposals = learningSystem.getAdminProposals();
      const proposal = proposals.find(p => p.id === proposalId);

      if (!proposal) {
        return NextResponse.json(
          { error: '제안을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      proposal.status = decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'modified';
      proposal.adminResponse = {
        decision: decision as any,
        feedback: feedback || '',
        modifications: modifications || [],
        timestamp: new Date(),
      };

      if (decision === 'approve') {
        proposal.task.status = 'approved';
        proposal.task.approvedAt = new Date();
      }

      return NextResponse.json({
        success: true,
        proposal,
      });
    }

    return NextResponse.json(
      { error: '알 수 없는 액션입니다.' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('학습 시스템 오류:', error);
    return NextResponse.json(
      { error: '학습 시스템 실행 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

