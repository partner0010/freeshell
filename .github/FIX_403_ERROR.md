# 403 Forbidden 오류 해결 가이드

## 🔴 현재 문제

- **Vercel 기본 URL**: 403 Forbidden 오류
- **커스텀 도메인**: 타임아웃 오류

## ✅ 해결 방법

### 1단계: Vercel 대시보드에서 배포 상태 확인

1. https://vercel.com/dashboard 접속
2. Freeshell 프로젝트 클릭
3. **Deployments** 탭 확인
4. 최근 배포 상태 확인:
   - ✅ **Ready** (초록색) = 정상
   - 🟡 **Building** = 빌드 중
   - ❌ **Error** = 빌드 실패

### 2단계: 배포 URL 확인

Vercel 대시보드에서:
1. 최근 배포 클릭
2. **Domains** 섹션 확인
3. 실제 배포 URL 확인 (예: `https://freeshell-xxxxx.vercel.app`)

**중요**: `freeshell.vercel.app`이 아닐 수 있습니다. 정확한 URL을 확인하세요.

### 3단계: Vercel 프로젝트 설정 확인

1. Vercel 대시보드 → **Settings**
2. **General** 탭 확인:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
3. **Domains** 탭 확인:
   - 도메인이 올바르게 추가되어 있는지 확인

### 4단계: 배포 재시도

배포 상태가 Error인 경우:
1. Vercel 대시보드에서 **Redeploy** 클릭
2. 또는 GitHub에서 빈 커밋 푸시:
   ```bash
   git commit --allow-empty -m "trigger redeploy"
   git push origin main
   ```

### 5단계: Vercel 프로젝트 이름 확인

프로젝트 이름이 `freeshell`이 아닐 수 있습니다:
1. Vercel 대시보드 → **Settings** → **General**
2. 프로젝트 이름 확인
3. 실제 URL은 `https://[프로젝트이름].vercel.app` 형식입니다

## 🔧 추가 확인 사항

### Vercel 인증 문제

1. Vercel에 로그인되어 있는지 확인
2. 프로젝트에 접근 권한이 있는지 확인
3. 팀/조직 설정 확인

### 도메인 설정 문제

1. **Settings** → **Domains** 확인
2. 도메인이 올바르게 추가되어 있는지 확인
3. DNS 설정 확인 (Gabia에서)

## 🚀 빠른 해결책

1. **Vercel 대시보드에서 정확한 배포 URL 확인**
2. **그 URL로 직접 접속 시도**
3. **접속이 안 되면 배포를 재시도**

## 📝 확인 체크리스트

- [ ] Vercel 대시보드에서 배포 상태 확인 (Ready인지)
- [ ] 정확한 배포 URL 확인
- [ ] 그 URL로 직접 접속 시도
- [ ] Vercel 프로젝트 설정 확인
- [ ] 필요시 배포 재시도

## 💡 중요

403 오류는 보통:
- 배포가 아직 완료되지 않았거나
- 잘못된 URL을 사용하거나
- Vercel 프로젝트 설정 문제일 수 있습니다.

**먼저 Vercel 대시보드에서 정확한 배포 URL을 확인하세요!**

