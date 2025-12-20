# 🚨 외부 접속 불가 - 긴급 해결 방법

## 즉시 확인할 3가지

### 1️⃣ Vercel 기본 URL 확인 (가장 중요!)

**먼저 이것부터 확인하세요:**

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. Freeshell 프로젝트 클릭
3. **Settings → Domains** 또는 **Deployments**에서
4. Vercel이 제공하는 기본 URL 확인 (예: `freeshell.vercel.app`)

**이 URL로 접속 테스트:**
- ✅ **접속되면** → DNS 설정 문제 (도메인 연결 문제)
- ❌ **안 되면** → Vercel 배포 문제 (빌드 실패 등)

### 2️⃣ 배포 상태 확인

Vercel 대시보드 → Deployments에서:
- **Ready** (초록색) = 정상
- **Building** = 빌드 중 (기다리기)
- **Error** = 빌드 실패 (빌드 로그 확인)

### 3️⃣ DNS 설정 확인

#### Gabia에서 확인
1. Gabia 로그인
2. 도메인 관리 → 네임서버 설정
3. 현재 설정 확인:
   - Gabia 네임서버 사용 중인지
   - 또는 다른 네임서버 사용 중인지

## 🔧 빠른 해결 방법

### 상황 A: Vercel 기본 URL도 안 됨

**원인**: Vercel 배포 실패

**해결**:
1. Vercel 대시보드 → Deployments
2. 최근 배포 클릭 → Build Logs 확인
3. 오류 메시지 확인 및 수정
4. 수동 재배포: ... (메뉴) → Redeploy

### 상황 B: Vercel 기본 URL은 되는데 도메인은 안 됨

**원인**: DNS 설정 문제

**해결**:
1. **즉시 복구**: Gabia → 네임서버 설정 → "Gabia 네임서버 사용" 선택
2. DNS 전파 대기 (1-2시간)
3. 나중에 Vercel DNS 설정 적용

### 상황 C: 둘 다 안 됨

**원인**: 배포 자체가 안 됨

**해결**:
1. GitHub에 코드가 푸시되었는지 확인
2. Vercel 프로젝트가 GitHub와 연결되었는지 확인
3. 수동 배포: `vercel --prod`

## 📞 즉시 확인할 사항

### Vercel 대시보드에서
- [ ] 프로젝트가 존재하는가?
- [ ] 최근 배포가 있는가?
- [ ] 배포 상태는 무엇인가? (Ready/Building/Error)
- [ ] 빌드 로그에 오류가 있는가?

### Gabia에서
- [ ] 네임서버 설정은 무엇인가?
- [ ] DNS 레코드는 어떻게 설정되어 있는가?

## 🎯 가장 빠른 해결책

1. **Vercel 기본 URL 확인** (`*.vercel.app`)
2. 접속이 안 되면 → **Vercel 재배포**
3. 접속이 되면 → **DNS 설정 복구**

## 💡 추가 정보 필요

다음 정보를 알려주시면 더 정확히 도와드릴 수 있습니다:

1. Vercel 기본 URL (`*.vercel.app`)로 접속이 되나요?
2. Vercel 대시보드에서 배포 상태는 무엇인가요?
3. Gabia에서 네임서버 설정은 어떻게 되어 있나요?
4. 어떤 오류 메시지가 보이나요?

