# Freeshell - 통합 AI 웹 개발 플랫폼

> 세계 최고 수준의 기업용 웹 개발 플랫폼

## 🚀 주요 특징

### 📊 통계
- **122+ 메뉴 항목**
- **400+ 컴포넌트**
- **95+ 라이브러리**
- **6개 언어 지원**
- **25+ AI API 통합**
- **5가지 멀티모달 지원**

## 🛠️ 기술 스택

- **프레임워크**: Next.js 14+
- **언어**: TypeScript
- **UI**: React 18+
- **스타일링**: Tailwind CSS
- **상태 관리**: Zustand
- **애니메이션**: Framer Motion
- **아이콘**: Lucide React
- **인증**: NextAuth.js (Google OAuth)

## 📦 설치

```bash
npm install
```

## 🚀 실행

### 개발 모드
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
npm start
```

### 코드 검증
```bash
npm run verify
```

## 🔐 환경 변수 설정

`.env.example` 파일을 참고하여 `.env` 파일을 생성하세요:

```bash
cp .env.example .env
```

필수 환경 변수:
- `GOOGLE_CLIENT_ID`: Google OAuth 클라이언트 ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth 클라이언트 시크릿
- `NEXTAUTH_SECRET`: NextAuth 시크릿 키
- `NEXTAUTH_URL`: 애플리케이션 URL

## 🌐 도메인 설정

### Vercel 배포

1. [Vercel](https://vercel.com)에 로그인
2. 프로젝트 import
3. 환경 변수 설정
4. 도메인 추가: `freeshell.co.kr`
5. DNS 설정 (도메인 제공업체에서)

### DNS 설정

도메인 제공업체에서 다음 레코드 추가:

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## 🔑 Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성
3. OAuth 2.0 클라이언트 ID 생성
4. 승인된 리디렉션 URI 추가:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://freeshell.co.kr/api/auth/callback/google`
5. 클라이언트 ID와 시크릿을 `.env`에 추가

## 📚 주요 기능

- AI Copilot (코드 자동 완성)
- 블록 기반 웹사이트 빌더
- 실시간 협업
- 버전 관리
- PWA 지원
- 관리자 대시보드

## 🤝 기여

이 프로젝트는 지속적으로 개선되고 있습니다. 버그 리포트와 기능 제안을 환영합니다.

## 📄 라이선스

MIT License

---

Made with ❤️ using AI

