# DNS 및 DMARC 설정 가이드

## 🔍 현재 문제점 (MX Toolbox 결과)

도메인: `freeshell.co.kr`  
DNS 서버: `ns.gabia.co.kr` (Gabia)

### 발견된 문제:
1. ❌ **DNS Record not found** - DNS 레코드가 게시되지 않음
2. ❌ **No DMARC Record found** - DMARC 레코드 없음
3. ⚠️ **DMARC Policy Not Enabled** - DMARC 정책이 활성화되지 않음

**⚠️ 중요**: Microsoft Outlook.com이 DMARC를 요구하므로 반드시 설정해야 합니다.

## 📋 해결 방법

### 1단계: 기본 DNS 레코드 설정

#### A 레코드 (웹사이트 접속용)
```
타입: A
호스트: @ (또는 비워둠)
값: [Netlify 또는 Vercel IP 주소]
TTL: 3600
```

#### CNAME 레코드 (www 서브도메인)
```
타입: CNAME
호스트: www
값: [배포 플랫폼 URL].netlify.app 또는 [배포 플랫폼 URL].vercel.app
TTL: 3600
```

### 2단계: MX 레코드 설정 (이메일용)

**이메일 서비스를 사용하지 않는 경우:**
- MX 레코드는 설정하지 않아도 됩니다.
- 하지만 DMARC는 설정하는 것이 좋습니다.

**이메일 서비스를 사용하는 경우:**
```
타입: MX
호스트: @
값: [이메일 서버 주소]
우선순위: 10
TTL: 3600
```

### 3단계: SPF 레코드 설정 (이메일 인증)

**이메일을 보내지 않는 경우:**
```
타입: TXT
호스트: @
값: v=spf1 -all
TTL: 3600
```
(이것은 "이 도메인에서 이메일을 보내지 않음"을 의미합니다)

**이메일을 보내는 경우:**
```
타입: TXT
호스트: @
값: v=spf1 include:_spf.netlify.com ~all
```
(Netlify를 사용하는 경우)

### 4단계: DMARC 레코드 설정 (필수)

Microsoft Outlook.com이 DMARC를 요구하므로 반드시 설정해야 합니다.

#### 기본 DMARC 설정 (모니터링만)
```
타입: TXT
호스트: _dmarc
값: v=DMARC1; p=none; rua=mailto:admin@freeshell.co.kr
TTL: 3600
```

#### 권장 DMARC 설정 (보안 강화)
```
타입: TXT
호스트: _dmarc
값: v=DMARC1; p=quarantine; pct=100; rua=mailto:admin@freeshell.co.kr; ruf=mailto:admin@freeshell.co.kr; fo=1
TTL: 3600
```

**설명:**
- `v=DMARC1`: DMARC 버전
- `p=none`: 정책 없음 (모니터링만)
- `p=quarantine`: 의심스러운 이메일을 격리
- `p=reject`: 의심스러운 이메일 거부
- `pct=100`: 100%의 이메일에 정책 적용
- `rua`: 집계 보고서를 받을 이메일
- `ruf`: 실패 보고서를 받을 이메일
- `fo=1`: 실패 시 보고서 생성

### 5단계: DKIM 레코드 설정 (선택사항, 권장)

이메일 서비스를 사용하는 경우 DKIM도 설정하는 것이 좋습니다.

```
타입: TXT
호스트: default._domainkey
값: [이메일 서비스 제공자가 제공하는 DKIM 값]
TTL: 3600
```

## 🔧 가비아 DNS 설정 방법

### 1. 가비아 관리자 페이지 접속
- https://www.gabia.com
- 로그인

### 2. DNS 관리 메뉴로 이동
- "도메인 관리" → "DNS 관리"
- `freeshell.co.kr` 선택

### 3. 레코드 추가

#### A 레코드 추가
1. "레코드 추가" 클릭
2. 설정:
   - 호스트: `@` (또는 비워둠)
   - 타입: `A`
   - 값: [배포 플랫폼 IP]
   - TTL: `3600`

#### CNAME 레코드 추가
1. "레코드 추가" 클릭
2. 설정:
   - 호스트: `www`
   - 타입: `CNAME`
   - 값: [배포 플랫폼 URL]
   - TTL: `3600`

#### DMARC 레코드 추가 (필수!)
1. "레코드 추가" 클릭
2. 설정:
   - 호스트: `_dmarc`
   - 타입: `TXT`
   - 값: `v=DMARC1; p=none; rua=mailto:admin@freeshell.co.kr`
   - TTL: `3600`

#### SPF 레코드 추가
1. "레코드 추가" 클릭
2. 설정:
   - 호스트: `@`
   - 타입: `TXT`
   - 값: `v=spf1 -all` (이메일 미사용 시)
   - TTL: `3600`

## ✅ 설정 후 확인

### 1. DNS 전파 확인
```bash
# Windows PowerShell
nslookup freeshell.co.kr
nslookup -type=TXT _dmarc.freeshell.co.kr
```

### 2. 온라인 도구로 확인
- MX Toolbox: https://mxtoolbox.com
- DNS Checker: https://dnschecker.org
- DMARC Analyzer: https://dmarcian.com/dmarc-inspector/

### 3. 확인 사항
- ✅ A 레코드가 올바른 IP를 가리키는지
- ✅ CNAME 레코드가 올바른 URL을 가리키는지
- ✅ DMARC 레코드가 올바르게 설정되었는지
- ✅ SPF 레코드가 설정되었는지

## 🚨 중요 사항

### Microsoft Outlook.com 요구사항
- **DMARC 레코드 필수**
- SPF, DKIM, DMARC 모두 설정 권장
- Delivery Center를 사용하여 유지보수 권장

### DMARC 정책 단계적 적용
1. **1단계**: `p=none` (모니터링만, 1-2주)
2. **2단계**: `p=quarantine` (격리, 1-2주)
3. **3단계**: `p=reject` (거부, 최종)

## 📝 완전한 DNS 설정 예시

### 이메일을 사용하지 않는 경우
```
호스트    타입    값                                      TTL
@         A       [배포 플랫폼 IP]                       3600
www       CNAME   [배포 플랫폼 URL]                      3600
@         TXT     v=spf1 -all                           3600
_dmarc    TXT     v=DMARC1; p=none; rua=mailto:admin@freeshell.co.kr  3600
```

### 이메일을 사용하는 경우
```
호스트    타입    값                                      TTL
@         A       [배포 플랫폼 IP]                       3600
www       CNAME   [배포 플랫폼 URL]                      3600
@         MX      [이메일 서버] 10                       3600
@         TXT     v=spf1 include:_spf.netlify.com ~all  3600
_dmarc    TXT     v=DMARC1; p=quarantine; rua=mailto:admin@freeshell.co.kr  3600
default._domainkey TXT [DKIM 값]                        3600
```

## 🎯 즉시 실행 가능한 단계

### 1. DMARC 레코드 추가 (가장 중요!)
```
호스트: _dmarc
타입: TXT
값: v=DMARC1; p=none; rua=mailto:admin@freeshell.co.kr
```

### 2. SPF 레코드 추가
```
호스트: @
타입: TXT
값: v=spf1 -all
```

### 3. 기본 DNS 레코드 확인
- A 레코드가 올바른 IP를 가리키는지 확인
- CNAME 레코드가 올바른 URL을 가리키는지 확인

## 📊 설정 후 예상 결과

### MX Toolbox에서 확인 시:
- ✅ DNS Record Published
- ✅ DMARC Record Published
- ✅ DMARC Policy Enabled (또는 권장사항만 표시)

## 🔗 참고 링크

- MX Toolbox: https://mxtoolbox.com
- DMARC 가이드: https://dmarcian.com/dmarc-inspector/
- SPF 레코드 생성기: https://www.spf-record.com/
- DNS Checker: https://dnschecker.org

