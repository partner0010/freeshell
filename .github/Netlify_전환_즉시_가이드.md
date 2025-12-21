# 🚀 Netlify 전환 즉시 가이드

## 왜 Netlify인가?

Vercel에서 계속 실패하고 있습니다:
- ❌ `package.json`의 `build` 스크립트가 무시됨
- ❌ `vercel-build` 스크립트도 작동하지 않음
- ❌ `vercel.json`의 `buildCommand`도 무시됨

**Netlify는 이런 문제가 없습니다!**

---

## Netlify 전환 단계 (5분 이내)

### 1단계: Netlify 가입

1. **Netlify 웹사이트 방문**
   - `https://www.netlify.com`

2. **"Sign up" 클릭**

3. **GitHub로 가입** (추천)
   - GitHub 계정으로 로그인

---

### 2단계: 프로젝트 연결

1. **Netlify 대시보드 → "Add new site" → "Import an existing project"**

2. **GitHub 선택**

3. **저장소 선택**
   - `partner0010/freeshell` 선택

4. **Build settings:**
   - **Build command:** `npx prisma generate && npm run build`
   - **Publish directory:** `.next`

5. **"Deploy site" 클릭**

---

### 3단계: 환경 변수 설정

1. **Site settings → Environment variables**

2. **다음 변수 추가:**
   - `DATABASE_URL` (Prisma 데이터베이스 URL)
   - `NEXTAUTH_SECRET` (NextAuth 시크릿)
   - `NEXTAUTH_URL` (사이트 URL - 배포 후 자동 생성됨)
   - 기타 필요한 환경 변수

---

### 4단계: 재배포

1. **"Trigger deploy" → "Clear cache and deploy site"**

2. **배포 완료 대기** (약 2-3분)

---

## ✅ 확인 방법

배포 후:
- ✅ Build Logs에서 `npx prisma generate` 실행 확인
- ✅ 사이트 정상 작동 확인
- ✅ Prisma 오류 없음

---

## 🎉 완료!

이제 Netlify에서 정상적으로 배포됩니다!

---

## 참고

- Netlify 대시보드: `https://app.netlify.com`
- 문서: `https://docs.netlify.com`
- `netlify.toml` 파일이 이미 프로젝트 루트에 생성되어 있습니다!

---

## 💡 왜 Netlify가 더 나은가?

1. **Build Command 설정이 더 유연함**
   - Vercel의 "Production Overrides" 같은 제한 없음

2. **Prisma 지원 우수**
   - `netlify.toml`에서 명확하게 설정 가능

3. **무료 플랜 제공**
   - Vercel과 유사한 무료 플랜

4. **사용법이 간단함**
   - Vercel과 거의 동일한 사용법

---

## 🚀 지금 바로 하세요!

1. **Netlify 가입** (`https://www.netlify.com`)
2. **GitHub 저장소 연결**
3. **Build command 설정:** `npx prisma generate && npm run build`
4. **배포**

**5분 이내 완료 가능합니다!** 🎉

