# DNS 전파 확인 및 외부 접속 문제 해결

## 🔍 DNS 전파 시간

DNS 변경 후 전파 시간은 일반적으로:
- **최소**: 5분 ~ 1시간
- **일반**: 1시간 ~ 24시간
- **최대**: 48시간 (72시간까지 가능)

하지만 **48시간이 지났다면 다른 문제일 수 있습니다.**

## ✅ 즉시 확인할 사항

### 1. Vercel 기본 URL 확인 (가장 중요!)

**먼저 이것부터 확인하세요:**

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. Freeshell 프로젝트 클릭
3. **Settings → Domains** 또는 **Deployments**에서
4. Vercel이 제공하는 기본 URL 확인 (예: `freeshell-xxxxx.vercel.app`)

**이 URL로 접속 테스트:**
- ✅ **접속되면** → DNS 설정 문제 (도메인 연결 문제)
- ❌ **안 되면** → Vercel 배포 문제 (빌드 실패 등)

### 2. DNS 설정 확인

#### 온라인 도구로 확인
- https://dnschecker.org
- https://www.whatsmydns.net
- https://mxtoolbox.com/DNSLookup.aspx

#### Windows 명령어로 확인
```cmd
nslookup your-domain.com
nslookup www.your-domain.com
```

### 3. Gabia DNS 설정 확인

1. Gabia 로그인
2. 도메인 관리 → DNS 관리
3. 현재 레코드 확인:
   - A 레코드: `@` → Vercel IP 주소
   - CNAME 레코드: `www` → `cname.vercel-dns.com`

## 🛠️ 해결 방법

### 방법 1: Vercel 기본 URL로 접속 확인

**가장 먼저 해야 할 일:**

1. Vercel 대시보드에서 기본 URL 확인
2. 그 URL로 직접 접속 테스트
3. 접속이 안 되면 → Vercel 재배포 필요
4. 접속이 되면 → DNS 설정 문제

### 방법 2: DNS 설정 복구

#### Gabia에서 확인
1. Gabia 로그인
2. 도메인 관리 → 네임서버 설정
3. 현재 설정 확인:
   - Gabia 네임서버 사용 중인지
   - 또는 다른 네임서버 사용 중인지

#### Vercel DNS 설정 적용 (올바른 방법)

1. **Vercel에서 도메인 추가:**
   - Vercel 대시보드 → 프로젝트 → Settings → Domains
   - 도메인 추가 (예: `your-domain.com`, `www.your-domain.com`)

2. **Vercel이 제공하는 DNS 정보 확인:**
   - A 레코드: `@` → `76.76.21.21` (Vercel IP)
   - CNAME 레코드: `www` → `cname.vercel-dns.com`

3. **Gabia에서 DNS 레코드 설정:**
   - Gabia → 도메인 관리 → DNS 관리
   - A 레코드 추가: `@` → `76.76.21.21`
   - CNAME 레코드 추가: `www` → `cname.vercel-dns.com`

4. **DNS 전파 대기:**
   - 1-24시간 소요
   - 온라인 도구로 확인 가능

### 방법 3: Vercel 재배포

#### 수동 재배포
1. Vercel 대시보드 → Deployments
2. 최근 배포 → ... (메뉴) → **Redeploy**

#### Git Push로 재배포
```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main
```

또는 `force-redeploy.bat` 실행

## 📋 체크리스트

### 즉시 확인
- [ ] Vercel 기본 URL (`*.vercel.app`) 접속 테스트
- [ ] Vercel 대시보드에서 배포 상태 확인 (Ready/Building/Error)
- [ ] 빌드 로그에서 오류 확인
- [ ] 도메인이 Vercel에 추가되어 있는지 확인

### DNS 확인
- [ ] Gabia DNS 설정 확인
- [ ] 네임서버가 올바른지 확인
- [ ] DNS 레코드가 올바른지 확인
- [ ] DNS 전파 확인 (온라인 도구 사용)

### 배포 확인
- [ ] 최근 배포가 성공했는지 확인
- [ ] 빌드 로그에 오류가 없는지 확인
- [ ] 환경 변수가 설정되어 있는지 확인

## 🚨 48시간이 지났다면?

**48시간이 지났는데도 접속이 안 되면:**

1. **Vercel 기본 URL 확인** (가장 중요!)
   - 접속이 안 되면 → Vercel 배포 문제
   - 접속이 되면 → DNS 설정 문제

2. **DNS 설정 재확인**
   - Gabia에서 DNS 레코드 확인
   - Vercel에서 제공하는 DNS 정보와 일치하는지 확인

3. **Vercel 도메인 설정 확인**
   - Settings → Domains에서 도메인이 추가되어 있는지
   - SSL 인증서 상태 확인

4. **Gabia 고객지원 문의**
   - 전화: 1588-4253
   - 이메일: support@gabia.com

## 💡 추가 정보

### DNS 전파 확인 방법

1. **온라인 도구 사용:**
   - https://dnschecker.org
   - 도메인 입력 → 전 세계 DNS 서버 확인

2. **명령어 사용:**
   ```cmd
   nslookup your-domain.com
   nslookup www.your-domain.com
   ```

3. **브라우저 캐시 삭제:**
   - Chrome: Ctrl+Shift+Delete
   - DNS 캐시도 삭제: `ipconfig /flushdns` (Windows)

### Vercel 도메인 설정 확인

1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. 도메인이 추가되어 있는지 확인
3. SSL 인증서 상태 확인 (보통 자동 발급)
4. Primary Domain 설정 확인

## 📞 도움 요청 시 제공할 정보

다음 정보를 알려주시면 더 정확히 도와드릴 수 있습니다:

1. Vercel 기본 URL (`*.vercel.app`)로 접속이 되나요?
2. Vercel 대시보드에서 배포 상태는 무엇인가요?
3. Gabia에서 DNS 설정은 어떻게 되어 있나요?
4. DNS 전파 확인 도구에서 결과는 어떻게 나오나요?
5. 어떤 오류 메시지가 보이나요?

