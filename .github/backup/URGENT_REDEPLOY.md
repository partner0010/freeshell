# 🚀 즉시 재배포 방법

## ⚡ 가장 빠른 방법: Vercel 대시보드에서 직접 재배포

### 단계별 가이드

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - 또는 직접 링크: https://vercel.com/dashboard

2. **프로젝트 선택**
   - **Freeshell** 프로젝트 클릭

3. **Deployments 탭**
   - 왼쪽 메뉴에서 **"Deployments"** 클릭

4. **최신 배포 찾기**
   - 가장 위에 있는 배포 선택 (Ready 또는 Error 상태)

5. **Redeploy 실행**
   - 배포 카드 오른쪽 상단의 **"..."** (점 3개) 메뉴 클릭
   - **"Redeploy"** 선택
   - 확인

6. **배포 완료 대기**
   - 약 1-2분 소요
   - 상태가 **"Ready"** (초록색)가 되면 완료

---

## 🔄 또는 Git 푸시로 자동 재배포

### Git 경로 문제 해결 후 푸시

프로젝트 루트에서 실행:

```bash
# 1. Git 경로 설정
git config --global --add safe.directory "C:/Users/partn/OneDrive/바탕 화면/Cursor/Freeshell"

# 2. 변경사항 확인
git status

# 3. 변경사항 추가
git add .

# 4. 커밋 (변경사항이 없으면 빈 커밋)
git commit -m "chore: trigger redeploy"
# 또는
git commit --allow-empty -m "chore: force redeploy"

# 5. 푸시
git push origin main
```

---

## 📋 재배포 스크립트 사용

프로젝트 루트에서 실행:

```bash
.github\quick-redeploy.bat
```

또는

```bash
.github\redeploy.bat
```

---

## ✅ 재배포 후 확인

1. **Vercel 대시보드 확인**
   - Deployments 탭에서 새 배포 확인
   - 상태가 "Ready"인지 확인

2. **사이트 접속 테스트**
   - Vercel 기본 URL로 접속
   - 또는 커스텀 도메인으로 접속

3. **빌드 로그 확인 (Error인 경우)**
   - 배포 클릭 → Build Logs 탭
   - 오류 메시지 확인

---

## 🎯 권장 방법

**가장 빠르고 확실한 방법**: **Vercel 대시보드에서 직접 "Redeploy" 버튼 클릭**

1. https://vercel.com/dashboard
2. Freeshell 프로젝트 → Deployments
3. 최신 배포의 "..." → "Redeploy"

이 방법이 가장 빠르고 확실합니다! 🚀

