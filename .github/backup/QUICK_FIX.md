# 🚀 빠른 해결 방법

## 스크립트 실행 방법

### 방법 1: 더블클릭으로 실행 (권장)

1. **파일 탐색기**에서 `.github` 폴더 열기
2. **`auto-setup-vercel.bat`** 파일 더블클릭
3. 스크립트가 실행됩니다

### 방법 2: 명령 프롬프트에서 실행

1. **명령 프롬프트 (cmd)** 열기
2. 프로젝트 루트로 이동:
   ```cmd
   cd "C:\Users\partn\OneDrive\바탕 화면\Cursor\Freeshell"
   ```
3. 스크립트 실행:
   ```cmd
   .github\auto-setup-vercel.bat
   ```

### 방법 3: PowerShell에서 실행

PowerShell에서는 다음과 같이 실행:

```powershell
cmd /c .github\auto-setup-vercel.bat
```

또는:

```powershell
& .github\run-auto-setup.bat
```

---

## 스크립트가 하는 일

1. ✅ `vercel.json` 파일 확인/생성
2. ✅ `prisma/schema.prisma` 파일 확인/생성
3. ✅ Git 상태 확인 및 커밋/푸시 제안
4. ✅ Production Overrides 비우기 안내

---

## ⚠️ 수동 작업 (필수)

스크립트 실행 후, **Production Overrides를 비우는 작업**은 수동으로 해야 합니다:

### 단계별 가이드

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - Freeshell 프로젝트 클릭

2. **Settings → General → Build & Development Settings**

3. **Production Overrides 섹션**
   - "Production Overrides" 섹션 찾기
   - **Build Command** 필드 클릭
   - `Ctrl + A` (전체 선택)
   - `Delete` 또는 `Backspace` (모든 텍스트 삭제)
   - 필드가 완전히 비어있는지 확인

4. **저장**
   - "Save" 버튼 클릭

5. **재배포**
   - Deployments → 최신 배포 → "..." → "Redeploy"

---

## ✅ 완료 확인

재배포 후 Build Logs에서:
- ✅ 성공: `Running "npx prisma generate && npx next build"`
- ❌ 실패: `Running "npm run build"` (여전히 Production Overrides가 설정된 것)

---

## 💡 팁

**스크립트가 바로 꺼지는 경우:**

1. **명령 프롬프트 (cmd)에서 실행**해보세요
2. **파일 탐색기에서 더블클릭**으로 실행해보세요
3. **오류 메시지를 확인**하세요

---

## 🚀 다음 단계

1. **스크립트 실행** (위 방법 중 하나 선택)
2. **Production Overrides 비우기** (수동 작업)
3. **재배포**

이렇게 하면 빌드가 성공할 것입니다! 🎉

