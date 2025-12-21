# ⚡ Netlify 도메인 추가 간단 가이드

## 현재 화면 닫기

**⚠️ 중요:** 현재 화면은 Netlify DNS를 사용할 때만 필요합니다.

**이미 가비아에서 DNS 설정을 완료했으므로 이 화면을 닫고 External DNS로 진행하세요.**

---

## 방법: External DNS 사용 (권장)

### 1단계: 현재 화면 닫기

1. **"Cancel" 버튼 클릭** (있다면)
2. **또는 브라우저 뒤로 가기**
3. **또는 "Domain management"로 돌아가기**

### 2단계: 도메인 추가

1. **"Domain management" 페이지로 돌아가기**

2. **"Add a domain" 버튼 클릭**

3. **도메인 입력:**
   - `freeshell.co.kr`

4. **"Verify" 클릭**

5. **Netlify가 DNS 레코드를 확인:**
   - 가비아에서 설정한 A 레코드 확인
   - 가비아에서 설정한 CNAME 레코드 확인

6. **"DNS configured correctly" 표시되면 완료!**

---

## 확인 방법

### DNS 설정 상태

- ✅ "DNS configured correctly" (초록색) - 완료
- ⚠️ "DNS not configured" (노란색) - 아직 전파 중

### SSL 인증서

- DNS 설정 완료 후 자동으로 SSL 인증서 발급
- "HTTPS" 섹션에서 확인

---

## 🚀 지금 바로 하세요!

1. **현재 화면 닫기** (Cancel 또는 뒤로 가기)
2. **"Add a domain" 클릭**
3. **`freeshell.co.kr` 입력 후 "Verify" 클릭**
4. **DNS 설정 상태 확인**

**이것만 하면 됩니다!** 🎉

