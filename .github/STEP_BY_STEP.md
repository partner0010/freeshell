# 🚀 단계별 진행 가이드

## ✅ 1단계: .env 파일 생성

먼저 환경 변수 파일을 만들어야 합니다.

**지금 할 일:**
1. 프로젝트 폴더에서 `.env` 파일을 만드세요 (메모장으로)
2. 아래 내용을 복사해서 붙여넣으세요:

```
# Google OAuth 설정
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# NextAuth 설정
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# 프로덕션 도메인
NEXT_PUBLIC_DOMAIN=freeshell.co.kr

# 환경 설정
NODE_ENV=development
```

3. 파일 저장 (이름: `.env` - 앞에 점이 중요합니다!)

**완료되면 "다음"이라고 말씀해주세요!**

---

## ✅ 2단계: npm install 실행

의존성 패키지를 설치해야 합니다.

**지금 할 일:**
터미널에서 다음 명령어 실행:
```
npm install
```

이 명령어는 2-3분 정도 걸릴 수 있습니다.

**완료되면 "다음"이라고 말씀해주세요!**

---

## ✅ 3단계: Google Cloud Console 설정

Google OAuth를 설정해야 합니다.

**지금 할 일:**
1. 브라우저에서 https://console.cloud.google.com 접속
2. Google 계정으로 로그인 (partner0010@gmail.com)
3. 왼쪽 상단 "프로젝트 선택" 클릭
4. "새 프로젝트" 클릭
5. 프로젝트 이름: `freeshell` 입력
6. "만들기" 클릭

**완료되면 "다음"이라고 말씀해주세요!**

---

## ✅ 4단계: OAuth 클라이언트 ID 생성

**지금 할 일:**
1. 왼쪽 메뉴에서 "API 및 서비스" 클릭
2. "사용자 인증 정보" 클릭
3. 위쪽 "사용자 인증 정보 만들기" 버튼 클릭
4. "OAuth 클라이언트 ID" 선택
5. "동의 화면 구성"이 필요하면:
   - 사용자 유형: "외부" 선택
   - 앱 이름: `Freeshell` 입력
   - 사용자 지원 이메일: `partner0010@gmail.com` 입력
   - 개발자 연락처 정보: `partner0010@gmail.com` 입력
   - "저장 후 계속" 클릭
   - 범위는 기본값 그대로 "저장 후 계속" 클릭
   - 테스트 사용자 추가: `partner0010@gmail.com` 입력
   - "저장 후 계속" 클릭
6. 애플리케이션 유형: **"웹 애플리케이션"** 선택
7. 이름: `Freeshell` 입력
8. **승인된 리디렉션 URI** 섹션에서:
   - `http://localhost:3000/api/auth/callback/google` 추가
   - `https://freeshell.co.kr/api/auth/callback/google` 추가
9. "만들기" 클릭
10. **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사!

**완료되면 "다음"이라고 말씀해주세요!**

---

## ✅ 5단계: .env 파일에 OAuth 정보 입력

**지금 할 일:**
1. `.env` 파일을 메모장으로 엽니다
2. 다음 두 줄을 찾아서:
   ```
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   ```
3. 복사한 값들을 붙여넣습니다:
   ```
   GOOGLE_CLIENT_ID=여기에_클라이언트_ID_붙여넣기
   GOOGLE_CLIENT_SECRET=여기에_보안_비밀번호_붙여넣기
   ```
4. NEXTAUTH_SECRET도 생성해야 합니다. 터미널에서:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   나온 값을 복사해서 `.env` 파일의 `NEXTAUTH_SECRET=` 뒤에 붙여넣으세요.

**완료되면 "다음"이라고 말씀해주세요!**

---

## ✅ 6단계: 로컬 테스트

프로젝트가 제대로 작동하는지 확인합니다.

**지금 할 일:**
터미널에서:
```
npm run dev
```

브라우저에서 http://localhost:3000 접속해서 확인하세요.

**완료되면 "다음"이라고 말씀해주세요!**

---

## ✅ 7단계: GitHub 저장소 생성

**지금 할 일:**
1. 브라우저에서 https://github.com 접속
2. Google 계정(partner0010@gmail.com)으로 로그인
3. 우측 상단 "+" 아이콘 클릭
4. "New repository" 클릭
5. Repository name: `freeshell` 입력
6. Public 또는 Private 선택
7. **"Initialize this repository with" 체크박스 모두 해제** (중요!)
8. "Create repository" 클릭

**완료되면 "다음"이라고 말씀해주세요!**

---

## ✅ 8단계: 코드 GitHub에 업로드

**지금 할 일:**
터미널에서 다음 명령어를 하나씩 실행하세요:

```bash
git init
git add .
git commit -m "Initial commit: Freeshell v2.0"
git branch -M main
git remote add origin https://github.com/당신의사용자명/freeshell.git
git push -u origin main
```

(당신의사용자명은 GitHub 사용자명으로 변경하세요)

**완료되면 "다음"이라고 말씀해주세요!**

---

## ✅ 9단계: Vercel 배포

**지금 할 일:**
1. 브라우저에서 https://vercel.com 접속
2. "Sign Up" 또는 "Log In" 클릭
3. GitHub 계정으로 로그인
4. "Add New Project" 클릭
5. 방금 만든 `freeshell` 저장소 선택
6. "Import" 클릭

**완료되면 "다음"이라고 말씀해주세요!**

---

## ✅ 10단계: Vercel 환경 변수 설정

**지금 할 일:**
1. "Environment Variables" 섹션 찾기
2. 다음 5개 변수를 추가하세요:

   - Name: `GOOGLE_CLIENT_ID`
     Value: `.env` 파일에 있는 값 복사

   - Name: `GOOGLE_CLIENT_SECRET`
     Value: `.env` 파일에 있는 값 복사

   - Name: `NEXTAUTH_SECRET`
     Value: `.env` 파일에 있는 값 복사

   - Name: `NEXTAUTH_URL`
     Value: `https://freeshell.co.kr`

   - Name: `NEXT_PUBLIC_DOMAIN`
     Value: `freeshell.co.kr`

3. 각 변수 추가 후 "Save" 클릭

**완료되면 "다음"이라고 말씀해주세요!**

---

## ✅ 11단계: Vercel 배포 실행

**지금 할 일:**
1. "Deploy" 버튼 클릭
2. 배포 완료까지 2-3분 대기
3. 배포 완료되면 URL 확인 (예: https://freeshell-xxx.vercel.app)

**완료되면 "다음"이라고 말씀해주세요!**

---

## ✅ 12단계: 도메인 추가

**지금 할 일:**
1. Vercel 프로젝트 페이지에서 "Settings" 클릭
2. "Domains" 탭 클릭
3. `freeshell.co.kr` 입력
4. "Add" 클릭
5. DNS 설정 안내 확인

**완료되면 "다음"이라고 말씀해주세요!**

---

## ✅ 13단계: DNS 설정

**지금 할 일:**
도메인 제공업체(가비아, 후이즈 등)에서:

1. DNS 관리 페이지 접속
2. 다음 레코드 추가:

   **레코드 1:**
   - Type: `CNAME`
   - Name: `@` (또는 비워두기)
   - Value: `cname.vercel-dns.com`
   - TTL: `3600`

   **레코드 2:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: `3600`

3. 저장

**완료되면 "다음"이라고 말씀해주세요!**

---

## ✅ 14단계: 최종 확인

**지금 할 일:**
1. DNS 전파 대기 (1-2시간, 최대 48시간)
2. https://freeshell.co.kr 접속 확인
3. Google 로그인 테스트

**완료! 🎉**

---

## 💡 팁

- 각 단계를 완료한 후 "다음"이라고 말씀해주시면 다음 단계를 안내해드립니다
- 문제가 생기면 언제든지 말씀해주세요
- 복사-붙여넣기를 활용하세요 (직접 입력하면 오타가 날 수 있습니다)

