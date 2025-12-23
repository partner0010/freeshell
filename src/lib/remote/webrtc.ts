/**
 * WebRTC 기반 원격 제어 통신
 * 프로그램 다운로드 없이 브라우저에서 바로 사용
 */

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  offerOptions?: RTCOfferOptions;
  answerOptions?: RTCAnswerOptions;
}

export class WebRTCRemoteControl {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private config: WebRTCConfig;

  constructor(config?: Partial<WebRTCConfig>) {
    this.config = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
      ...config,
    };
  }

  /**
   * 화면 공유 시작 (호스트)
   */
  async startScreenShare(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        } as MediaTrackConstraints,
        audio: true,
      });

      this.localStream = stream;
      return stream;
    } catch (error) {
      console.error('화면 공유 실패:', error);
      throw error;
    }
  }

  /**
   * Peer Connection 생성
   */
  createPeerConnection(): RTCPeerConnection {
    this.peerConnection = new RTCPeerConnection(this.config);

    // 원격 스트림 수신
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
    };

    // ICE Candidate 처리
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // 실제로는 시그널링 서버를 통해 전송
        console.log('ICE Candidate:', event.candidate);
      }
    };

    // 연결 상태 변경
    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection?.connectionState);
    };

    // 로컬 스트림 추가
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });
    }

    return this.peerConnection;
  }

  /**
   * Data Channel 생성 (마우스/키보드 제어용)
   */
  createDataChannel(label: string): RTCDataChannel {
    if (!this.peerConnection) {
      throw new Error('Peer Connection이 생성되지 않았습니다.');
    }

    this.dataChannel = this.peerConnection.createDataChannel(label, {
      ordered: true,
    });

    this.dataChannel.onopen = () => {
      console.log('Data Channel 열림');
    };

    this.dataChannel.onclose = () => {
      console.log('Data Channel 닫힘');
    };

    this.dataChannel.onerror = (error) => {
      console.error('Data Channel 오류:', error);
    };

    return this.dataChannel;
  }

  /**
   * Offer 생성 (호스트)
   */
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      this.createPeerConnection();
    }

    const offer = await this.peerConnection!.createOffer(this.config.offerOptions);
    await this.peerConnection!.setLocalDescription(offer);

    return offer;
  }

  /**
   * Answer 생성 (클라이언트)
   */
  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      this.createPeerConnection();
    }

    await this.peerConnection!.setRemoteDescription(offer);
    const answer = await this.peerConnection!.createAnswer(this.config.answerOptions);
    await this.peerConnection!.setLocalDescription(answer);

    return answer;
  }

  /**
   * Remote Description 설정
   */
  async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Peer Connection이 생성되지 않았습니다.');
    }

    await this.peerConnection.setRemoteDescription(description);
  }

  /**
   * ICE Candidate 추가
   */
  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Peer Connection이 생성되지 않았습니다.');
    }

    await this.peerConnection.addIceCandidate(candidate);
  }

  /**
   * 마우스 이벤트 전송
   */
  sendMouseEvent(event: {
    type: 'move' | 'click' | 'down' | 'up' | 'wheel';
    x: number;
    y: number;
    button?: number;
    deltaX?: number;
    deltaY?: number;
  }): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.warn('Data Channel이 열려있지 않습니다.');
      return;
    }

    const { type: _, ...eventData } = event;
    this.dataChannel.send(JSON.stringify({
      type: 'mouse',
      ...eventData,
    }));
  }

  /**
   * 키보드 이벤트 전송
   */
  sendKeyboardEvent(event: {
    type: 'keydown' | 'keyup' | 'keypress';
    key: string;
    code: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
  }): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.warn('Data Channel이 열려있지 않습니다.');
      return;
    }

    const { type: _, ...eventData } = event;
    this.dataChannel.send(JSON.stringify({
      type: 'keyboard',
      ...eventData,
    }));
  }

  /**
   * 파일 전송
   */
  sendFile(file: File): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.warn('Data Channel이 열려있지 않습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      this.dataChannel!.send(JSON.stringify({
        type: 'file',
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      }));

      // 파일 데이터를 청크로 나누어 전송
      const chunkSize = 16384; // 16KB
      let offset = 0;

      const sendChunk = () => {
        if (offset < arrayBuffer.byteLength) {
          const chunk = arrayBuffer.slice(offset, offset + chunkSize);
          this.dataChannel!.send(chunk);
          offset += chunkSize;
          setTimeout(sendChunk, 0); // 다음 이벤트 루프에서 전송
        }
      };

      sendChunk();
    };

    reader.readAsArrayBuffer(file);
  }

  /**
   * 채팅 메시지 전송
   */
  sendChatMessage(message: string): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.warn('Data Channel이 열려있지 않습니다.');
      return;
    }

    this.dataChannel.send(JSON.stringify({
      type: 'chat',
      message,
      timestamp: Date.now(),
    }));
  }

  /**
   * 연결 종료
   */
  close(): void {
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }

  /**
   * 원격 스트림 가져오기
   */
  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  /**
   * 로컬 스트림 가져오기
   */
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }
}

