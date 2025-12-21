# 📋 파일 위치 확인 가이드

## 현재 상황

파일들이 프로젝트 루트에 생성되지 않았을 수 있습니다.

## 확인 방법

### 1. 프로젝트 루트 확인

프로젝트 루트는 다음 파일들이 있는 폴더입니다:
- `package.json`
- `src/` 폴더
- `public/` 폴더
- `next.config.js` (있는 경우)

### 2. 필요한 파일 확인

프로젝트 루트에 다음 파일들이 있어야 합니다:

#### ✅ `vercel.json`
```json
{
  "buildCommand": "npx prisma generate && npx next build"
}
```

#### ✅ `prisma/schema.prisma`
- Prisma 스키마 파일

#### ✅ `package.json`
- `build` 스크립트: `"build": "npx prisma generate && next build"`

## 해결 방법

### 방법 1: 수동으로 파일 생성

1. **프로젝트 루트로 이동**
   - `C:\Users\partn\OneDrive\바탕 화면\Cursor\Freeshell` (`.github` 폴더의 상위 폴더)

2. **`vercel.json` 파일 생성**
   - 프로젝트 루트에 `vercel.json` 파일 생성
   - 내용:
     ```json
     {
       "buildCommand": "npx prisma generate && npx next build"
     }
     ```

3. **`prisma/schema.prisma` 파일 생성**
   - 프로젝트 루트에 `prisma` 폴더 생성
   - `prisma/schema.prisma` 파일 생성
   - 내용은 `.github/prisma/schema.prisma` 파일 참고

### 방법 2: Git에 푸시 확인

파일들이 프로젝트 루트에 있다면:

```bash
git add vercel.json prisma/schema.prisma
git commit -m "fix: add vercel.json and prisma schema"
git push origin main
```

## ⚠️ 중요 사항

**Vercel은 프로젝트 루트의 파일만 인식합니다!**

- ✅ `vercel.json` (프로젝트 루트)
- ✅ `prisma/schema.prisma` (프로젝트 루트)
- ❌ `.github/vercel.json` (인식 안 됨)
- ❌ `.github/prisma/schema.prisma` (인식 안 됨)

## 확인 명령어

프로젝트 루트에서 실행:

```bash
# vercel.json 확인
Test-Path "vercel.json"

# prisma/schema.prisma 확인
Test-Path "prisma\schema.prisma"

# package.json 확인
Test-Path "package.json"
```

모두 `True`가 나와야 합니다!

