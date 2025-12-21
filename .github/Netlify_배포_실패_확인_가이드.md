# 🔍 Netlify 배포 실패 확인 가이드

## 현재 상태

- ❌ **배포 실패:** "Production: main@0e819fa Failed"
- ❌ **오류 메시지:** "Failed during stage 'building site': Build script returned non-zero exit code: 2"

**⚠️ 확인이 필요합니다!**

---

## 확인 방법

### 1단계: Build Logs 확인

1. **"Production deploys" 섹션에서 실패한 배포 클릭**
   - 또는 "Deploys" 메뉴 클릭

2. **Build Logs 확인**
   - 오류 메시지 확인
   - Prisma 오류인지 확인
   - 다른 오류인지 확인

---

## 예상되는 문제

### 문제 1: Prisma Client 생성 오류

**증상:**
- `PrismaClientInitializationError`
- `prisma generate`가 실행되지 않음

**해결 방법:**
- `netlify.toml` 파일 확인
- Build command 확인

### 문제 2: Environment Variables 누락

**증상:**
- `DATABASE_URL` 오류
- 환경 변수 관련 오류

**해결 방법:**
- Environment Variables 설정

### 문제 3: Build Command 오류

**증상:**
- Build script 오류
- npm 오류

**해결 방법:**
- Build command 확인
- `package.json` 확인

---

## 확인 체크리스트

- [ ] Build Logs 확인
- [ ] 오류 메시지 확인
- [ ] Prisma 오류인지 확인
- [ ] Environment Variables 확인
- [ ] Build command 확인

---

## 🚀 지금 바로 확인하세요!

1. **"Production deploys" 섹션에서 실패한 배포 클릭**
2. **Build Logs 확인**
3. **오류 메시지 확인**
4. **문제 해결**

**확인하지 않으면 계속 실패합니다!** ⚠️

