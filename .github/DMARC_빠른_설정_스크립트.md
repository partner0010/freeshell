# DMARC 빠른 설정 가이드

## 🚨 현재 문제 (freeshell.co.kr)
- ❌ DNS Record not found
- ❌ DMARC 레코드 없음
- ❌ Microsoft Outlook.com이 DMARC를 요구함

## ⚡ 즉시 해결 방법

### 가비아 DNS 설정에서 추가:

#### 1. DMARC 레코드 추가 (필수!)

**가비아 DNS 관리 페이지에서:**
1. "레코드 추가" 클릭
2. 다음 값 입력:
   ```
   호스트: _dmarc
   타입: TXT
   값: v=DMARC1; p=none; rua=mailto:admin@freeshell.co.kr
   TTL: 3600
   ```
3. 저장

**주의사항:**
- 호스트는 반드시 `_dmarc` (언더스코어 포함)
- 타입은 `TXT`
- 값에 이메일 주소를 실제 관리 이메일로 변경 가능

#### 2. SPF 레코드 추가 (권장)

**이메일을 사용하지 않는 경우:**
```
호스트: @
타입: TXT
값: v=spf1 -all
TTL: 3600
```

**이메일을 사용하는 경우:**
```
호스트: @
타입: TXT
값: v=spf1 include:_spf.netlify.com ~all
TTL: 3600
```

## ✅ 설정 후 확인

### 1. 5-10분 후 확인
```bash
# Windows PowerShell
nslookup -type=TXT _dmarc.freeshell.co.kr
```

### 2. MX Toolbox에서 재확인
- https://mxtoolbox.com/SuperTool.aspx
- 도메인 입력: `freeshell.co.kr`
- "MX Lookup" 클릭

### 3. 예상 결과
- ✅ DMARC Record Published
- ✅ DNS Record Published

## 📝 DMARC 정책 단계별 적용

### 1단계: 모니터링 (현재)
```
v=DMARC1; p=none; rua=mailto:admin@freeshell.co.kr
```
- 이메일을 받아서 분석만 함
- 아무것도 차단하지 않음

### 2단계: 격리 (1-2주 후)
```
v=DMARC1; p=quarantine; pct=100; rua=mailto:admin@freeshell.co.kr
```
- 의심스러운 이메일을 스팸 폴더로 이동

### 3단계: 거부 (최종)
```
v=DMARC1; p=reject; pct=100; rua=mailto:admin@freeshell.co.kr
```
- 의심스러운 이메일을 완전히 거부

## 🎯 지금 바로 하세요!

1. 가비아 DNS 관리 페이지 접속
2. `_dmarc` 레코드 추가
3. 5-10분 후 MX Toolbox에서 확인

**이것만 하면 Microsoft Outlook.com 요구사항을 만족합니다!**

