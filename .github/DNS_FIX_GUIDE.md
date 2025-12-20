# DNS 설정 복구 및 올바른 설정 가이드

## 🔍 현재 상황 확인

### 1. 현재 DNS 설정 확인

#### Windows에서 확인
```bash
# 명령 프롬프트에서
nslookup your-domain.com
nslookup www.your-domain.com
```

#### 온라인 도구로 확인
- https://dnschecker.org
- https://www.whatsmydns.net

### 2. Gabia DNS 설정 확인

1. Gabia 홈페이지 로그인
2. 도메인 관리 → DNS 관리
3. 현재 설정된 레코드 확인

## 🔧 DNS 설정 복구 방법

### 방법 1: Gabia 기본 네임서버로 복구

#### Gabia 기본 네임서버
```
ns1.gabia.co.kr
ns2.gabia.co.kr
```

#### 설정 방법
1. Gabia 로그인
2. 도메인 관리 → 네임서버 설정
3. "Gabia 네임서버 사용" 선택
4. 저장

### 방법 2: Vercel DNS 설정 (올바른 방법)

#### Vercel에서 DNS 정보 확인
1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. 도메인 추가 (또는 기존 도메인 확인)
3. Vercel이 제공하는 DNS 설정 확인:
   - A 레코드: `76.76.21.21`
   - 또는 CNAME 레코드: `cname.vercel-dns.com`

#### Gabia에서 Vercel DNS 설정

**옵션 A: CNAME 방식 (권장)**
```
타입: CNAME
호스트: @ (또는 www)
값: cname.vercel-dns.com
TTL: 3600
```

**옵션 B: A 레코드 방식**
```
타입: A
호스트: @
값: 76.76.21.21
TTL: 3600
```

**www 서브도메인 (선택사항)**
```
타입: CNAME
호스트: www
값: cname.vercel-dns.com
TTL: 3600
```

## 📋 단계별 복구 가이드

### Step 1: Gabia 기본 설정으로 복구

1. **Gabia 로그인**
   - https://www.gabia.com

2. **도메인 관리**
   - 마이페이지 → 도메인 관리
   - 해당 도메인 선택

3. **네임서버 설정**
   - "네임서버 설정" 메뉴
   - "Gabia 네임서버 사용" 선택
   - 저장

4. **DNS 레코드 초기화**
   - "DNS 관리" 메뉴
   - 모든 레코드 삭제 (또는 기본 레코드만 남기기)

### Step 2: Vercel에 도메인 추가

1. **Vercel 대시보드**
   - https://vercel.com/dashboard
   - 프로젝트 선택

2. **Settings → Domains**
   - "Add Domain" 클릭
   - 도메인 입력 (예: your-domain.com)
   - "Add" 클릭

3. **DNS 설정 확인**
   - Vercel이 제공하는 DNS 설정 확인
   - 설정 방법 안내 확인

### Step 3: Gabia에 Vercel DNS 설정

1. **Gabia DNS 관리**
   - 도메인 관리 → DNS 관리

2. **레코드 추가**
   - "레코드 추가" 클릭
   - Vercel에서 제공한 설정 입력

3. **저장 및 확인**
   - 저장 후 DNS 전파 대기 (최대 48시간, 보통 몇 분~몇 시간)

## ⚠️ 주의사항

### DNS 전파 시간
- 최소: 몇 분
- 최대: 48시간
- 평균: 1-2시간

### 확인 방법
```bash
# Windows
nslookup your-domain.com

# 온라인
https://dnschecker.org
```

### 일반적인 실수
1. ❌ 잘못된 IP 주소 입력
2. ❌ TTL 설정 오류
3. ❌ 호스트명 오류 (@ vs www)
4. ❌ 레코드 타입 오류 (A vs CNAME)

## 🔄 빠른 복구 스크립트

### Gabia 기본 설정으로 복구
1. Gabia → 도메인 관리 → 네임서버 설정
2. "Gabia 네임서버 사용" 선택
3. 저장

### Vercel 연결 (나중에)
DNS가 안정화된 후 Vercel DNS 설정 적용

## 📞 도움이 필요한 경우

### Gabia 고객지원
- 전화: 1588-4253
- 이메일: support@gabia.com
- 채팅: Gabia 홈페이지

### Vercel 지원
- 문서: https://vercel.com/docs
- 커뮤니티: https://github.com/vercel/vercel/discussions

## ✅ 확인 체크리스트

- [ ] Gabia 네임서버로 복구 완료
- [ ] DNS 레코드 초기화 완료
- [ ] Vercel에 도메인 추가 완료
- [ ] Vercel DNS 설정 확인 완료
- [ ] Gabia에 Vercel DNS 레코드 추가 완료
- [ ] DNS 전파 확인 (nslookup 또는 온라인 도구)
- [ ] 사이트 접속 확인

