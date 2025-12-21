# 🔧 Netlify 배포 실패 해결 (최종)

## 현재 상태

- ❌ **배포 실패:** "Production: main@0e819fa Failed"
- ❌ **오류 메시지:** "Failed during stage 'building site': Build script returned non-zero exit code: 2"

**⚠️ 확인이 필요합니다!**

---

## 문제 원인

`netlify.toml`과 `prisma/schema.prisma` 파일이 프로젝트 루트에 없어서 Netlify가 인식하지 못했습니다.

**해결:** 파일들을 프로젝트 루트에 생성했습니다.

---

## 확인 방법

### 1단계: Build Logs 확인 (필수!)

**⚠️ 중요:** 배포가 실패했으므로 Build Logs를 확인해야 합니다.

1. **Netlify 대시보드에서:**
   - "Production deploys" 섹션에서 실패한 배포 클릭
   - 또는 "Deploys" 메뉴 클릭

2. **Build Logs 확인:**
   - 오류 메시지 확인
   - Prisma 오류인지 확인
   - 다른 오류인지 확인

---

## 다음 단계

### 1. Git에 푸시 (필수!)

프로젝트 루트에서 다음 명령어 실행:

```cmd
git add netlify.toml prisma/schema.prisma
git commit -m "fix: add netlify.toml and prisma schema to project root"
git push origin main
```

### 2. Netlify에서 재배포

1. **"Deploys" 메뉴 클릭**
2. **"Trigger deploy" → "Clear cache and deploy site"**
3. **배포 완료 대기**

---

## 예상되는 문제

### 문제 1: Prisma Client 생성 오류

**증상:**
- `PrismaClientInitializationError`
- `prisma generate`가 실행되지 않음

**해결 방법:**
- `netlify.toml` 파일 확인 (이미 수정됨)
- Build command 확인

### 문제 2: Environment Variables 누락

**증상:**
- `DATABASE_URL` 오류
- 환경 변수 관련 오류

**해결 방법:**
- Environment Variables 설정
- `DATABASE_URL` 추가

### 문제 3: Build Command 오류

**증상:**
- Build script 오류
- npm 오류

**해결 방법:**
- Build command 확인
- `package.json` 확인

---

## 확인 체크리스트

- [x] netlify.toml 파일 프로젝트 루트에 생성
- [x] prisma/schema.prisma 파일 프로젝트 루트에 생성
- [ ] **Build Logs 확인 (필수!)**
- [ ] Git에 푸시
- [ ] Netlify에서 재배포
- [ ] Environment Variables 확인

---

## 🚀 지금 바로 하세요!

1. **Build Logs 확인** (가장 중요!)
   - Netlify 대시보드에서 실패한 배포 클릭
   - 오류 메시지 확인

2. **Git에 푸시**
   ```cmd
   git add netlify.toml prisma/schema.prisma
   git commit -m "fix: add netlify.toml and prisma schema to project root"
   git push origin main
   ```

3. **Netlify에서 재배포**
   - "Deploys" → "Trigger deploy" → "Clear cache and deploy site"

**확인하지 않으면 계속 실패합니다!** ⚠️

