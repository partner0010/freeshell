# 외부 접속 불가 문제 해결 가이드

## 🔍 문제 진단 단계

### 1단계: Vercel 배포 확인

#### Vercel 대시보드 확인
1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. Freeshell 프로젝트 선택
3. **Deployments** 탭 확인:
   - ✅ **Ready** (초록색) = 정상 배포됨
   - ⚠️ **Building** = 빌드 중
   - ❌ **Error** = 빌드 실패

#### 배포 URL 확인
- Vercel 기본 URL: `https://your-project-name.vercel.app`
- 이 URL로 접속 테스트

### 2단계: DNS 설정 확인

#### 현재 DNS 설정 확인
```bash
# Windows 명령 프롬프트
nslookup your-domain.com
nslookup www.your-domain.com
```

또는 온라인 도구:
- https://dnschecker.org
- https://www.whatsmydns.net

#### Gabia DNS 설정 확인
1. Gabia 홈페이지 로그인
2. 도메인 관리 → DNS 관리
3. 현재 레코드 확인

### 3단계: 도메인 연결 확인

#### Vercel에서 도메인 확인
1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. 도메인이 추가되어 있는지 확인
3. SSL 인증서 상태 확인

## 🛠️ 해결 방법

### 방법 1: Vercel 기본 URL로 접속 확인

먼저 Vercel이 제공하는 기본 URL로 접속이 되는지 확인:
- `https://your-project.vercel.app`

**접속이 되면**: DNS 설정 문제
**접속이 안 되면**: Vercel 배포 문제

### 방법 2: DNS 설정 복구

#### Gabia 기본 네임서버로 복구
1. Gabia 로그인
2. 도메인 관리 → 네임서버 설정
3. **"Gabia 네임서버 사용"** 선택
4. 저장

#### Vercel DNS 설정 (나중에)
DNS가 안정화된 후:
1. Vercel → Settings → Domains
2. 도메인 추가
3. Vercel이 제공하는 DNS 정보 확인
4. Gabia DNS 관리에 레코드 추가

### 방법 3: Vercel 재배포

#### 수동 재배포
1. Vercel 대시보드 → Deployments
2. 최근 배포 → ... (메뉴) → **Redeploy**

#### Git Push로 재배포
```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main
```

### 방법 4: Vercel CLI로 직접 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 프로덕션 배포
vercel --prod
```

## 📋 체크리스트

### 즉시 확인
- [ ] Vercel 대시보드에서 배포 상태 확인
- [ ] Vercel 기본 URL (`*.vercel.app`) 접속 테스트
- [ ] 빌드 로그에서 오류 확인
- [ ] 도메인이 Vercel에 추가되어 있는지 확인

### DNS 확인
- [ ] Gabia DNS 설정 확인
- [ ] 네임서버가 올바른지 확인
- [ ] DNS 레코드가 올바른지 확인
- [ ] DNS 전파 확인 (nslookup)

### 배포 확인
- [ ] 최근 배포가 성공했는지 확인
- [ ] 빌드 로그에 오류가 없는지 확인
- [ ] 환경 변수가 설정되어 있는지 확인

## 🚨 긴급 해결

### 1. Vercel 기본 URL 확인
먼저 `https://your-project.vercel.app`로 접속이 되는지 확인하세요.

### 2. DNS 복구
Gabia에서 "Gabia 네임서버 사용"으로 복구하세요.

### 3. 재배포
Vercel에서 수동으로 재배포하세요.

## 📞 추가 도움

### Vercel 지원
- 문서: https://vercel.com/docs
- 커뮤니티: https://github.com/vercel/vercel/discussions

### Gabia 지원
- 전화: 1588-4253
- 이메일: support@gabia.com

