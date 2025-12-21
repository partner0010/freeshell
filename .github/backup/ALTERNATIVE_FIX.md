# 🔧 Production Overrides 수정 불가 시 대안 방법

## 문제 상황

Production Overrides의 Build Command가 수정 불가능하거나 잠겨있는 경우

## 해결 방법

### 방법 1: Production Overrides 제거 (권장)

Production Overrides를 완전히 제거하면 `vercel.json`의 `buildCommand`가 사용됩니다.

1. **Vercel 대시보드**
   - Settings → General → Build & Development Settings
   - Production Overrides 섹션 찾기

2. **모든 필드 비우기**
   - Build Command: (비워둠)
   - Install Command: (비워둠)
   - Development Command: (비워둠)

3. **저장**
   - Save 버튼 클릭

4. **재배포**
   - Deployments → 최신 배포 → "..." → "Redeploy"

이렇게 하면 `vercel.json`의 `buildCommand`가 사용됩니다:
```json
{
  "buildCommand": "npx prisma generate && npx next build"
}
```

---

### 방법 2: Project Settings에서 Build Command Override 사용

1. **Settings → General → Build & Development Settings**
2. **Project Settings 섹션** 찾기
3. **"Override" 토글** 켜기
4. **Build Command** 설정:
   ```
   npx prisma generate && npx next build
   ```
5. **저장**
6. **재배포**

---

### 방법 3: package.json의 build 스크립트 확인

`package.json`의 `build` 스크립트가 이미 올바르게 설정되어 있는지 확인:

```json
{
  "scripts": {
    "build": "npx prisma generate && next build"
  }
}
```

만약 Production Overrides가 비어있고, `vercel.json`도 없다면, `package.json`의 `build` 스크립트가 사용됩니다.

---

### 방법 4: Vercel CLI 사용 (고급)

터미널에서 Vercel CLI를 사용하여 설정:

```bash
# Vercel CLI 설치 (없는 경우)
npm i -g vercel

# 프로젝트 루트에서
vercel --prod

# 또는 설정 파일 수정
vercel env pull
```

---

## ✅ 권장 순서

1. **먼저 시도**: Production Overrides의 모든 필드를 비우고 저장
2. **그 다음**: `vercel.json`의 `buildCommand` 확인
3. **마지막**: `package.json`의 `build` 스크립트 확인

---

## 🔍 확인 방법

재배포 후 Build Logs에서:
- `Running "npx prisma generate && npx next build"`가 보이면 성공
- `Running "npm run build"`가 보이면 여전히 Production Overrides가 사용 중

---

## 💡 중요 사항

**Production Overrides가 비어있으면:**
- `vercel.json`의 `buildCommand`가 사용됨
- `vercel.json`이 없으면 `package.json`의 `build` 스크립트가 사용됨

**따라서 Production Overrides를 비우는 것만으로도 해결될 수 있습니다!**

