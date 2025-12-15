/**
 * 피드백 시스템
 * Feedback System
 */

export type FeedbackType = 'bug' | 'feature' | 'improvement' | 'question' | 'compliment';

export type FeedbackStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

export interface Feedback {
  id: string;
  type: FeedbackType;
  title: string;
  description: string;
  status: FeedbackStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  author: string;
  votes: number;
  tags: string[];
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
  comments: FeedbackComment[];
}

export interface FeedbackComment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

// 피드백 시스템
export class FeedbackSystem {
  private feedbacks: Map<string, Feedback> = new Map();

  // 피드백 생성
  createFeedback(
    type: FeedbackType,
    title: string,
    description: string,
    author: string,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Feedback {
    const feedback: Feedback = {
      id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      description,
      status: 'open',
      priority,
      author,
      votes: 0,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    };
    this.feedbacks.set(feedback.id, feedback);
    return feedback;
  }

  // 피드백 가져오기
  getFeedback(id: string): Feedback | undefined {
    return this.feedbacks.get(id);
  }

  // 모든 피드백 가져오기
  getAllFeedbacks(): Feedback[] {
    return Array.from(this.feedbacks.values());
  }

  // 피드백 필터링
  filterFeedbacks(filters: {
    type?: FeedbackType;
    status?: FeedbackStatus;
    priority?: string;
  }): Feedback[] {
    let results = Array.from(this.feedbacks.values());

    if (filters.type) {
      results = results.filter(f => f.type === filters.type);
    }

    if (filters.status) {
      results = results.filter(f => f.status === filters.status);
    }

    if (filters.priority) {
      results = results.filter(f => f.priority === filters.priority);
    }

    return results.sort((a, b) => b.votes - a.votes);
  }

  // 피드백 투표
  voteFeedback(id: string): void {
    const feedback = this.feedbacks.get(id);
    if (feedback) {
      feedback.votes++;
      feedback.updatedAt = new Date();
    }
  }

  // 피드백 상태 업데이트
  updateStatus(id: string, status: FeedbackStatus): void {
    const feedback = this.feedbacks.get(id);
    if (feedback) {
      feedback.status = status;
      feedback.updatedAt = new Date();
    }
  }

  // 댓글 추가
  addComment(id: string, author: string, content: string): FeedbackComment {
    const feedback = this.feedbacks.get(id);
    if (!feedback) throw new Error('Feedback not found');

    const comment: FeedbackComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author,
      content,
      createdAt: new Date(),
    };

    feedback.comments.push(comment);
    feedback.updatedAt = new Date();
    return comment;
  }
}

export const feedbackSystem = new FeedbackSystem();

