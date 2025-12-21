# 🌐 Netlify DNS 설정 방법

## 현재 상황

Netlify가 네임서버 변경을 요구하고 있습니다. 두 가지 방법이 있습니다:

---

## 방법 1: External DNS 사용 (현재 방법 - 권장) ✅

**이미 가비아에서 DNS 레코드를 설정했으므로 이 방법을 계속 사용할 수 있습니다.**

### 장점:
- ✅ 가비아 DNS 설정을 그대로 사용
- ✅ 네임서버 변경 불필요
- ✅ 이미 설정 완료

### 단계:

1. **"Done" 버튼을 클릭하지 마세요!**
   - 이 화면은 Netlify DNS를 사용할 때만 필요합니다

2. **"Cancel" 또는 뒤로 가기**
   - 이 화면을 닫습니다

3. **External DNS 사용**
   - Netlify가 자동으로 가비아 DNS 레코드를 감지합니다
   - 또는 "Add domain" 시 "I'll add DNS records myself" 옵션 선택

---

## 방법 2: Netlify DNS 사용 (네임서버 변경)

**가비아 네임서버를 Netlify 네임서버로 변경합니다.**

### 장점:
- ✅ Netlify에서 DNS를 직접 관리
- ✅ 자동 SSL 발급
- ✅ 서브도메인 자동 관리

### 단점:
- ⚠️ 가비아에서 설정한 DNS 레코드가 무효화됨
- ⚠️ 네임서버 변경 필요

### 단계:

1. **Netlify에서 제공한 네임서버 복사:**
   - `dns1.p08.nsone.net`
   - `dns2.p08.nsone.net`
   - `dns3.p08.nsone.net`
   - `dns4.p08.nsone.net`

2. **가비아 관리자 페이지 로그인**
   - `https://www.gabia.com`

3. **"도메인 관리" → "네임서버 관리"**

4. **네임서버 변경:**
   - 기존 네임서버를 Netlify 네임서버로 변경
   - `dns1.p08.nsone.net`
   - `dns2.p08.nsone.net`
   - `dns3.p08.nsone.net`
   - `dns4.p08.nsone.net`

5. **Netlify에서 "Done" 버튼 클릭**

6. **DNS 전파 대기** (5분 ~ 24시간)

---

## 추천: 방법 1 (External DNS 사용)

**이유:**
- ✅ 이미 가비아에서 DNS 설정 완료
- ✅ 네임서버 변경 불필요
- ✅ 더 간단함

---

## 방법 1 실행 방법

### 1. 현재 화면 닫기

1. **"Cancel" 버튼 클릭** (있다면)
2. **또는 브라우저 뒤로 가기**
3. **또는 "Domain management"로 돌아가기**

### 2. External DNS로 도메인 추가

1. **"Domain management" → "Add a domain"**

2. **도메인 입력:**
   - `freeshell.co.kr`

3. **"Verify" 클릭**

4. **Netlify가 DNS 레코드를 확인:**
   - 가비아에서 설정한 A 레코드 확인
   - 가비아에서 설정한 CNAME 레코드 확인

5. **"DNS configured correctly" 표시되면 완료!**

---

## 방법 2 실행 방법 (Netlify DNS 사용)

### 1. 네임서버 복사

Netlify에서 제공한 네임서버:
- `dns1.p08.nsone.net`
- `dns2.p08.nsone.net`
- `dns3.p08.nsone.net`
- `dns4.p08.nsone.net`

### 2. 가비아에서 네임서버 변경

1. **가비아 관리자 페이지 로그인**
   - `https://www.gabia.com`

2. **"도메인 관리" → "네임서버 관리"**

3. **도메인 선택:**
   - `freeshell.co.kr`

4. **네임서버 변경:**
   - 기존 네임서버 삭제
   - Netlify 네임서버 추가:
     - `dns1.p08.nsone.net`
     - `dns2.p08.nsone.net`
     - `dns3.p08.nsone.net`
     - `dns4.p08.nsone.net`

5. **저장**

### 3. Netlify에서 완료

1. **"Done" 버튼 클릭**

2. **DNS 전파 대기** (5분 ~ 24시간)

---

## 비교

| 항목 | External DNS (방법 1) | Netlify DNS (방법 2) |
|------|----------------------|---------------------|
| 네임서버 변경 | ❌ 불필요 | ✅ 필요 |
| DNS 레코드 관리 | 가비아에서 관리 | Netlify에서 관리 |
| 설정 복잡도 | ✅ 간단 | ⚠️ 복잡 |
| SSL 자동 발급 | ✅ 가능 | ✅ 가능 |
| 현재 상태 | ✅ 이미 설정 완료 | ⚠️ 추가 설정 필요 |

---

## 🚀 추천: 방법 1 (External DNS)

**이미 가비아에서 DNS 설정을 완료했으므로 방법 1을 권장합니다.**

1. **현재 화면 닫기** (Cancel 또는 뒤로 가기)
2. **"Domain management" → "Add a domain"**
3. **`freeshell.co.kr` 입력 후 "Verify" 클릭**
4. **Netlify가 가비아 DNS 레코드를 자동으로 확인**

**이것만 하면 됩니다!** 🎉

