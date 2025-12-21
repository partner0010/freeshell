# 🌐 가비아 도메인 Netlify 연결 가이드

## 개요

가비아에서 구매한 도메인을 Netlify에 연결하려면 DNS 레코드를 설정해야 합니다.

---

## 단계별 설정

### 1단계: Netlify에서 도메인 추가

1. **Netlify 대시보드 → "Domain management" 메뉴 클릭**

2. **"Add custom domain" 버튼 클릭**

3. **도메인 입력**
   - 예: `yourdomain.com` 또는 `www.yourdomain.com`

4. **"Verify" 클릭**

5. **DNS 설정 안내 확인**
   - Netlify가 필요한 DNS 레코드를 표시합니다
   - 예시:
     - Type: `A`
     - Name: `@` (또는 루트 도메인)
     - Value: `75.2.60.5` (Netlify IP 주소)
     - 또는
     - Type: `CNAME`
     - Name: `www`
     - Value: `imaginative-fudge-4eb324.netlify.app` (현재 프로젝트의 CNAME 값)
   
   **⚠️ 정확한 CNAME 값 확인:**
   - "Add custom domain" 시 Netlify가 자동으로 표시합니다
   - 또는 "Project configuration" → "General" → "Site URL"에서 확인

---

### 2단계: 가비아 DNS 설정

1. **가비아 관리자 페이지 로그인**
   - `https://www.gabia.com`

2. **"도메인 관리" → "DNS 관리" 메뉴로 이동**

3. **도메인 선택**
   - 연결할 도메인 선택

4. **DNS 레코드 추가/수정**

#### 옵션 A: 루트 도메인 연결 (예: yourdomain.com)

**A 레코드 추가:**
- **호스트:** `@` (또는 비워두기)
- **타입:** `A`
- **값:** `75.2.60.5` (Netlify IP 주소)
- **TTL:** `3600` (또는 기본값)

**www 서브도메인 연결 (선택사항):**
- **호스트:** `www`
- **타입:** `CNAME`
- **값:** `imaginative-fudge-4eb324.netlify.app.` (끝에 점(.) 추가 필수!)
- **TTL:** `3600` (또는 기본값)
   
   **⚠️ 중요:**
   - 가비아 DNS는 CNAME 값이 점(.)으로 끝나야 합니다
   - Netlify 값: `imaginative-fudge-4eb324.netlify.app`
   - 가비아 입력 값: `imaginative-fudge-4eb324.netlify.app.` (끝에 점 추가!)
   
   **⚠️ 정확한 CNAME 값 확인:**
   - "Add custom domain" 시 Netlify가 자동으로 표시합니다
   - 또는 "Project configuration" → "General" → "Site URL"에서 확인
   - **가비아에 입력할 때는 끝에 점(.) 추가!**

#### 옵션 B: www 서브도메인만 연결 (예: www.yourdomain.com)

**CNAME 레코드 추가:**
- **호스트:** `www`
- **타입:** `CNAME`
- **값:** `imaginative-fudge-4eb324.netlify.app` (현재 프로젝트의 CNAME 값)
- **TTL:** `3600` (또는 기본값)
   
   **⚠️ 정확한 CNAME 값 확인:**
   - "Add custom domain" 시 Netlify가 자동으로 표시합니다
   - 또는 "Project configuration" → "General" → "Site URL"에서 확인

---

### 3단계: Netlify IP 주소 확인

Netlify의 IP 주소는 다음과 같습니다:
- `75.2.60.5`
- `75.2.70.5`
- `75.2.71.5`
- `75.2.72.5`
- `75.2.73.5`

**권장:** 여러 개의 A 레코드를 추가하여 로드 밸런싱

---

### 4단계: DNS 전파 대기

DNS 설정 후 전파까지 시간이 걸릴 수 있습니다:
- **일반적으로:** 5분 ~ 24시간
- **평균:** 1-2시간

---

### 5단계: SSL 인증서 자동 발급

Netlify는 자동으로 SSL 인증서를 발급합니다:
- DNS 설정이 완료되면 자동으로 SSL 인증서 발급
- HTTPS 자동 활성화

---

## 가비아 DNS 설정 예시

### 예시 1: 루트 도메인 + www 연결

```
호스트    타입    값                                      TTL
@         A       75.2.60.5                              3600
@         A       75.2.70.5                              3600
www       CNAME   imaginative-fudge-4eb324.netlify.app     3600
```

### 예시 2: www만 연결

```
호스트    타입    값                                      TTL
www       CNAME   imaginative-fudge-4eb324.netlify.app     3600
```

---

## 확인 방법

### 1. DNS 전파 확인

온라인 도구 사용:
- `https://dnschecker.org`
- 도메인 입력
- `A` 또는 `CNAME` 레코드 확인

### 2. Netlify에서 확인

1. **"Domain management" 메뉴**
2. **도메인 상태 확인**
   - ✅ "DNS configured correctly" (초록색)
   - ⚠️ "DNS not configured" (노란색) - 아직 전파 중

### 3. 브라우저에서 확인

- 도메인으로 접속 시도
- Netlify 사이트가 표시되면 성공

---

## 문제 해결

### DNS가 전파되지 않는 경우

1. **TTL 값 확인**
   - TTL이 너무 높으면 전파가 느릴 수 있음
   - TTL을 3600 (1시간)으로 설정

2. **DNS 캐시 클리어**
   - 브라우저 캐시 클리어
   - DNS 캐시 클리어 (Windows: `ipconfig /flushdns`)

3. **레코드 확인**
   - 가비아에서 DNS 레코드가 올바르게 설정되었는지 확인
   - 오타 확인

### Netlify에서 도메인을 인식하지 못하는 경우

1. **DNS 전파 대기**
   - 최대 24시간 대기

2. **레코드 재확인**
   - Netlify에서 제공한 정확한 값 사용

3. **Netlify 지원팀 문의**
   - 문제가 계속되면 Netlify 지원팀에 문의

---

## 참고

- **Netlify 문서:** `https://docs.netlify.com/domains-https/custom-domains/configure-external-dns/`
- **가비아 도메인 관리:** `https://www.gabia.com`

---

## 🚀 지금 바로 하세요!

1. **Netlify에서 도메인 추가**
2. **가비아에서 DNS 레코드 설정**
3. **DNS 전파 대기**
4. **SSL 인증서 자동 발급 확인**

**이것만 하면 됩니다!** 🎉

