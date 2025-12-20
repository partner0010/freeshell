# Ready Stale 상태 해결 가이드

## 🔴 현재 상황

- **배포 상태**: "Ready Stale" (초록색)
- **의미**: 배포는 완료되었지만 오래된 배포입니다
- **Forbidden 오류**: 접속 시 403 오류 발생 가능

## ✅ 해결 방법

### 1단계: 확인된 URL로 접속 시도

Vercel 대시보드에서 확인한 URL들:

1. **Git 배포 URL:**
   ```
   https://freeshell-git-main-partner0010s-projects.vercel.app
   ```

2. **배포 ID URL:**
   ```
   https://freeshell-1jqhpcnho-partner0010s-projects.vercel.app
   ```

3. **커스텀 도메인:**
   ```
   https://freeshell.co.kr
   ```

**브라우저에서 직접 접속해 보세요!**

### 2단계: Ready Stale 상태 해결

"Ready Stale"은 최신 배포가 아니라는 의미입니다. 해결 방법:

#### 방법 1: 최신 배포로 전환

1. Vercel 대시보드 → **Deployments** 탭
2. 최신 배포 찾기 (가장 위에 있는 배포)
3. **"..."** 메뉴 클릭
4. **"Promote to Production"** 선택

#### 방법 2: 새 배포 생성

```bash
git commit --allow-empty -m "trigger new deployment"
git push origin main
```

### 3단계: Forbidden 오류 해결

403 Forbidden 오류가 발생하는 경우:

1. **Vercel 프로젝트 설정 확인:**
   - Settings → General
   - Framework Preset: Next.js 확인

2. **도메인 설정 확인:**
   - Settings → Domains
   - 도메인이 올바르게 추가되어 있는지 확인

3. **배포 재시도:**
   - Vercel 대시보드에서 **Redeploy** 클릭

### 4단계: 브라우저에서 직접 접속

1. 브라우저 주소창에 URL 입력:
   ```
   https://freeshell-git-main-partner0010s-projects.vercel.app
   ```
2. Enter 키 누르기
3. 접속 확인

## 🚀 빠른 해결책

### 즉시 시도할 것:

1. **브라우저에서 직접 접속:**
   - `https://freeshell-git-main-partner0010s-projects.vercel.app`
   - `https://freeshell-1jqhpcnho-partner0010s-projects.vercel.app`

2. **최신 배포 확인:**
   - Vercel 대시보드 → Deployments
   - 가장 최근 배포가 "Ready" 상태인지 확인

3. **최신 배포로 전환:**
   - 최신 배포의 **"..."** 메뉴 → **"Promote to Production"**

## 📝 확인 체크리스트

- [ ] 확인된 URL로 브라우저에서 직접 접속 시도
- [ ] Vercel 대시보드에서 최신 배포 확인
- [ ] 최신 배포가 "Ready" 상태인지 확인
- [ ] 필요시 최신 배포를 Production으로 전환
- [ ] 브라우저 캐시 삭제 후 재시도

## 💡 중요 사항

1. **"Ready Stale"은 오래된 배포입니다**
   - 최신 배포를 Production으로 전환해야 합니다

2. **Forbidden 오류는 보통:**
   - 오래된 배포를 사용하고 있거나
   - 잘못된 URL을 사용하고 있을 수 있습니다

3. **정확한 URL 사용:**
   - Vercel 대시보드에서 확인한 정확한 URL 사용

## 🔧 추가 확인

프로젝트 루트에서 실행:
```bash
.github\test-vercel-urls.bat
```

이 스크립트가 모든 URL을 테스트합니다.

