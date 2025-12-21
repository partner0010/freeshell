# 🚀 Netlify 전환 가이드

## 왜 Netlify인가?

- ✅ Prisma 지원 우수
- ✅ Build Command 설정이 더 유연함
- ✅ Vercel보다 Prisma 문제 해결이 쉬움
- ✅ 무료 플랜 제공
- ✅ Vercel과 유사한 사용법

## 전환 단계

### 1단계: Netlify 가입

1. **Netlify 웹사이트 방문**
   - `https://www.netlify.com`

2. **"Sign up" 클릭**

3. **GitHub로 가입** (추천)

---

### 2단계: 프로젝트 연결

1. **Netlify 대시보드 → "Add new site" → "Import an existing project"**

2. **GitHub 선택**

3. **저장소 선택**
   - `partner0010/freeshell`

4. **Build settings:**
   - Build command: `npx prisma generate && npm run build`
   - Publish directory: `.next`

5. **"Deploy site" 클릭**

---

### 3단계: 환경 변수 설정

1. **Site settings → Environment variables**

2. **다음 변수 추가:**
   - `DATABASE_URL` (Prisma 데이터베이스 URL)
   - `NEXTAUTH_SECRET` (NextAuth 시크릿)
   - `NEXTAUTH_URL` (사이트 URL)
   - 기타 필요한 환경 변수

---

### 4단계: netlify.toml 확인

프로젝트 루트에 `netlify.toml` 파일이 있는지 확인:
- ✅ 이미 생성됨

---

### 5단계: 재배포

1. **"Trigger deploy" → "Clear cache and deploy site"**

2. **배포 완료 대기**

---

## ✅ 확인 방법

배포 후:
- ✅ Build Logs에서 `npx prisma generate` 실행 확인
- ✅ 사이트 정상 작동 확인

---

## 🎉 완료!

이제 Netlify에서 정상적으로 배포됩니다!

---

## 참고

- Netlify 대시보드: `https://app.netlify.com`
- 문서: `https://docs.netlify.com`

