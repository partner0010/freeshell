# Freeshell 배포 가이드

## 📋 목차
1. [Vercel 배포](#vercel-배포)
2. [도메인 연동](#도메인-연동)
3. [Google OAuth 설정](#google-oauth-설정)
4. [환경 변수 설정](#환경-변수-설정)
5. [GitHub 연동](#github-연동)

## 🚀 Vercel 배포

### 1단계: Vercel 계정 생성
1. [Vercel](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. 무료 플랜 선택 (Hobby 플랜 - 무료)

### 2단계: 프로젝트 Import
1. Vercel 대시보드에서 "Add New Project" 클릭
2. GitHub 저장소 선택 또는 직접 import
3. 프로젝트 설정:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3단계: 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수 추가:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://freeshell.co.kr
NEXT_PUBLIC_DOMAIN=freeshell.co.kr
NODE_ENV=production
```

### 4단계: 배포
1. "Deploy" 버튼 클릭
2. 배포 완료 대기 (약 2-3분)
3. 배포된 URL 확인

## 🌐 도메인 연동

### 1단계: Vercel에서 도메인 추가
1. Vercel 프로젝트 설정 → Domains
2. "Add Domain" 클릭
3. `freeshell.co.kr` 입력
4. DNS 설정 안내 확인

### 2단계: DNS 설정 (도메인 제공업체)
도메인 제공업체(예: 가비아, 후이즈)에서 다음 레코드 추가:

#### 방법 1: CNAME 레코드 (권장)
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### 방법 2: A 레코드
Vercel에서 제공하는 IP 주소를 A 레코드로 추가

### 3단계: SSL 인증서
- Vercel이 자동으로 Let's Encrypt SSL 인증서 발급
- HTTPS 자동 활성화 (약 5-10분 소요)

### 4단계: 도메인 확인
1. DNS 전파 대기 (최대 48시간, 보통 1-2시간)
2. `https://freeshell.co.kr` 접속 확인
3. SSL 인증서 확인

## 🔑 Google OAuth 설정

### 1단계: Google Cloud Console 설정
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" → "사용자 인증 정보" 이동

### 2단계: OAuth 2.0 클라이언트 ID 생성
1. "사용자 인증 정보 만들기" → "OAuth 클라이언트 ID"
2. 애플리케이션 유형: "웹 애플리케이션"
3. 이름: "Freeshell"
4. 승인된 리디렉션 URI 추가:
   ```
   http://localhost:3000/api/auth/callback/google
   https://freeshell.co.kr/api/auth/callback/google
   ```

### 3단계: 클라이언트 정보 복사
1. 클라이언트 ID 복사
2. 클라이언트 보안 비밀번호 복사
3. Vercel 환경 변수에 추가

### 4단계: OAuth 동의 화면 설정
1. "OAuth 동의 화면" 이동
2. 사용자 유형: "외부" 선택
3. 앱 정보 입력:
   - 앱 이름: Freeshell
   - 사용자 지원 이메일: partner0010@gmail.com
   - 개발자 연락처 정보: partner0010@gmail.com
4. 범위 추가: `email`, `profile`, `openid`
5. 테스트 사용자 추가: `partner0010@gmail.com`

## 🔐 환경 변수 설정

### 로컬 개발 (.env)
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=localhost:3000
NODE_ENV=development
```

### 프로덕션 (Vercel)
Vercel 대시보드에서 환경 변수 설정:
- Production, Preview, Development 모두 동일하게 설정

### NEXTAUTH_SECRET 생성
```bash
openssl rand -base64 32
```

## 📦 GitHub 연동

### 1단계: GitHub 저장소 생성
1. [GitHub](https://github.com) 접속
2. 새 저장소 생성: `freeshell`
3. 저장소 설정:
   - Public 또는 Private 선택
   - README, .gitignore, license 추가하지 않음 (이미 있음)

### 2단계: 로컬 코드 푸시
```bash
# Git 초기화 (이미 되어 있다면 생략)
git init

# 원격 저장소 추가
git remote add origin https://github.com/your-username/freeshell.git

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Freeshell v2.0"

# 푸시
git branch -M main
git push -u origin main
```

### 3단계: Vercel과 GitHub 연동
1. Vercel 프로젝트 설정 → Git
2. GitHub 저장소 연결
3. 자동 배포 활성화:
   - Push to main → Production 배포
   - Pull Request → Preview 배포

## ✅ 배포 확인 체크리스트

- [ ] Vercel 배포 완료
- [ ] 도메인 연결 확인 (`https://freeshell.co.kr`)
- [ ] SSL 인증서 활성화 확인
- [ ] Google OAuth 로그인 테스트
- [ ] 환경 변수 모두 설정 확인
- [ ] GitHub 저장소 연결 확인
- [ ] 자동 배포 작동 확인

## 🐛 문제 해결

### 도메인이 연결되지 않음
1. DNS 전파 확인: [whatsmydns.net](https://www.whatsmydns.net)
2. DNS 레코드 재확인
3. Vercel 도메인 설정 재확인

### OAuth 로그인 실패
1. Google Cloud Console에서 리디렉션 URI 확인
2. 환경 변수 확인 (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
3. NEXTAUTH_URL이 도메인과 일치하는지 확인

### 빌드 실패
1. 로컬에서 `npm run build` 테스트
2. TypeScript 오류 확인: `npm run type-check`
3. Vercel 빌드 로그 확인

## 💰 비용 정보

### Vercel 무료 플랜 (Hobby)
- ✅ 무료 SSL 인증서
- ✅ 무제한 대역폭
- ✅ 자동 배포
- ✅ 커스텀 도메인
- ✅ 월 100GB 대역폭
- ✅ 월 6,000 빌드 시간

**추가 비용**: 없음 (무료 플랜으로 충분)

### 도메인 비용
- `freeshell.co.kr`: 연간 약 15,000원 (도메인 제공업체에 따라 다름)

## 📞 지원

문제가 발생하면:
1. Vercel 문서: https://vercel.com/docs
2. Next.js 문서: https://nextjs.org/docs
3. NextAuth.js 문서: https://next-auth.js.org

---

**배포 완료 후**: `https://freeshell.co.kr`에서 서비스 확인!

