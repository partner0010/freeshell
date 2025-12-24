# 📝 Netlify DNS 레코드 추가 가이드

## ⚠️ 현재 문제점

스크린샷을 보니 **Record type이 "A"로 선택되어 있는데 Value에 SPF 값(`v=spf1 -all`)을 입력**하셨습니다. 이는 잘못된 설정입니다!

- **A 레코드**: IPv4 주소가 필요 (예: `192.0.1.1`)
- **SPF 레코드**: TXT 타입이어야 함

## ✅ 올바른 설정 방법

### 1. SPF 레코드 추가

#### 설정 값:
```
Record type: TXT (드롭다운에서 선택)
Name: @ (또는 비워둠)
Value: v=spf1 -all
TTL in seconds (optional): 3600
```

**단계별 설명:**
1. "Record type" 드롭다운 클릭 → **"TXT"** 선택
2. "Name" 필드에 **"@"** 입력 (또는 비워둠)
3. "Value" 필드에 **"v=spf1 -all"** 입력
4. "TTL in seconds"에 **"3600"** 입력 (선택사항)
5. "Save" 버튼 클릭

### 2. DMARC 레코드 추가

#### 설정 값:
```
Record type: TXT (드롭다운에서 선택)
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:admin@freeshell.co.kr
TTL in seconds (optional): 3600
```

**단계별 설명:**
1. "Add new record" 버튼 클릭
2. "Record type" 드롭다운 클릭 → **"TXT"** 선택
3. "Name" 필드에 **"_dmarc"** 입력 (언더스코어 포함!)
4. "Value" 필드에 **"v=DMARC1; p=none; rua=mailto:admin@freeshell.co.kr"** 입력
5. "TTL in seconds"에 **"3600"** 입력 (선택사항)
6. "Save" 버튼 클릭

## 📋 레코드 타입별 설정 요약

### TXT 레코드 (SPF, DMARC용)
- **Record type**: TXT
- **Name**: 
  - SPF: `@` (또는 비워둠)
  - DMARC: `_dmarc`
- **Value**: 
  - SPF: `v=spf1 -all`
  - DMARC: `v=DMARC1; p=none; rua=mailto:admin@freeshell.co.kr`

### A 레코드 (일반적으로 필요 없음)
- **Record type**: A
- **Name**: `@`
- **Value**: IPv4 주소 (예: `192.0.1.1`)
- **참고**: Netlify는 NETLIFY 타입을 사용하므로 A 레코드는 일반적으로 필요 없음

## 🎯 지금 바로 해야 할 일

### 1단계: 현재 잘못된 레코드 취소
- "Cancel" 버튼 클릭하여 모달 닫기

### 2단계: SPF 레코드 추가
1. "Add new record" 버튼 클릭
2. Record type: **TXT** 선택
3. Name: **@** 입력
4. Value: **v=spf1 -all** 입력
5. TTL: **3600** 입력 (선택사항)
6. Save 클릭

### 3단계: DMARC 레코드 추가
1. "Add new record" 버튼 클릭
2. Record type: **TXT** 선택
3. Name: **_dmarc** 입력 (언더스코어 포함!)
4. Value: **v=DMARC1; p=none; rua=mailto:admin@freeshell.co.kr** 입력
5. TTL: **3600** 입력 (선택사항)
6. Save 클릭

## ✅ 확인 방법

레코드 추가 후:
1. Netlify DNS 페이지에서 레코드 목록 확인
2. 다음 명령어로 확인:
```powershell
nslookup -type=TXT freeshell.co.kr
nslookup -type=TXT _dmarc.freeshell.co.kr
```

## 🚨 주의사항

1. **Record type은 반드시 TXT여야 합니다**
   - SPF와 DMARC는 모두 TXT 타입
   - A 레코드가 아닙니다!

2. **DMARC Name 필드**
   - 반드시 `_dmarc` (언더스코어 포함)
   - `dmarc`가 아닙니다!

3. **Value 필드 형식**
   - 따옴표 없이 입력
   - 예: `v=spf1 -all` (올바름)
   - 예: `"v=spf1 -all"` (잘못됨 - 따옴표 제거)

4. **이메일 주소**
   - `admin@freeshell.co.kr`를 실제 관리 이메일로 변경 가능

## 📸 스크린샷에서 본 문제

현재 설정:
- ❌ Record type: A
- ❌ Value: v=spf1 -all

올바른 설정:
- ✅ Record type: TXT
- ✅ Value: v=spf1 -all

**지금 "Cancel"을 클릭하고 다시 시작하세요!**

