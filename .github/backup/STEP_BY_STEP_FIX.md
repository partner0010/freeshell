# 📋 단계별 해결 가이드

## 🎯 목표

Vercel 빌드에서 `npx prisma generate`가 실행되도록 설정

## ✅ 단계별 해결 방법

### 1단계: Prisma Schema 확인

프로젝트 루트에 `prisma/schema.prisma` 파일이 있어야 합니다.

**확인:**
```bash
# 프로젝트 루트에서
dir prisma\schema.prisma
```

**없으면:**
- `.github/prisma/schema.prisma`를 `prisma/schema.prisma`로 복사
- Git에 커밋 및 푸시

---

### 2단계: 변경사항 커밋 및 푸시

```bash
git add prisma/schema.prisma package.json vercel.json
git commit -m "fix: add Prisma schema and build command"
git push origin main
```

---

### 3단계: Vercel Build Settings 수정 (가장 중요!)

#### 옵션 A: Production Overrides 수정 (권장)

1. **Vercel 대시보드**
   - https://vercel.com/dashboard
   - Freeshell 프로젝트 클릭
   - Settings → General → Build & Development Settings

2. **Production Overrides 섹션 찾기**
   - 페이지를 아래로 스크롤
   - "Production Overrides" 섹션 찾기
   - 접혀있으면 펼치기

3. **Build Command 수정**
   - Build Command 필드 찾기
   - 현재 값: `npm run build`
   - **새 값으로 변경**: `npx prisma generate && npx next build`
   - 정확히 이 값으로 입력 (공백 포함)

4. **저장**
   - 페이지 하단의 **"Save"** 버튼 클릭
   - 저장 완료 메시지 확인

5. **값 확인**
   - 저장 후 Build Command 값이 올바르게 저장되었는지 다시 확인

#### 옵션 B: Production Overrides 제거

1. Production Overrides 섹션의 모든 필드를 비움
   - Build Command: (비워둠)
   - Install Command: (비워둠)
   - Development Command: (비워둠)
2. 저장
3. Project Settings만 사용하도록 설정

---

### 4단계: 재배포

1. **Deployments 탭**
   - 왼쪽 메뉴에서 "Deployments" 클릭

2. **최신 배포 선택**
   - 가장 위에 있는 배포 카드 클릭

3. **Redeploy 실행**
   - 배포 카드 오른쪽 상단의 **"..."** (점 3개) 메뉴 클릭
   - **"Redeploy"** 선택
   - 확인

---

### 5단계: Build Logs 확인

1. **Build Logs 탭**
   - 배포 페이지에서 "Build Logs" 탭 클릭

2. **확인 사항**
   - `npx prisma generate`가 실행되는지 확인
   - 빌드가 성공하는지 확인

---

## ✅ 예상 결과

이 모든 단계를 완료하면:
- ✅ `npx prisma generate`가 빌드 로그에 표시됨
- ✅ Prisma Client가 정상 생성됨
- ✅ 빌드 성공
- ✅ 배포 성공

---

## 🆘 문제가 계속되면

### Build Logs 확인

재배포 후 Build Logs에서:
- `Running "npx prisma generate && npx next build"`가 보여야 함
- `Running "npm run build"`가 보이면 Production Overrides가 여전히 `npm run build`로 설정된 것

### Production Overrides 다시 확인

1. Settings → General → Build & Development Settings
2. Production Overrides 섹션
3. Build Command 값 확인
4. 올바르게 저장되었는지 확인

---

## 💡 팁

**가장 확실한 방법:**
1. Production Overrides의 Build Command를 `npx prisma generate && npx next build`로 설정
2. 저장
3. 재배포
4. Build Logs에서 `npx prisma generate` 실행 확인

이것이 가장 확실한 해결 방법입니다!

