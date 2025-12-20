# 외부 접속 문제 해결 가이드

## 🔍 문제 진단 체크리스트

### 1. Vercel 배포 확인

#### Vercel 대시보드 확인
1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. 프로젝트 목록에서 Freeshell 프로젝트 확인
3. 최근 배포 상태 확인:
   - ✅ **Ready** (초록색) = 정상 배포됨
   - ⚠️ **Building** = 빌드 중
   - ❌ **Error** = 빌드 실패

#### 배포 URL 확인
- Vercel이 제공하는 기본 URL: `https://your-project.vercel.app`
- 이 URL로 접속이 되는지 확인

### 2. GitHub 연결 확인

#### 저장소 연결 확인
1. Vercel 프로젝트 설정 → Git
2. GitHub 저장소가 연결되어 있는지 확인
3. 브랜치가 `main` 또는 `master`로 설정되어 있는지 확인

#### 자동 배포 설정
- Push to Production Branch: 활성화되어 있는지 확인

### 3. 도메인 설정 확인

#### 커스텀 도메인 사용 시
1. Vercel 프로젝트 설정 → Domains
2. 도메인이 추가되어 있는지 확인
3. DNS 설정 확인:
   - A 레코드 또는 CNAME 레코드가 올바르게 설정되었는지
   - DNS 전파 시간 (최대 48시간 소요 가능)

#### DNS 확인 명령어
```bash
# Windows
nslookup your-domain.com

# 또는 온라인 도구 사용
# https://dnschecker.org
```

### 4. 빌드 오류 확인

#### 빌드 로그 확인
1. Vercel 대시보드 → Deployments
2. 최근 배포 클릭
3. Build Logs 탭에서 오류 확인

#### 일반적인 빌드 오류
- TypeScript 오류
- 의존성 설치 실패
- 환경 변수 누락
- 빌드 타임아웃

### 5. 환경 변수 확인

#### 필수 환경 변수
Vercel 프로젝트 설정 → Environment Variables에서 확인:
- `OPENAI_API_KEY` (선택사항)
- `HUGGINGFACE_API_KEY` (선택사항)
- `REPLICATE_API_TOKEN` (선택사항)

### 6. 네트워크 문제

#### 방화벽/보안 설정
- 회사 네트워크에서 차단될 수 있음
- 다른 네트워크에서 시도해보기

#### 브라우저 캐시
- 시크릿 모드로 접속 시도
- 브라우저 캐시 삭제

## 🛠️ 해결 방법

### 방법 1: 수동 재배포

1. Vercel 대시보드에서
2. Deployments → 최근 배포 → ... (메뉴) → Redeploy

### 방법 2: Git Push로 재배포

```bash
# 빈 커밋으로 재배포 트리거
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main
```

### 방법 3: Vercel CLI로 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

### 방법 4: 프로젝트 재연결

1. Vercel 대시보드 → 프로젝트 설정
2. Git 연결 해제 후 재연결
3. 저장소 선택 및 브랜치 설정

## 📋 빠른 진단 명령어

### 로컬에서 확인
```bash
# 프로젝트 루트에서
npm run build
npm run start
```

로컬에서 `http://localhost:3000` 접속 확인

### Vercel 상태 확인
```bash
# Vercel CLI 설치 후
vercel ls
vercel inspect [deployment-url]
```

## 🔗 유용한 링크

- [Vercel 대시보드](https://vercel.com/dashboard)
- [Vercel 문서](https://vercel.com/docs)
- [DNS 체커](https://dnschecker.org)
- [Vercel 상태 페이지](https://www.vercel-status.com)

## 💡 추가 확인사항

1. **프로젝트가 Private 저장소인가?**
   - Vercel 무료 플랜은 Public 저장소만 지원
   - Private 저장소는 유료 플랜 필요

2. **빌드 시간 초과**
   - 무료 플랜: 최대 45분
   - 빌드가 너무 오래 걸리면 타임아웃

3. **함수 실행 시간 초과**
   - 무료 플랜: 최대 10초
   - API 라우트가 너무 오래 걸리면 타임아웃

4. **대역폭 제한**
   - 무료 플랜: 월 100GB
   - 초과 시 접속 제한

## 🆘 여전히 해결되지 않으면

1. Vercel 지원팀에 문의
2. GitHub Issues에 문제 보고
3. 빌드 로그 전체를 확인하여 구체적인 오류 메시지 확인

