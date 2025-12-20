# 접속 오류 해결 가이드

## 🔴 발견된 오류

1. **401 Unauthorized** - `freeshell-git-main-partner0010s-projects.vercel.app`
   - 권한 문제 또는 비공개 배포

2. **404 Not Found** - `freeshell-1jqhpcnho-partner0010s-projects.vercel.app`
   - 배포를 찾을 수 없음 (오래된 배포 ID)

3. **타임아웃** - `freeshell.co.kr`
   - DNS 전파 미완료

## ✅ 해결 방법

### 1단계: Vercel 대시보드에서 최신 배포 확인

1. https://vercel.com/dashboard 접속
2. Freeshell 프로젝트 클릭
3. **Deployments** 탭 확인
4. **가장 최근 배포** 확인 (가장 위에 있는 배포)
5. 배포 상태 확인:
   - ✅ **Ready** (초록색) = 정상
   - 🟡 **Building** = 빌드 중
   - ❌ **Error** = 빌드 실패

### 2단계: 최신 배포의 URL 확인

최신 배포를 클릭하면:
- **Domains** 섹션에서 실제 URL 확인
- URL 형식: `https://freeshell-xxxxx.vercel.app`

**중요**: 이전 배포 ID는 만료되었을 수 있습니다. 최신 배포의 URL을 사용하세요.

### 3단계: 최신 배포를 Production으로 전환

1. 최신 배포의 **"..."** 메뉴 클릭
2. **"Promote to Production"** 선택
3. 전환 완료 대기

### 4단계: 새 배포 생성 (필요시)

최신 배포가 없거나 Error 상태인 경우:

```bash
git commit --allow-empty -m "trigger fresh deployment"
git push origin main
```

Vercel이 자동으로 새 배포를 생성합니다.

### 5단계: Vercel 프로젝트 설정 확인

1. **Settings** → **General** 확인:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`

2. **Settings** → **Domains** 확인:
   - 도메인이 올바르게 추가되어 있는지 확인

## 🚀 빠른 해결책

### 즉시 시도할 것:

1. **Vercel 대시보드에서 최신 배포 확인**
2. **최신 배포의 정확한 URL 확인**
3. **최신 배포를 Production으로 전환**
4. **브라우저에서 새 URL로 접속 시도**

### 새 배포 생성:

```bash
git commit --allow-empty -m "trigger fresh deployment"
git push origin main
```

## 📝 확인 체크리스트

- [ ] Vercel 대시보드에서 최신 배포 확인
- [ ] 최신 배포 상태가 "Ready"인지 확인
- [ ] 최신 배포의 정확한 URL 확인
- [ ] 최신 배포를 Production으로 전환
- [ ] 브라우저에서 새 URL로 접속 시도
- [ ] 필요시 새 배포 생성

## 💡 중요 사항

1. **401/404 오류는 보통:**
   - 오래된 배포 ID를 사용하거나
   - 배포가 만료되었을 때 발생합니다

2. **최신 배포 사용:**
   - 항상 Vercel 대시보드에서 최신 배포의 URL을 확인하세요

3. **Production 전환:**
   - 최신 배포를 Production으로 전환해야 정상 접속됩니다

## 🔧 추가 확인

Vercel 대시보드에서:
- **Deployments** 탭 → 최신 배포 확인
- 배포 클릭 → **Domains** 섹션에서 URL 확인
- **"..."** 메뉴 → **"Promote to Production"** 선택

