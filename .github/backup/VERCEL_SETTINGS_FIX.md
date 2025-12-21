# 🔧 Vercel Build Settings 직접 수정 가이드

## ❌ 현재 문제

Vercel 대시보드에서 확인된 상황:
- **Production Overrides**: Build Command가 `npm run build`
- **Project Settings**: Build Command가 `npm run build` (Override 토글 꺼짐)
- **경고**: "Configuration Settings in the current Production deployment differ from your current Project Settings."

**문제:**
- `vercel.json`의 `buildCommand`가 적용되지 않았을 수 있음
- Production Overrides가 Project Settings를 덮어쓰고 있을 수 있음

## ✅ 해결 방법: Vercel 대시보드에서 직접 설정

### 1단계: Build Command Override 활성화

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard

2. **프로젝트 선택**
   - Freeshell 프로젝트 클릭

3. **Settings → General → Build & Development Settings**

4. **Framework Settings 섹션**
   - "Build Command" 필드 찾기
   - 오른쪽의 **"Override"** 토글을 **켜기** (ON)

5. **Build Command 입력**
   - 값: `npx prisma generate && npx next build`
   - 또는: `prisma generate && npm run build`

6. **저장**
   - "Save" 버튼 클릭

---

### 2단계: Production Overrides 확인

**경고 메시지가 보이면:**
- Production Overrides 섹션 확인
- Build Command가 올바른지 확인
- 필요하면 Production Overrides도 수정

---

### 3단계: 재배포

1. **Deployments 탭**
   - 왼쪽 메뉴에서 "Deployments" 클릭

2. **최신 배포 선택**
   - 가장 위에 있는 배포 선택

3. **Redeploy 실행**
   - 배포 카드 오른쪽 상단의 **"..."** (점 3개) 메뉴 클릭
   - **"Redeploy"** 선택
   - 확인

---

## 📋 설정 값

### Build Command (권장)
```
npx prisma generate && npx next build
```

또는:
```
prisma generate && npm run build
```

### Install Command (기본값 유지)
```
npm install
```

---

## ✅ 예상 결과

Build Command를 직접 설정하면:
- ✅ Vercel이 `prisma generate`를 먼저 실행
- ✅ 그 다음 `next build` 실행
- ✅ Prisma Client가 빌드 시점에 정상 생성
- ✅ 빌드 성공
- ✅ 배포 성공

---

## 🔍 확인 사항

설정 후 다음을 확인하세요:

1. **Build Command Override 토글이 켜져 있는지**
2. **Build Command 값이 올바른지**
3. **저장이 완료되었는지**
4. **재배포가 시작되었는지**

---

## 💡 참고

- `vercel.json`의 `buildCommand`보다 Vercel 대시보드의 설정이 우선될 수 있습니다
- Production Overrides가 있으면 그것이 최우선 적용됩니다
- Project Settings의 Override 토글을 켜면 해당 설정이 적용됩니다

---

## 🆘 문제가 계속되면

1. **Build Logs 확인**
   - Deployments → 최신 배포 → Build Logs
   - `prisma generate`가 실행되는지 확인

2. **환경 변수 확인**
   - Settings → Environment Variables
   - `DATABASE_URL` 등 필요한 변수 확인

3. **Prisma Schema 확인**
   - GitHub에서 `prisma/schema.prisma` 파일이 있는지 확인
   - 프로젝트 루트에 있어야 함

