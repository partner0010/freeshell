# 📋 Vercel 프로젝트 재연결 단계 (간단 버전)

## 빠른 가이드

### 1. Vercel 대시보드 접속
- https://vercel.com/dashboard
- Freeshell 프로젝트 클릭

### 2. Settings → General
- 왼쪽 메뉴에서 "Settings" 클릭
- "General" 클릭

### 3. Git 저장소 연결 해제
- 페이지를 아래로 스크롤
- "Git" 섹션 찾기
- **"Disconnect Git Repository"** 버튼 클릭
- 확인

### 4. Git 저장소 다시 연결
- **"Connect Git Repository"** 버튼 클릭
- GitHub 저장소 선택: **partner0010/freeshell**
- "Deploy" 또는 "Import" 클릭

### 5. 빌드 설정 확인
- Settings → General → Build & Development Settings
- Production Overrides 확인 (비어있어야 함)
- Project Settings 확인

### 6. 배포 확인
- Deployments → 최신 배포 → Build Logs
- `npx prisma generate && npx next build` 실행 확인

---

## 끝!

**이것만 하면 됩니다!** 🎉

