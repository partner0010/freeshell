/**
 * 파일 관리자
 * File Manager
 */

export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number; // bytes
  url: string;
  thumbnail?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  files: FileItem[];
  folders: Folder[];
  createdAt: Date;
}

// 파일 관리자
export class FileManager {
  private files: Map<string, FileItem> = new Map();
  private folders: Map<string, Folder> = new Map();

  // 파일 업로드 (시뮬레이션)
  async uploadFile(file: File): Promise<FileItem> {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const fileItem: FileItem = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: this.getFileType(file.name),
      size: file.size,
      url: URL.createObjectURL(file),
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.files.set(fileItem.id, fileItem);
    return fileItem;
  }

  // 파일 타입 감지
  private getFileType(filename: string): FileType {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv'];
    const audioExts = ['mp3', 'wav', 'ogg', 'm4a'];
    const docExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
    const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz'];

    if (imageExts.includes(ext)) return 'image';
    if (videoExts.includes(ext)) return 'video';
    if (audioExts.includes(ext)) return 'audio';
    if (docExts.includes(ext)) return 'document';
    if (archiveExts.includes(ext)) return 'archive';
    return 'other';
  }

  // 폴더 생성
  createFolder(name: string, parentId?: string): Folder {
    const folder: Folder = {
      id: `folder-${Date.now()}`,
      name,
      parentId,
      files: [],
      folders: [],
      createdAt: new Date(),
    };
    this.folders.set(folder.id, folder);
    return folder;
  }

  // 파일 가져오기
  getFile(id: string): FileItem | undefined {
    return this.files.get(id);
  }

  // 모든 파일 가져오기
  getAllFiles(): FileItem[] {
    return Array.from(this.files.values());
  }

  // 파일 검색
  searchFiles(query: string, type?: FileType): FileItem[] {
    let results = Array.from(this.files.values());

    if (type) {
      results = results.filter(f => f.type === type);
    }

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    return results;
  }

  // 파일 삭제
  deleteFile(id: string): void {
    this.files.delete(id);
  }

  // 파일 크기 포맷팅
  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }
}

export const fileManager = new FileManager();

