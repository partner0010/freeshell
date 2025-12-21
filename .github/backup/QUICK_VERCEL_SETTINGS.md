# ⚡ 빠른 Vercel Build Settings 수정

## 🎯 목표

Vercel 대시보드에서 Build Command를 직접 설정하여 Prisma Client 생성 보장

## 📋 단계별 가이드

### 1. Vercel 대시보드 접속
```
https://vercel.com/dashboard
```

### 2. 프로젝트 선택
- Freeshell 프로젝트 클릭

### 3. Settings → General
- 왼쪽 메뉴에서 "General" 클릭
- 또는 "Build and Deployment" 클릭

### 4. Build Command 설정
- **Framework Settings** 섹션 찾기
- **Build Command** 필드 찾기
- 오른쪽의 **"Override"** 토글을 **켜기** (ON)
- Build Command 값 입력:
  ```
  npx prisma generate && npx next build
  ```
- **"Save"** 버튼 클릭

### 5. 재배포
- **Deployments** 탭 클릭
- 최신 배포의 **"..."** → **"Redeploy"**

---

## ✅ 완료!

이제 Vercel이 빌드할 때:
1. `npx prisma generate` 실행 (Prisma Client 생성)
2. `npx next build` 실행 (Next.js 빌드)
3. 빌드 성공! 🎉

---

## 🔍 확인

재배포 후:
- Build Logs에서 `prisma generate` 실행 확인
- 빌드 상태가 "Ready" (초록색)인지 확인

