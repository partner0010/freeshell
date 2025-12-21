# Freeshell 프로젝트 가이드

## 🚀 빠른 시작

### 배포 문제 해결

현재 Vercel 배포 시 Prisma Client 생성 문제가 발생하고 있습니다.

**해결 방법:**

1. **`package.json`에 `vercel-build` 스크립트 추가**
   ```json
   "vercel-build": "npx prisma generate && next build"
   ```

2. **`vercel.json`에 `installCommand` 추가**
   ```json
   {
     "buildCommand": "npx prisma generate && npx next build",
     "installCommand": "npm install && npx prisma generate"
   }
   ```

3. **Git에 푸시**
   ```cmd
   git add package.json vercel.json prisma/schema.prisma
   git commit -m "fix: add vercel-build script and installCommand"
   git push origin main
   ```

## 📁 프로젝트 구조

```
Freeshell/
├── .github/          # GitHub 관련 파일
├── prisma/           # Prisma 스키마
├── public/           # 정적 파일
├── src/              # 소스 코드
├── package.json      # 프로젝트 설정
├── vercel.json       # Vercel 설정
└── next.config.js    # Next.js 설정
```

## 🔧 주요 설정 파일

### package.json
- `vercel-build`: Vercel 배포 시 사용되는 빌드 스크립트
- `build`: 로컬 빌드 스크립트
- `postinstall`: npm install 후 자동 실행

### vercel.json
- `buildCommand`: 빌드 명령어
- `installCommand`: 설치 명령어

### prisma/schema.prisma
- 데이터베이스 스키마 정의
- 프로젝트 루트에 있어야 함

## 🐛 문제 해결

### Prisma Client 생성 오류
- `prisma/schema.prisma`가 프로젝트 루트에 있는지 확인
- `package.json`에 `vercel-build` 스크립트가 있는지 확인
- `vercel.json`에 `installCommand`가 있는지 확인

### 배포 실패
- GitHub 저장소의 `package.json` 확인
- Vercel 대시보드에서 Build Command 확인
- Build Logs에서 오류 메시지 확인

## 📝 참고 자료

- [Prisma Vercel 가이드](https://pris.ly/d/vercel-build)
- [Vercel Build 설정](https://vercel.com/docs/build-step)

