# 📋 Netlify 배포 설정 가이드

## ✅ 수정 완료된 설정

### 1. netlify.toml ✅
- `publish` 설정 제거 (Next.js 플러그인이 자동 처리)
- `NPM_FLAGS` 추가 (의존성 문제 해결)
- 보안 헤더 강화

### 2. 배포 스크립트 ✅
- 현재 Git 브랜치 자동 감지 (`master` 또는 `main`)
- 브랜치 이름 표시

## 🚀 Netlify 대시보드 설정

### Build settings (빌드 설정)

1. **Site settings** > **Build & deploy** 이동
2. **Build settings** 섹션에서:
   - **Build command**: `npm run build`
   - **Publish directory**: (비워두기 - Next.js 플러그인이 자동 처리)

### Environment variables (환경 변수)

필요한 환경 변수를 추가하세요:
- `DATABASE_URL` (Prisma 사용 시)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- 기타 API 키 등

### Deploy settings (배포 설정)

1. **Deploy notifications** 설정 (선택사항)
2. **Deploy hooks** 설정 (선택사항)

## 📝 배포 프로세스

### 1. 로컬에서 배포 스크립트 실행

```batch
deploy.bat
또는
빠른_배포.bat
```

### 2. 스크립트 실행 단계

1. **빌드 테스트**: `.next` 폴더 정리 후 빌드
2. **Git 상태 확인**: 변경사항 확인
3. **커밋**: 변경사항 커밋
4. **푸시**: 현재 브랜치에 푸시 (자동 감지)

### 3. Netlify 자동 배포

- GitHub에 푸시되면 Netlify가 자동으로 배포 시작
- Netlify 대시보드에서 배포 상태 확인

## 🔍 문제 해결

### 배포가 실패하는 경우:

1. **빌드 로그 확인**
   - Netlify 대시보드 > Deploys > 실패한 배포 클릭
   - Build log 확인

2. **일반적인 오류**

   **오류**: `Cannot find module '@prisma/client'`
   - **해결**: `package.json`에 `@prisma/client` 포함 확인
   - **해결**: `postinstall` 스크립트 확인

   **오류**: `Build command failed`
   - **해결**: `netlify.toml`의 `command` 확인
   - **해결**: 로컬에서 `npm run build` 테스트

   **오류**: `Publish directory does not exist`
   - **해결**: `publish` 설정 제거 (이미 수정됨)

3. **의존성 문제**
   - `NPM_FLAGS = "--legacy-peer-deps"` 추가됨
   - 필요시 로컬에서 `npm install --legacy-peer-deps` 실행

## ✅ 체크리스트

배포 전 확인사항:

- [ ] `netlify.toml` 파일이 프로젝트 루트에 있음
- [ ] `package.json`에 모든 의존성이 포함됨
- [ ] `prisma/schema.prisma` 파일이 존재함
- [ ] 로컬에서 `npm run build` 성공
- [ ] Git 저장소가 Netlify에 연결됨
- [ ] 환경 변수가 Netlify에 설정됨 (필요한 경우)

## 🎯 현재 브랜치

현재 Git 브랜치: **master**

배포 스크립트가 자동으로 `master` 브랜치를 감지하여 푸시합니다.

## 📞 추가 도움

문제가 계속되면:
1. Netlify 대시보드의 빌드 로그 확인
2. 로컬 빌드 테스트: `npm run build`
3. Git 상태 확인: `git status`

