# 🔍 Netlify CNAME 값 확인 가이드

## Netlify에서 CNAME 값 확인하는 방법

### 방법 1: Domain management에서 확인 (가장 쉬움)

1. **Netlify 대시보드 → "Domain management" 메뉴 클릭**

2. **"Add custom domain" 버튼 클릭**

3. **도메인 입력 후 "Verify" 클릭**

4. **DNS 설정 안내 화면 확인**
   - Netlify가 자동으로 필요한 DNS 레코드를 표시합니다
   - 예시:
     ```
     To point your domain to Netlify, add this DNS record:
     
     Type: CNAME
     Name: www
     Value: imaginative-fudge-4eb324.netlify.app
     ```

5. **이 값이 정확한 CNAME 값입니다!**

---

### 방법 2: Site settings에서 확인

1. **Netlify 대시보드 → "Project configuration" 메뉴 클릭**

2. **"General" 섹션 확인**

3. **"Site details" 섹션에서 확인**
   - **Site name:** `imaginative-fudge-4eb324`
   - **Site URL:** `https://imaginative-fudge-4eb324.netlify.app`

4. **CNAME 값은:** `imaginative-fudge-4eb324.netlify.app`

---

### 방법 3: 배포된 사이트 URL에서 확인

1. **Netlify 대시보드 → "Deploys" 메뉴 클릭**

2. **최신 배포 클릭**

3. **"Preview" 또는 "Live site" URL 확인**
   - 예: `https://imaginative-fudge-4eb324.netlify.app`

4. **도메인 부분만 추출:**
   - `imaginative-fudge-4eb324.netlify.app`

---

## 현재 프로젝트의 CNAME 값

현재 프로젝트 이름: `imaginative-fudge-4eb324`

**CNAME 값:**
```
imaginative-fudge-4eb324.netlify.app
```

---

## 가비아 DNS 설정 예시

### www 서브도메인 연결

```
호스트: www
타입: CNAME
값: imaginative-fudge-4eb324.netlify.app
TTL: 3600
```

---

## 확인 방법

### 1. Domain management에서 확인

1. **"Domain management" 메뉴 클릭**
2. **"Add custom domain" 클릭**
3. **도메인 입력 후 "Verify" 클릭**
4. **표시된 CNAME 값 확인**

### 2. Site settings에서 확인

1. **"Project configuration" → "General"**
2. **"Site details" 섹션**
3. **"Site URL" 확인**
4. **`.netlify.app` 앞부분이 CNAME 값**

---

## 중요 사항

1. **정확한 값 사용**
   - 프로젝트마다 고유한 CNAME 값이 있습니다
   - 현재 프로젝트: `imaginative-fudge-4eb324.netlify.app`

2. **도메인 추가 시 자동 표시**
   - "Add custom domain" 시 Netlify가 정확한 값을 표시합니다

3. **대소문자 구분 없음**
   - CNAME 값은 대소문자를 구분하지 않습니다

---

## 🚀 지금 바로 하세요!

1. **Netlify 대시보드 → "Domain management"**
2. **"Add custom domain" 클릭**
3. **도메인 입력 후 "Verify" 클릭**
4. **표시된 CNAME 값 확인**
5. **가비아 DNS에 설정**

**이것만 하면 됩니다!** 🎉

