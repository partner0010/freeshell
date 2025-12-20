# DNS 전파 상태 확인 및 외부 접속 문제 해결

## 🔍 DNS 전파 시간

### 일반적인 전파 시간
- **최소**: 몇 분
- **평균**: 1-2시간
- **최대**: 48시간
- **대부분의 경우**: 2-4시간 내 완료

### 전파 시간이 오래 걸리는 경우
1. **TTL 설정이 높은 경우** (예: 86400초 = 24시간)
2. **DNS 캐시가 오래 유지되는 경우**
3. **네임서버 변경 시** (최대 48시간)

## ✅ 즉시 확인할 사항

### 1. Vercel 기본 URL 확인 (가장 중요!)

**먼저 이것부터 확인하세요:**

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. Freeshell 프로젝트 클릭
3. **Settings → Domains** 또는 상단의 배포 URL 확인
4. 예: `https://freeshell-xxxxx.vercel.app`

**이 URL로 접속 테스트:**
- ✅ **접속되면** → DNS 설정 문제 (도메인 연결 문제)
- ❌ **안 되면** → Vercel 배포 문제 (빌드 실패 등)

### 2. DNS 전파 확인

#### 온라인 도구로 확인
- https://dnschecker.org
- https://www.whatsmydns.net

**확인 방법:**
1. 도메인 입력
2. 레코드 타입 선택 (A 또는 CNAME)
3. 전 세계 서버에서 확인
4. 모든 서버에서 동일한 값이 나오면 전파 완료

#### Windows 명령어로 확인
```bash
nslookup your-domain.com
nslookup www.your-domain.com
```

### 3. Gabia DNS 설정 확인

1. Gabia 로그인
2. 도메인 관리 → DNS 관리
3. 현재 레코드 확인:
   - A 레코드 또는 CNAME 레코드가 올바른지
   - TTL 값 확인

## 🛠️ 해결 방법

### 상황 A: Vercel 기본 URL도 안 됨

**원인**: Vercel 배포 실패 또는 미배포

**해결**:
1. Vercel 대시보드 → Deployments 확인
2. 빌드 로그 확인
3. `force-redeploy.bat` 실행하여 재배포

### 상황 B: Vercel 기본 URL은 되는데 도메인은 안 됨

**원인**: DNS 설정 문제 또는 전파 미완료

**해결**:
1. **DNS 전파 확인** (dnschecker.org)
2. **Gabia DNS 설정 확인**
3. **TTL 값 확인** (낮으면 전파가 빨라짐)
4. **기다리기** (최대 48시간)

### 상황 C: 48시간이 지났는데도 안 됨

**가능한 원인**:
1. DNS 설정 오류
2. 네임서버 설정 오류
3. 도메인이 Vercel에 제대로 연결되지 않음

**해결**:
1. Gabia → 네임서버 설정 → "Gabia 네임서버 사용"으로 복구
2. Vercel → Settings → Domains → 도메인 재추가
3. Gabia DNS 레코드 재설정

## 📋 체크리스트

### 즉시 확인
- [ ] Vercel 기본 URL (`*.vercel.app`) 접속 테스트
- [ ] Vercel 배포 상태 확인 (Ready/Building/Error)
- [ ] DNS 전파 확인 (dnschecker.org)
- [ ] Gabia DNS 설정 확인

### DNS 설정 확인
- [ ] 네임서버가 올바른지 확인
- [ ] A 레코드 또는 CNAME 레코드 확인
- [ ] TTL 값 확인
- [ ] 전 세계 서버에서 동일한 값 확인

## 💡 빠른 해결

### 1. Vercel 기본 URL 확인
가장 먼저 이것을 확인하세요. 이것이 안 되면 DNS 문제가 아닙니다.

### 2. DNS 전파 확인
dnschecker.org에서 전 세계 서버 확인

### 3. 48시간 대기
DNS 전파는 최대 48시간이 걸릴 수 있습니다.

## 🆘 여전히 안 되면

1. **Gabia 고객지원 문의**
   - 전화: 1588-4253
   - 이메일: support@gabia.com

2. **Vercel 지원**
   - 문서: https://vercel.com/docs
   - 커뮤니티: https://github.com/vercel/vercel/discussions

3. **DNS 설정 초기화**
   - Gabia 기본 네임서버로 복구
   - DNS 레코드 초기화
   - 나중에 Vercel DNS 설정 재적용

