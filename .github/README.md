# Freeshell

AI 서비스 플랫폼

## 배포

### Netlify (권장)

1. Netlify 가입: `https://www.netlify.com`
2. GitHub 저장소 연결
3. Build settings:
   - Build command: `npx prisma generate && npm run build`
   - Publish directory: `.next`
4. 환경 변수 설정:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

### Vercel

현재 Vercel 배포 시 Prisma Client 생성 문제가 발생하고 있습니다.

## 로컬 개발

```bash
npm install
npx prisma generate
npm run dev
```

## 주요 기능

- AI 콘텐츠 생성
- 사용자 인증 (NextAuth)
- 구독 라이선스 관리
- 관리자 대시보드

