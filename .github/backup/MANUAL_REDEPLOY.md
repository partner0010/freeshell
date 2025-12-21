# 🔄 수동 재배포 가이드

## 재배포가 안 될 때 해결 방법

### 방법 1: Vercel 대시보드에서 직접 재배포 (가장 빠름) ⭐

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard

2. **프로젝트 선택**
   - Freeshell 프로젝트 클릭

3. **Deployments 탭**
   - 상단의 "Deployments" 탭 클릭

4. **최신 배포 찾기**
   - 가장 위에 있는 배포 선택

5. **Redeploy 실행**
   - 배포 카드 오른쪽 상단의 **"..."** (점 3개) 메뉴 클릭
   - **"Redeploy"** 선택
   - 확인

6. **배포 완료 대기**
   - 약 1-2분 소요
   - 상태가 "Ready"가 되면 완료

---

### 방법 2: Git 경로 문제 해결 후 푸시

프로젝트 루트에서 실행:

```bash
# Git 경로 문제 해결
git config --global --add safe.directory "C:/Users/partn/OneDrive/바탕 화면/Cursor/Freeshell"

# 변경사항 확인
git status

# 변경사항 추가
git add .

# 커밋 (변경사항이 없으면 빈 커밋)
git commit -m "chore: trigger redeploy" || git commit --allow-empty -m "chore: force redeploy"

# 푸시
git push origin main
```

---

### 방법 3: 강제 재배포 스크립트 실행

프로젝트 루트에서 실행:

```bash
.github\force-redeploy.bat
```

이 스크립트가 자동으로:
- Git 경로 문제 해결
- 변경사항 커밋
- GitHub에 푸시
- Vercel 자동 배포 트리거

---

### 방법 4: Vercel CLI 사용 (선택사항)

```bash
# Vercel CLI 설치 (처음 한 번만)
npm i -g vercel

# 프로젝트 루트에서 배포
vercel --prod
```

---

## 🚨 문제 해결

### Git 푸시가 안 될 때

**오류**: `fatal: detected dubious ownership`

**해결**:
```bash
git config --global --add safe.directory "C:/Users/partn/OneDrive/바탕 화면/Cursor/Freeshell"
```

### 변경사항이 없어서 커밋이 안 될 때

**해결**: 빈 커밋으로 재배포 트리거
```bash
git commit --allow-empty -m "chore: force redeploy"
git push origin main
```

### Vercel에서 배포가 안 될 때

1. Vercel 대시보드에서 **Settings** → **Git** 확인
2. GitHub 연결 상태 확인
3. 필요시 **Redeploy** 버튼으로 수동 재배포

---

## ✅ 권장 방법

**가장 빠르고 확실한 방법**: **방법 1 (Vercel 대시보드에서 직접 재배포)**

1. Vercel 대시보드 접속
2. 프로젝트 → Deployments
3. 최신 배포의 "..." → "Redeploy"

이 방법이 가장 빠르고 확실합니다! 🚀

