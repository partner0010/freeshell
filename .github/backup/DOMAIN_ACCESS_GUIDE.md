# 도메인 접속 가능 시간 가이드

## 🚀 Vercel 기본 도메인 (.vercel.app)

### 접속 가능 시간
- **배포 완료 후 즉시 접속 가능** (보통 1-2분)
- 전 세계 어디서나 접속 가능
- DNS 전파 불필요

### 확인 방법
1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. 프로젝트 클릭
3. **Deployments** 탭에서 최근 배포 확인
4. 배포 URL 확인 (예: `https://freeshell-xxxxx.vercel.app`)
5. URL 클릭하여 접속 테스트

### 배포 상태
- ✅ **Ready** (초록색) = 접속 가능
- 🟡 **Building** = 빌드 중 (1-2분 소요)
- ❌ **Error** = 빌드 실패 (로그 확인 필요)

---

## 🌐 커스텀 도메인 (예: yourdomain.com)

### 접속 가능 시간
- **DNS 설정 후 24-48시간 소요**
- 지역별로 전파 시간 다름
- 대부분의 경우 2-4시간 내 완료

### DNS 전파 시간
| 상황 | 전파 시간 |
|------|----------|
| 최소 | 몇 분 |
| 평균 | 1-2시간 |
| 최대 | 48시간 |
| 대부분 | 2-4시간 |

### 전파 시간이 오래 걸리는 경우
1. **TTL 설정이 높은 경우** (예: 86400초 = 24시간)
2. **DNS 캐시가 오래 유지되는 경우**
3. **네임서버 변경 시** (최대 48시간)

---

## ✅ 즉시 확인 방법

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

### 3. 배포 상태 확인 스크립트 실행

```bash
.github\check-deployment-status.bat
```

이 스크립트는 다음을 확인합니다:
- Git 최신 커밋
- Vercel 배포 목록
- 도메인 접속 테스트

---

## 🔧 문제 해결

### Vercel 기본 URL이 안 되는 경우

1. **빌드 로그 확인**
   - Vercel 대시보드 → Deployments → 최근 배포 → Build Logs
   - 오류 메시지 확인

2. **환경 변수 확인**
   - Settings → Environment Variables
   - 필수 변수 설정 확인

3. **빌드 설정 확인**
   - Settings → General → Build & Development Settings

### 커스텀 도메인이 안 되는 경우

1. **DNS 설정 확인**
   - Gabia → 도메인 관리 → DNS 관리
   - 레코드 확인:
     - A 레코드: `@` → Vercel IP
     - CNAME 레코드: `www` → `cname.vercel-dns.com`

2. **Vercel 도메인 설정 확인**
   - Vercel 대시보드 → Settings → Domains
   - 도메인 추가 및 확인

3. **DNS 전파 대기**
   - 24-48시간 대기
   - 온라인 도구로 전파 상태 확인

---

## 📊 현재 상태 확인

### 배포 상태 확인
```bash
.github\check-deployment-status.bat
```

### 도메인 접속 테스트
```bash
.github\check-domain-access.bat
```

### Vercel CLI로 확인
```bash
vercel ls
vercel inspect [배포URL]
```

---

## ⏰ 예상 시간표

### 시나리오 1: Vercel 기본 도메인
- 배포 시작: 0분
- 빌드 완료: 1-2분
- 접속 가능: **즉시** ✅

### 시나리오 2: 커스텀 도메인 (새로 설정)
- DNS 설정: 0분
- 전파 시작: 즉시
- 일부 지역 접속 가능: 30분-2시간
- 대부분 지역 접속 가능: 2-4시간
- 전 세계 전파 완료: **24-48시간** ⏳

### 시나리오 3: 기존 도메인 변경
- DNS 변경: 0분
- 전파 시작: 즉시
- 완료: **1-2시간** (TTL에 따라 다름)

---

## 💡 팁

1. **항상 Vercel 기본 URL부터 확인**
   - 커스텀 도메인 문제인지 배포 문제인지 구분 가능

2. **DNS 전파는 기다리는 수밖에 없음**
   - 급한 경우 Vercel 기본 URL 사용

3. **전파 상태는 온라인 도구로 확인**
   - https://dnschecker.org 에서 실시간 확인

4. **배포 후 즉시 확인**
   - Vercel 대시보드에서 배포 상태 확인
   - 배포 URL로 접속 테스트

---

## ✅ 체크리스트

- [ ] Vercel 대시보드에서 배포 상태 확인 (Ready인지 확인)
- [ ] Vercel 기본 URL로 접속 테스트
- [ ] 커스텀 도메인 설정 확인 (Vercel + DNS)
- [ ] DNS 전파 상태 확인 (온라인 도구 사용)
- [ ] 빌드 로그 확인 (오류가 있는지)
- [ ] 환경 변수 확인 (필수 변수 설정)

---

**현재 배포 상태를 확인하려면:**
```bash
.github\check-deployment-status.bat
```

