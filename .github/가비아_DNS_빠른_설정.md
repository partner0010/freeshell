# ⚡ 가비아 DNS 빠른 설정

## 빠른 설정 (5분)

### 1. Netlify에서 도메인 추가

1. Netlify 대시보드 → "Domain management"
2. "Add custom domain" 클릭
3. 도메인 입력 (예: `yourdomain.com`)
4. "Verify" 클릭
5. **DNS 설정 안내 확인** (중요!)

---

### 2. 가비아 DNS 설정

1. **가비아 관리자 페이지 로그인**
   - `https://www.gabia.com`

2. **"도메인 관리" → "DNS 관리"**

3. **도메인 선택**

4. **DNS 레코드 추가:**

#### 루트 도메인 연결 (yourdomain.com)

**A 레코드 추가 (여러 개 권장):**
```
호스트: @ (또는 비워두기)
타입: A
값: 75.2.60.5
TTL: 3600
```

**추가 A 레코드:**
```
호스트: @
타입: A
값: 75.2.70.5
TTL: 3600
```

#### www 서브도메인 연결 (www.yourdomain.com)

**CNAME 레코드 추가:**
```
호스트: www
타입: CNAME
값: imaginative-fudge-4eb324.netlify.app. (끝에 점(.) 추가 필수!)
TTL: 3600
```

**⚠️ 중요:**
- 가비아 DNS는 CNAME 값이 점(.)으로 끝나야 합니다
- Netlify 값: `imaginative-fudge-4eb324.netlify.app`
- 가비아 입력 값: `imaginative-fudge-4eb324.netlify.app.` (끝에 점 추가!)

**⚠️ CNAME 값 확인 방법:**
1. Netlify 대시보드 → "Domain management" → "Add custom domain"
2. 도메인 입력 후 "Verify" 클릭
3. 표시된 CNAME 값 확인 (자동으로 표시됨)
4. 또는 "Project configuration" → "General" → "Site URL"에서 확인
5. **가비아에 입력할 때는 끝에 점(.) 추가!**

---

### 3. 확인

1. **DNS 전파 확인** (5분 ~ 24시간)
   - `https://dnschecker.org` 사용

2. **Netlify에서 확인**
   - "Domain management" → 도메인 상태
   - ✅ "DNS configured correctly" (초록색)

3. **브라우저에서 접속**
   - 도메인으로 접속 시도
   - Netlify 사이트가 표시되면 성공

---

## Netlify IP 주소 목록

여러 개의 A 레코드를 추가하여 로드 밸런싱:

- `75.2.60.5`
- `75.2.70.5`
- `75.2.71.5`
- `75.2.72.5`
- `75.2.73.5`

---

## 중요 사항

1. **Netlify에서 제공한 정확한 값 사용**
   - 도메인 추가 시 Netlify가 정확한 DNS 값을 표시합니다

2. **DNS 전파 시간**
   - 일반적으로 5분 ~ 24시간
   - 평균 1-2시간

3. **SSL 인증서**
   - DNS 설정 완료 후 자동으로 발급됩니다

---

## 🚀 지금 바로 하세요!

1. **Netlify에서 도메인 추가**
2. **가비아에서 DNS 레코드 설정**
3. **DNS 전파 대기**

**이것만 하면 됩니다!** 🎉

