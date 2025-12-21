# 🚀 Vercel 재배포 방법

## ✅ 현재 상태

Vercel Build Settings에서 Build Command가 올바르게 설정되었습니다:
- Build Command: `npx prisma generate && npx next build`
- Override 토글이 켜져 있음 (ON)

이제 재배포만 하면 됩니다!

---

## 방법 1: Vercel 대시보드에서 직접 재배포 (가장 빠름) ⭐

### 단계별 가이드

1. **Deployments 탭으로 이동**
   - 현재 Settings 페이지에서
   - 상단 네비게이션 바의 **"Deployments"** 탭 클릭
   - 또는 왼쪽 사이드바에서 "Deployments" 클릭

2. **최신 배포 선택**
   - 가장 위에 있는 배포 카드 클릭
   - 또는 배포 목록에서 최신 배포 선택

3. **Redeploy 실행**
   - 배포 카드 오른쪽 상단의 **"..."** (점 3개) 메뉴 클릭
   - 드롭다운 메뉴에서 **"Redeploy"** 선택
   - 확인 대화상자에서 **"Redeploy"** 버튼 클릭

4. **배포 완료 대기**
   - 약 1-2분 소요
   - 배포 상태가 "Building" → "Ready" (초록색)로 변경되는지 확인

---

## 방법 2: GitHub에 커밋 푸시 (자동 재배포)

### 단계별 가이드

1. **변경사항 커밋**
   ```bash
   git add prisma/schema.prisma package.json vercel.json
   git commit -m "fix: add Prisma schema and build command"
   ```

2. **GitHub에 푸시**
   ```bash
   git push origin main
   ```

3. **자동 재배포 확인**
   - Vercel이 GitHub 푸시를 감지하여 자동으로 재배포 시작
   - Deployments 탭에서 새 배포 확인

---

## 방법 3: 자동 스크립트 실행

프로젝트 루트에서:
```bash
.github\commit-and-push-fix.bat
```

이 스크립트가 자동으로:
1. 변경사항 커밋
2. GitHub에 푸시
3. Vercel 자동 재배포 트리거

---

## 📋 재배포 후 확인 사항

### 1. Build Logs 확인

1. **Deployments 탭**
   - 최신 배포 클릭

2. **Build Logs 탭**
   - 빌드 로그 확인
   - `npx prisma generate`가 실행되는지 확인
   - 오류가 없는지 확인

### 2. 배포 상태 확인

- 배포 상태가 **"Ready"** (초록색)인지 확인
- 배포 URL로 접속 테스트

---

## ✅ 예상 결과

재배포 후:
- ✅ `npx prisma generate`가 빌드 로그에 표시됨
- ✅ Prisma Client가 정상 생성됨
- ✅ 빌드 성공
- ✅ 배포 성공
- ✅ 사이트 정상 작동

---

## 🆘 문제가 발생하면

### Build Logs 확인

1. Deployments → 최신 배포 → Build Logs
2. 오류 메시지 확인
3. `npx prisma generate`가 실행되었는지 확인

### 재시도

- 문제가 있으면 다시 "Redeploy" 실행
- 또는 GitHub에 새로운 커밋 푸시

---

## 💡 팁

**가장 빠른 방법**: Vercel 대시보드에서 직접 "Redeploy" 버튼 클릭

1. Deployments 탭
2. 최신 배포의 "..." → "Redeploy"
3. 완료!

