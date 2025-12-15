/**
 * 원격 지원 시스템 (ANYSUPPORT 벤치마킹)
 * Remote Support System
 */

export type SessionStatus = 'pending' | 'active' | 'paused' | 'ended';

export interface RemoteSession {
  id: string;
  sessionCode: string; // 연결 코드
  hostUserId: string; // 호스트 (지원 받는 사람)
  clientUserId: string; // 클라이언트 (지원 제공자)
  status: SessionStatus;
  permissions: {
    screenShare: boolean;
    remoteControl: boolean;
    fileTransfer: boolean;
    chat: boolean;
    audio: boolean;
    recording?: boolean; // 세션 녹화 (추가)
  };
  createdAt: Date;
  endedAt?: Date;
  duration?: number; // 초 단위
  multiMonitor?: boolean; // 멀티 모니터 지원 (추가)
  encryption?: boolean; // 암호화 사용 (추가)
}

export interface FileTransfer {
  id: string;
  sessionId: string;
  fileName: string;
  fileSize: number;
  direction: 'upload' | 'download';
  status: 'pending' | 'transferring' | 'completed' | 'failed';
  progress: number; // 0-100
  startedAt: Date;
  completedAt?: Date;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

// 원격 지원 관리자
export class RemoteSupportManager {
  private sessions: Map<string, RemoteSession> = new Map();
  private fileTransfers: Map<string, FileTransfer> = new Map();
  private chatMessages: Map<string, ChatMessage[]> = new Map();

  // 세션 생성
  createSession(hostUserId: string, permissions?: Partial<RemoteSession['permissions']>): RemoteSession {
    const sessionCode = this.generateSessionCode();
    const session: RemoteSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sessionCode,
      hostUserId,
      clientUserId: '', // 연결 대기 중
      status: 'pending',
      permissions: {
        screenShare: true,
        remoteControl: true,
        fileTransfer: true,
        chat: true,
        audio: false,
        ...permissions,
      },
      createdAt: new Date(),
    };
    this.sessions.set(session.id, session);
    this.chatMessages.set(session.id, []);
    return session;
  }

  // 세션 코드로 연결
  connectToSession(sessionCode: string, clientUserId: string): RemoteSession | null {
    const session = Array.from(this.sessions.values()).find(s => s.sessionCode === sessionCode);
    if (!session || session.status !== 'pending') {
      return null;
    }

    session.clientUserId = clientUserId;
    session.status = 'active';
    return session;
  }

  // 세션 종료
  endSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.status = 'ended';
    session.endedAt = new Date();
    if (session.createdAt) {
      session.duration = Math.floor((session.endedAt.getTime() - session.createdAt.getTime()) / 1000);
    }
  }

  // 파일 전송 시작
  startFileTransfer(
    sessionId: string,
    fileName: string,
    fileSize: number,
    direction: FileTransfer['direction']
  ): FileTransfer {
    const transfer: FileTransfer = {
      id: `transfer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      fileName,
      fileSize,
      direction,
      status: 'transferring',
      progress: 0,
      startedAt: new Date(),
    };
    this.fileTransfers.set(transfer.id, transfer);
    return transfer;
  }

  // 파일 전송 진행률 업데이트
  updateFileTransferProgress(transferId: string, progress: number): void {
    const transfer = this.fileTransfers.get(transferId);
    if (!transfer) return;

    transfer.progress = progress;
    if (progress >= 100) {
      transfer.status = 'completed';
      transfer.completedAt = new Date();
    }
  }

  // 채팅 메시지 추가
  addChatMessage(sessionId: string, userId: string, message: string): ChatMessage {
    const chatMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      userId,
      message,
      timestamp: new Date(),
    };

    const messages = this.chatMessages.get(sessionId) || [];
    messages.push(chatMessage);
    this.chatMessages.set(sessionId, messages);
    return chatMessage;
  }

  // 세션 코드 생성 (6자리)
  private generateSessionCode(): string {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  // 세션 가져오기
  getSession(id: string): RemoteSession | undefined {
    return this.sessions.get(id);
  }

  // 세션 코드로 세션 찾기
  getSessionByCode(code: string): RemoteSession | undefined {
    return Array.from(this.sessions.values()).find(s => s.sessionCode === code);
  }

  // 모든 활성 세션 가져오기
  getActiveSessions(): RemoteSession[] {
    return Array.from(this.sessions.values()).filter(s => s.status === 'active');
  }

  // 채팅 메시지 가져오기
  getChatMessages(sessionId: string): ChatMessage[] {
    return this.chatMessages.get(sessionId) || [];
  }

  // 파일 전송 가져오기
  getFileTransfers(sessionId: string): FileTransfer[] {
    return Array.from(this.fileTransfers.values()).filter(t => t.sessionId === sessionId);
  }
}

export const remoteSupportManager = new RemoteSupportManager();

