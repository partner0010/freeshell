# 🤖 자동화 가이드

## 자동화 가능한 부분 ✅

다음은 자동화할 수 있습니다:

### 1. 파일 생성 및 확인
- ✅ `vercel.json` 파일 생성/확인
- ✅ `prisma/schema.prisma` 파일 생성/확인
- ✅ `package.json`의 `build` 스크립트 확인

### 2. Git 작업
- ✅ Git에 커밋 및 푸시

---

## 자동화 스크립트 사용 방법

### 스크립트 실행

```bash
# .github 폴더에서
.\auto-setup-vercel.bat
```

또는 프로젝트 루트에서:

```bash
.github\auto-setup-vercel.bat
```

### 스크립트가 하는 일

1. **프로젝트 루트 확인**
2. **vercel.json 파일 확인/생성**
   - 없으면 생성
   - 있으면 내용 확인
3. **prisma/schema.prisma 파일 확인/생성**
   - 없으면 `.github/prisma/schema.prisma`에서 복사
4. **Git 상태 확인**
   - 변경된 파일이 있으면 커밋 및 푸시 제안

---

## 수동 작업 (필수) ⚠️

### Production Overrides 비우기

**이 작업은 자동화할 수 없습니다.**
Vercel 대시보드에서만 수정 가능합니다.

### 단계별 가이드

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - Freeshell 프로젝트 클릭

2. **Settings → General → Build & Development Settings**

3. **Production Overrides 섹션**
   - Build Command 필드 클릭
   - `Ctrl + A` → `Delete` (모든 텍스트 삭제)
   - 필드가 비어있는지 확인

4. **저장**
   - "Save" 버튼 클릭

5. **재배포**
   - Deployments → 최신 배포 → "..." → "Redeploy"

---

## 완전 자동화는 불가능한 이유

### Vercel의 제한사항

1. **Production Overrides는 UI에서만 수정 가능**
   - Vercel CLI로 수정 불가
   - Vercel API로 수정 불가
   - 보안상의 이유로 제한됨

2. **하지만 한 번만 설정하면 됨**
   - Production Overrides를 비우면
   - 이후로는 `vercel.json`이 자동으로 사용됨
   - 추가 설정 불필요

---

## 권장 워크플로우

### 1단계: 자동화 스크립트 실행

```bash
.github\auto-setup-vercel.bat
```

### 2단계: 수동 작업 (한 번만)

1. Vercel 대시보드 접속
2. Production Overrides의 Build Command 비우기
3. 저장
4. 재배포

### 3단계: 완료!

이후로는:
- ✅ 코드만 작성하고 Git에 푸시
- ✅ Vercel이 자동으로 빌드 및 배포
- ✅ `vercel.json`의 `buildCommand`가 자동으로 사용됨

---

## 결론

**대부분의 작업은 자동화할 수 있지만, Production Overrides를 비우는 작업만 수동으로 해야 합니다.**

**하지만 이 작업은 한 번만 하면 되고, 이후로는 자동으로 작동합니다!** 🚀

---

## 빠른 참조

### 자동화 스크립트 실행
```bash
.github\auto-setup-vercel.bat
```

### 수동 작업 (필수)
1. Vercel 대시보드 → Settings → General → Build & Development Settings
2. Production Overrides → Build Command 비우기
3. 저장 → 재배포

이것만 하면 됩니다! 🎉

