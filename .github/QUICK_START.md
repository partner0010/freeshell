# 🚀 빠른 시작 가이드 (초간단 버전)

## ⚡ 3단계로 시작하기

### 1단계: 자동 설정 실행
```bash
node scripts/auto-setup.js
```

이 명령어가 자동으로:
- ✅ .env 파일 생성
- ✅ 필요한 설정 확인
- ✅ NEXTAUTH_SECRET 자동 생성

### 2단계: 필요한 웹사이트 열기
```bash
node scripts/open-urls.js
```

이 명령어가 자동으로 브라우저에서 열어줍니다:
- 🌐 Google Cloud Console
- 🌐 GitHub
- 🌐 Vercel

### 3단계: 의존성 설치
```bash
npm install
```

---

## 📝 각 사이트에서 할 일 (초간단)

### 🌐 Google Cloud Console (자동으로 열림)

1. **프로젝트 만들기**
   - 왼쪽 상단 "프로젝트 선택" 클릭
   - "새 프로젝트" 클릭
   - 이름: `freeshell` 입력
   - "만들기" 클릭

2. **OAuth 설정**
   - 왼쪽 메뉴: "API 및 서비스" → "사용자 인증 정보"
   - 위쪽 "사용자 인증 정보 만들기" 클릭
   - "OAuth 클라이언트 ID" 선택
   - 애플리케이션 유형: **"웹 애플리케이션"** 선택
   - 이름: `Freeshell` 입력
   - **승인된 리디렉션 URI** 섹션에서:
     - `http://localhost:3000/api/auth/callback/google` 추가
     - `https://freeshell.co.kr/api/auth/callback/google` 추가
   - "만들기" 클릭
   - **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사!

3. **.env 파일에 붙여넣기**
   - 프로젝트 폴더의 `.env` 파일 열기
   - 다음 두 줄에 붙여넣기:
     ```
     GOOGLE_CLIENT_ID=복사한_클라이언트_ID
     GOOGLE_CLIENT_SECRET=복사한_보안_비밀번호
     ```

### 🌐 GitHub (자동으로 열림)

1. **저장소 만들기**
   - 우측 상단 "+" 아이콘 클릭
   - "New repository" 클릭
   - Repository name: `freeshell` 입력
   - Public 또는 Private 선택
   - **"Initialize this repository with" 체크박스 모두 해제**
   - "Create repository" 클릭

2. **코드 업로드** (터미널에서)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/당신의사용자명/freeshell.git
   git push -u origin main
   ```
   (당신의사용자명은 GitHub 사용자명으로 변경)

### 🌐 Vercel (자동으로 열림)

1. **로그인**
   - "Sign Up" 또는 "Log In" 클릭
   - GitHub 계정으로 로그인

2. **프로젝트 추가**
   - "Add New Project" 클릭
   - 방금 만든 GitHub 저장소 선택
   - "Import" 클릭

3. **환경 변수 설정**
   - "Environment Variables" 섹션에서:
     - `GOOGLE_CLIENT_ID` = Google에서 복사한 값
     - `GOOGLE_CLIENT_SECRET` = Google에서 복사한 값
     - `NEXTAUTH_SECRET` = .env 파일에 있는 값 복사
     - `NEXTAUTH_URL` = `https://freeshell.co.kr`
     - `NEXT_PUBLIC_DOMAIN` = `freeshell.co.kr`

4. **배포**
   - "Deploy" 버튼 클릭
   - 배포 완료 대기 (2-3분)

5. **도메인 추가**
   - 프로젝트 설정 → "Domains" 탭
   - `freeshell.co.kr` 입력
   - "Add" 클릭
   - DNS 설정 안내 확인

---

## 🎯 완료 체크리스트

각 단계를 완료하면 체크하세요:

### Google OAuth
- [ ] Google Cloud Console 프로젝트 생성
- [ ] OAuth 클라이언트 ID 생성
- [ ] 리디렉션 URI 2개 추가
- [ ] 클라이언트 ID와 시크릿 복사
- [ ] .env 파일에 붙여넣기

### GitHub
- [ ] GitHub 저장소 생성
- [ ] 코드 푸시 완료

### Vercel
- [ ] Vercel 로그인
- [ ] GitHub 저장소 연결
- [ ] 환경 변수 5개 모두 설정
- [ ] 배포 완료
- [ ] 도메인 추가

### 도메인
- [ ] 도메인 제공업체에서 DNS 설정
- [ ] Vercel에서 도메인 확인 완료
- [ ] https://freeshell.co.kr 접속 확인

---

## 🆘 문제 해결

### "npm install" 오류
```bash
# 캐시 삭제 후 재시도
npm cache clean --force
npm install
```

### Google OAuth 오류
- 리디렉션 URI가 정확한지 확인
- 클라이언트 ID와 시크릿이 올바른지 확인

### Vercel 배포 오류
- 환경 변수가 모두 설정되었는지 확인
- GitHub 저장소가 올바르게 연결되었는지 확인

### 도메인 연결 안 됨
- DNS 설정 후 최대 48시간 소요 (보통 1-2시간)
- [whatsmydns.net](https://www.whatsmydns.net)에서 확인

---

## 💡 팁

1. **한 번에 하나씩**: 모든 것을 한 번에 하려고 하지 마세요. 하나씩 차근차근 진행하세요.

2. **복사-붙여넣기 활용**: 모든 값은 복사-붙여넣기로 하세요. 직접 입력하면 오타가 날 수 있습니다.

3. **에러 메시지 읽기**: 에러가 나면 메시지를 자세히 읽어보세요. 대부분 해결 방법이 나와 있습니다.

4. **저장하기**: 각 단계에서 중요한 정보(클라이언트 ID, 시크릿 등)는 메모장에 저장해두세요.

---

**이제 시작하세요!** 🚀

```bash
# 1. 자동 설정
node scripts/auto-setup.js

# 2. 웹사이트 열기
node scripts/open-urls.js

# 3. 의존성 설치
npm install
```

그 다음 위의 체크리스트를 따라 하나씩 진행하세요!

