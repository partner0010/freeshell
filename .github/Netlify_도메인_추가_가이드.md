# 🌐 Netlify 도메인 추가 가이드

## 현재 상태

- ✅ 가비아 DNS 설정 완료
- ⚠️ Netlify에서 도메인 추가 필요

---

## 도메인 추가 단계

### 1단계: Netlify에서 도메인 추가

1. **Netlify 대시보드 → "Domain management" 메뉴**

2. **"Production domains" 섹션에서 "Add a domain" 버튼 클릭**

3. **도메인 입력:**
   - `freeshell.co.kr` (루트 도메인)
   - 또는 `www.freeshell.co.kr` (www 서브도메인)

4. **"Verify" 또는 "Add domain" 클릭**

5. **DNS 설정 확인**
   - Netlify가 DNS 레코드를 확인합니다
   - 가비아에서 설정한 DNS 레코드가 올바르면 "DNS configured correctly" 표시

---

### 2단계: 두 도메인 모두 추가 (권장)

**루트 도메인 추가:**
1. "Add a domain" 클릭
2. `freeshell.co.kr` 입력
3. "Verify" 클릭

**www 서브도메인 추가:**
1. "Add a domain" 클릭
2. `www.freeshell.co.kr` 입력
3. "Verify" 클릭

---

### 3단계: DNS 설정 확인

Netlify가 DNS 레코드를 확인합니다:

**루트 도메인 (freeshell.co.kr):**
- A 레코드 확인: `75.2.60.5`, `75.2.70.5` 등
- 상태: ✅ "DNS configured correctly" (초록색)

**www 서브도메인 (www.freeshell.co.kr):**
- CNAME 레코드 확인: `imaginative-fudge-4eb324.netlify.app.`
- 상태: ✅ "DNS configured correctly" (초록색)

---

### 4단계: SSL 인증서 자동 발급

Netlify는 자동으로 SSL 인증서를 발급합니다:
- DNS 설정이 완료되면 자동으로 SSL 인증서 발급
- HTTPS 자동 활성화
- 발급까지 몇 분 ~ 몇 시간 걸릴 수 있음

**확인 위치:**
- "Domain management" → "HTTPS" 섹션
- "SSL/TLS certificate" 상태 확인

---

## 확인 방법

### 1. DNS 설정 상태 확인

**"Domain management" 페이지에서:**
- ✅ "DNS configured correctly" (초록색) - 완료
- ⚠️ "DNS not configured" (노란색) - 아직 전파 중
- ❌ "DNS configuration error" (빨간색) - 설정 오류

### 2. SSL 인증서 상태 확인

**"HTTPS" 섹션에서:**
- ✅ "SSL certificate active" (초록색) - 완료
- ⚠️ "SSL certificate provisioning" (노란색) - 발급 중
- ❌ "SSL certificate error" (빨간색) - 오류

### 3. 브라우저에서 확인

- `https://freeshell.co.kr` 접속 시도
- `https://www.freeshell.co.kr` 접속 시도
- Netlify 사이트가 표시되면 성공

---

## 문제 해결

### DNS가 인식되지 않는 경우

1. **DNS 전파 확인**
   - `https://dnschecker.org` 사용
   - 도메인 입력: `freeshell.co.kr`
   - DNS 레코드 확인

2. **가비아 DNS 확인**
   - DNS 레코드가 올바르게 설정되어 있는지 확인
   - 최근 업데이트 시간 확인

3. **Netlify에서 재확인**
   - "Domain management" → 도메인 → "Verify DNS" 클릭

### SSL 인증서가 발급되지 않는 경우

1. **DNS 전파 대기**
   - DNS 설정 후 최대 24시간 대기

2. **DNS 설정 재확인**
   - 모든 DNS 레코드가 올바르게 설정되어 있는지 확인

3. **Netlify 지원팀 문의**
   - 문제가 계속되면 Netlify 지원팀에 문의

---

## ✅ 완료 체크리스트

- [x] 가비아 DNS 설정 완료
- [ ] Netlify에서 `freeshell.co.kr` 도메인 추가
- [ ] Netlify에서 `www.freeshell.co.kr` 도메인 추가
- [ ] DNS 설정 상태 확인 (초록색)
- [ ] SSL 인증서 발급 완료
- [ ] 사이트 정상 작동 확인

---

## 🚀 지금 바로 하세요!

1. **Netlify 대시보드 → "Domain management"**
2. **"Add a domain" 버튼 클릭**
3. **`freeshell.co.kr` 입력 후 "Verify" 클릭**
4. **`www.freeshell.co.kr` 입력 후 "Verify" 클릭**
5. **DNS 설정 상태 확인**
6. **SSL 인증서 발급 대기**

**이것만 하면 됩니다!** 🎉

