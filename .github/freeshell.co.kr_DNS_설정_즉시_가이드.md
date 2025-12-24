# 🚀 freeshell.co.kr DNS/DMARC 즉시 설정 가이드

## 🔍 MX Toolbox 결과 분석

**도메인**: `freeshell.co.kr`  
**DNS 서버**: `ns.gabia.co.kr` (Gabia)  
**확인 일시**: 2025년 12월 23일

### ❌ 발견된 문제 (3개)
1. **DNS Record not found** - DNS 레코드가 게시되지 않음
2. **No DMARC Record found** - DMARC 레코드 없음
3. **DMARC Policy Not Enabled** - DMARC 정책이 활성화되지 않음

**⚠️ 중요**: Microsoft Outlook.com이 DMARC를 요구하므로 **반드시 설정해야 합니다!**

## ⚡ 즉시 해결 방법 (5분 소요)

### 1단계: 가비아 DNS 관리 페이지 접속
1. https://www.gabia.com 접속
2. 로그인
3. "도메인 관리" → "DNS 관리"
4. `freeshell.co.kr` 선택

### 2단계: DMARC 레코드 추가 (필수!)

**가장 중요한 단계입니다!**

1. "레코드 추가" 버튼 클릭
2. 다음 값 입력:
   ```
   호스트: _dmarc
   타입: TXT
   값: v=DMARC1; p=none; rua=mailto:admin@freeshell.co.kr
   TTL: 3600
   ```
3. "저장" 클릭

**⚠️ 주의사항:**
- 호스트는 반드시 `_dmarc` (언더스코어 포함)
- 타입은 반드시 `TXT`
- 이메일 주소(`admin@freeshell.co.kr`)는 실제 관리 이메일로 변경 가능

### 3단계: SPF 레코드 추가 (권장)

**이메일을 사용하지 않는 경우:**
```
호스트: @
타입: TXT
값: v=spf1 -all
TTL: 3600
```

**이메일을 사용하는 경우 (Netlify 사용 시):**
```
호스트: @
타입: TXT
값: v=spf1 include:_spf.netlify.com ~all
TTL: 3600
```

### 4단계: 기본 DNS 레코드 확인

**A 레코드 확인:**
- 호스트: `@` (또는 비워둠)
- 타입: `A`
- 값: [배포 플랫폼 IP 주소]
- TTL: `3600`

**CNAME 레코드 확인 (www 서브도메인):**
- 호스트: `www`
- 타입: `CNAME`
- 값: [배포 플랫폼 URL]
- TTL: `3600`

## ✅ 설정 후 확인 (5-10분 후)

### 방법 1: 명령어로 확인
```powershell
# Windows PowerShell
nslookup freeshell.co.kr
nslookup -type=TXT _dmarc.freeshell.co.kr
nslookup -type=TXT freeshell.co.kr
```

### 방법 2: MX Toolbox에서 확인
1. https://mxtoolbox.com/SuperTool.aspx 접속
2. 도메인 입력: `freeshell.co.kr`
3. "MX Lookup" 클릭
4. 예상 결과:
   - ✅ DNS Record Published
   - ✅ DMARC Record Published
   - ✅ DMARC Policy Enabled (또는 권장사항만 표시)

## 📋 완전한 DNS 설정 예시

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
```

## 🎯 DMARC 정책 단계별 적용

### 1단계: 모니터링 (현재 - 즉시 적용)
```
v=DMARC1; p=none; rua=mailto:admin@freeshell.co.kr
```
- 이메일을 받아서 분석만 함
- 아무것도 차단하지 않음
- **1-2주간 모니터링**

### 2단계: 격리 (1-2주 후)
```
v=DMARC1; p=quarantine; pct=100; rua=mailto:admin@freeshell.co.kr
```
- 의심스러운 이메일을 스팸 폴더로 이동
- **1-2주간 모니터링**

### 3단계: 거부 (최종)
```
v=DMARC1; p=reject; pct=100; rua=mailto:admin@freeshell.co.kr
```
- 의심스러운 이메일을 완전히 거부
- **최종 보안 설정**

## 🚨 중요 사항

1. **DMARC 레코드는 반드시 설정해야 합니다**
   - Microsoft Outlook.com이 요구함
   - 이메일 전송 시 필수

2. **DNS 전파 시간**
   - 일반적으로 5-10분 소요
   - 최대 48시간까지 걸릴 수 있음 (TTL에 따라)

3. **단계적 적용 권장**
   - 처음에는 `p=none`으로 시작
   - 모니터링 후 `p=quarantine`으로 변경
   - 최종적으로 `p=reject` 적용

## 📞 문제 해결

### DMARC 레코드가 보이지 않는 경우
1. 호스트가 `_dmarc`인지 확인 (언더스코어 포함)
2. 타입이 `TXT`인지 확인
3. 10분 후 다시 확인
4. DNS 전파 확인: https://dnschecker.org

### DNS 레코드가 보이지 않는 경우
1. A 레코드가 올바른 IP를 가리키는지 확인
2. CNAME 레코드가 올바른 URL을 가리키는지 확인
3. TTL 값 확인 (3600 권장)

## 🔗 유용한 링크

- **MX Toolbox**: https://mxtoolbox.com/SuperTool.aspx
- **DNS Checker**: https://dnschecker.org
- **DMARC Analyzer**: https://dmarcian.com/dmarc-inspector/
- **SPF 레코드 생성기**: https://www.spf-record.com/

## ✅ 체크리스트

- [ ] 가비아 DNS 관리 페이지 접속
- [ ] `_dmarc` TXT 레코드 추가
- [ ] SPF TXT 레코드 추가
- [ ] A 레코드 확인
- [ ] CNAME 레코드 확인
- [ ] 10분 후 MX Toolbox에서 재확인
- [ ] 모든 항목이 ✅로 표시되는지 확인

**지금 바로 가비아 DNS 관리 페이지에서 `_dmarc` 레코드를 추가하세요!**

