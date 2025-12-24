# Vercel 빠른 배포 가이드 (48시간 → 1-2분)

## 🚀 Vercel로 즉시 전환하기

### 왜 Vercel인가?
- ✅ **즉시 배포** (1-2분, 무료 플랜도)
- ✅ Next.js 최적화 (Vercel이 Next.js 개발사)
- ✅ Edge Functions로 AI API 빠른 응답
- ✅ 글로벌 CDN
- ✅ 무료 플랜도 충분

## 📋 단계별 설정

### 1단계: Vercel CLI 설치 및 로그인

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login
```

### 2단계: 프로젝트 배포

```bash
# 프로젝트 루트에서 실행
cd C:\Users\partn\OneDrive\바탕 화면\Cursor\Freeshell

# 배포 시작
vercel

# 질문에 답변:
# - Set up and deploy? Yes
# - Which scope? (계정 선택)
# - Link to existing project? No
# - Project name? freeshell (또는 원하는 이름)
# - Directory? ./
# - Override settings? No
```

### 3단계: 환경 변수 설정

Vercel 대시보드에서:
1. 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 필요한 환경 변수 추가:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `HUGGING_FACE_API_KEY` (선택)
   - `COHERE_API_KEY` (선택)
   - `TOGETHER_API_KEY` (선택)

### 4단계: vercel.json 설정 파일 생성

프로젝트 루트에 `vercel.json` 생성:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["icn1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 5단계: GitHub 연동 (자동 배포)

1. Vercel 대시보드 접속: https://vercel.com
2. **Add New Project** 클릭
3. GitHub 저장소 선택
4. 프로젝트 설정:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
5. **Deploy** 클릭

### 6단계: DNS 설정

#### 방법 1: Vercel 네임서버 사용 (권장)
1. Vercel 대시보드 → 프로젝트 → **Settings** → **Domains**
2. 도메인 추가
3. Vercel이 제공하는 네임서버를 도메인 등록 기관에 설정

#### 방법 2: CNAME 레코드 사용
1. 도메인 등록 기관에서 CNAME 레코드 추가:
   - Name: `@` 또는 `www`
   - Value: `cname.vercel-dns.com`
2. Vercel 대시보드에서 도메인 추가

## 🔄 Netlify에서 Vercel로 마이그레이션

### 1. 환경 변수 이전
- Netlify의 환경 변수를 Vercel로 복사

### 2. 빌드 설정 확인
- `vercel.json` 파일로 빌드 설정 관리

### 3. 도메인 이전
- Vercel에서 도메인 추가 후 DNS 설정 변경

## 📊 배포 속도 비교

| 항목 | Netlify (무료) | Vercel (무료) |
|------|---------------|---------------|
| **배포 시간** | 5-48시간 🐌 | 1-2분 ⚡ |
| **빌드 큐 대기** | 있음 | 없음 |
| **Next.js 최적화** | 보통 | 최적 |
| **Edge Functions** | 제한적 | 완전 지원 |

## ✅ 확인 사항

### 배포 후 확인:
1. ✅ 사이트 접속 확인
2. ✅ API 라우트 동작 확인
3. ✅ 환경 변수 확인
4. ✅ 데이터베이스 연결 확인

### 문제 해결:
```bash
# Vercel 로그 확인
vercel logs

# 배포 상태 확인
vercel inspect
```

## 🎯 AI 서비스 최적화

### Edge Functions 활용
```typescript
// app/api/ai/chat/route.ts
export const runtime = 'edge'; // Edge Functions 사용

export async function POST(request: Request) {
  // AI API 호출
}
```

### 지역 선택
```json
// vercel.json
{
  "regions": ["icn1"] // 서울 리전 (한국 사용자 최적화)
}
```

## 💰 비용 비교

### Vercel 무료 플랜
- ✅ 즉시 배포
- ✅ 월 100GB 대역폭
- ✅ 무제한 사이트
- ✅ 자동 SSL
- ✅ Edge Functions

### Vercel Pro ($20/월)
- ✅ 더 많은 대역폭
- ✅ 팀 협업 기능
- ✅ 고급 분석

## 🚀 즉시 실행

```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 로그인
vercel login

# 3. 배포
vercel

# 4. 프로덕션 배포
vercel --prod
```

## 📝 참고

- Vercel 문서: https://vercel.com/docs
- Next.js 최적화: https://vercel.com/docs/concepts/next.js
- Edge Functions: https://vercel.com/docs/concepts/functions/edge-functions

