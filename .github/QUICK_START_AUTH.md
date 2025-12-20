# 빠른 시작 가이드 - 회원가입 및 인증 시스템

## 🚀 빠른 설정 (5분)

### 1. 패키지 설치
```bash
npm install bcryptjs @types/bcryptjs
npm install @prisma/client prisma
```

### 2. 환경 변수 설정
`.env.local` 파일 생성:

```env
# 필수
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# 소셜 로그인 (선택)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
NAVER_CLIENT_ID=""
NAVER_CLIENT_SECRET=""
KAKAO_CLIENT_ID=""
KAKAO_CLIENT_SECRET=""

# Google AdSense (선택)
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=""
```

### 3. Prisma 마이그레이션
```bash
cd .github
npx prisma migrate dev --name add_auth_system
npx prisma generate
```

### 4. 실행
```bash
npm run dev
```

## ✅ 완료!

이제 다음 기능을 사용할 수 있습니다:
- ✅ 회원가입 (`/auth/signup`)
- ✅ 로그인 (`/auth/signin`)
- ✅ 본인 인증 (휴대폰)
- ✅ SNS 로그인 (Google, Naver, Kakao)
- ✅ 페이지 보호 (에디터, 크리에이터)
- ✅ Google AdSense 광고

## 📝 상세 설정

자세한 설정은 `ENV_SETUP.md`와 `AUTH_IMPLEMENTATION_COMPLETE.md`를 참고하세요.

