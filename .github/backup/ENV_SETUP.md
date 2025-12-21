# 환경 변수 설정 가이드

## 필수 환경 변수

### 데이터베이스
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

### NextAuth
```env
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 소셜 로그인

#### Google
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성
3. OAuth 2.0 클라이언트 ID 생성
4. 승인된 리디렉션 URI 추가: `http://localhost:3000/api/auth/callback/google`

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### Naver
1. [Naver Developers](https://developers.naver.com/) 접속
2. 애플리케이션 등록
3. 서비스 URL: `http://localhost:3000`
4. Callback URL: `http://localhost:3000/api/auth/callback/naver`

```env
NAVER_CLIENT_ID="your-naver-client-id"
NAVER_CLIENT_SECRET="your-naver-client-secret"
```

#### Kakao
1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 애플리케이션 등록
3. Redirect URI: `http://localhost:3000/api/auth/callback/kakao`

```env
KAKAO_CLIENT_ID="your-kakao-client-id"
KAKAO_CLIENT_SECRET="your-kakao-client-secret"
```

### Google AdSense
```env
NEXT_PUBLIC_GOOGLE_ADSENSE_ID="ca-pub-xxxxxxxxxxxxxxxx"
```

## 본인 인증 서비스 (선택사항)

### 카카오 알림톡
```env
KAKAO_ALIMTALK_API_KEY="your-api-key"
KAKAO_ALIMTALK_SENDER_KEY="your-sender-key"
```

### 네이버 클라우드 플랫폼 SMS
```env
NAVER_CLOUD_ACCESS_KEY="your-access-key"
NAVER_CLOUD_SECRET_KEY="your-secret-key"
NAVER_CLOUD_SERVICE_ID="your-service-id"
```

## 설치 필요한 패키지

```bash
npm install bcryptjs @types/bcryptjs
npm install @prisma/client prisma
```

## Prisma 마이그레이션

```bash
npx prisma migrate dev --name add_auth_system
npx prisma generate
```

