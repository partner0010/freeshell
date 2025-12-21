# 🚨 긴급: Prisma Schema 위치 문제

## ❌ 발견된 문제

빌드 로그 분석 결과:
- `npx prisma generate`가 실행되지 않음
- Prisma schema가 프로젝트 루트에 없을 수 있음
- `.github/prisma/schema.prisma`에만 존재할 수 있음

## ✅ 해결 방법

### 1단계: Prisma Schema 위치 확인 및 생성

프로젝트 루트에서 확인:
```bash
# Windows PowerShell
Test-Path "prisma\schema.prisma"

# 또는 파일 탐색기에서 확인
# 프로젝트 루트에 prisma 폴더가 있는지 확인
# prisma 폴더 안에 schema.prisma 파일이 있는지 확인
```

**파일이 없으면:**
1. 프로젝트 루트에 `prisma` 폴더 생성
2. `.github/prisma/schema.prisma`를 `prisma/schema.prisma`로 복사

### 2단계: Vercel Build Settings에서 직접 설정 (필수)

`package.json`의 변경사항이 적용되지 않을 수 있으므로, **Vercel 대시보드에서 직접 Build Command를 설정**해야 합니다.

**단계:**
1. Vercel 대시보드 → Settings → General → Build & Development Settings
2. Framework Settings 섹션
3. Build Command 필드의 **"Override"** 토글을 **켜기** (ON)
4. Build Command 입력: `npx prisma generate && npx next build`
5. 저장
6. 재배포

### 3단계: 변경사항 커밋 및 푸시

Prisma schema가 프로젝트 루트에 있으면:
```bash
git add prisma/schema.prisma package.json vercel.json
git commit -m "fix: ensure Prisma schema and build command"
git push origin main
```

---

## 🔍 확인 사항

### 필수 파일 위치

프로젝트 루트에 다음 파일이 있어야 합니다:
```
프로젝트 루트/
├── prisma/
│   └── schema.prisma  ✅ (필수!)
├── package.json  ✅
├── vercel.json  ✅
└── .github/
    └── prisma/
        └── schema.prisma  (백업, 선택사항)
```

### package.json 확인

```json
{
  "scripts": {
    "build": "npx prisma generate && next build"
  }
}
```

### vercel.json 확인

```json
{
  "buildCommand": "npx prisma generate && npx next build"
}
```

---

## 🆘 가장 확실한 해결 방법

**Vercel Build Settings에서 직접 설정:**
1. Build Command Override 토글 켜기
2. Build Command: `npx prisma generate && npx next build`
3. 저장 후 재배포

이 방법이 가장 확실합니다!

