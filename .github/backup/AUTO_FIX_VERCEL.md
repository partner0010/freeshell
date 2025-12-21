# 🤖 Vercel Build Settings 자동 수정 방법

## 자동화 가능 여부

### ❌ 완전 자동화 불가능

**Production Overrides는 Vercel 대시보드에서만 수정 가능합니다.**
- Vercel CLI로는 Production Overrides를 직접 수정할 수 없습니다
- Vercel API로도 Production Overrides를 수정할 수 없습니다
- 수동으로 Vercel 대시보드에서 비워야 합니다

### ✅ 부분 자동화 가능

다음은 자동화할 수 있습니다:
1. `vercel.json` 파일 생성/확인
2. `prisma/schema.prisma` 파일 생성/확인
3. Git에 커밋 및 푸시

---

## 자동화 스크립트

### 1. 파일 확인 및 생성 스크립트

`.github/auto-fix-vercel-settings.bat` 파일을 실행하면:
- `vercel.json` 파일 확인
- `prisma/schema.prisma` 파일 확인
- Vercel CLI 설치 확인

### 2. Git 자동 커밋 및 푸시

```bash
git add vercel.json prisma/schema.prisma
git commit -m "fix: add vercel.json and prisma schema"
git push origin main
```

---

## 수동 작업 (필수)

### Production Overrides 비우기

이 작업은 **반드시 수동으로** 해야 합니다:

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - Freeshell 프로젝트 클릭

2. **Settings → General → Build & Development Settings**

3. **Production Overrides 섹션**
   - Build Command 필드의 `npm run build` 삭제 (비워둠)
   - 저장

4. **재배포**

---

## 대안: Vercel API 사용 (고급)

Vercel API를 사용하여 프로젝트 설정을 변경할 수 있지만, Production Overrides는 여전히 수동으로 비워야 합니다.

### Vercel API 토큰 필요

1. **Vercel 대시보드 → Settings → Tokens**
2. **Create Token** 클릭
3. 토큰 생성 및 복사

### API 사용 예시

```bash
# 프로젝트 설정 가져오기
curl -X GET "https://api.vercel.com/v9/projects/{project-id}" \
  -H "Authorization: Bearer {token}"

# 프로젝트 설정 업데이트 (Production Overrides는 수정 불가)
curl -X PATCH "https://api.vercel.com/v9/projects/{project-id}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "buildCommand": "npx prisma generate && npx next build"
  }'
```

하지만 **Production Overrides는 API로 수정할 수 없습니다.**

---

## 최종 해결 방법

### 자동화 가능한 부분

1. ✅ `vercel.json` 파일 생성
2. ✅ `prisma/schema.prisma` 파일 생성
3. ✅ Git에 커밋 및 푸시

### 수동 작업 (필수)

1. ⚠️ **Production Overrides 비우기** (Vercel 대시보드에서만 가능)

---

## 권장 워크플로우

### 1단계: 자동화 스크립트 실행

```bash
# .github 폴더에서
.\auto-fix-vercel-settings.bat
```

### 2단계: Git에 커밋 및 푸시

```bash
git add vercel.json prisma/schema.prisma
git commit -m "fix: add vercel.json and prisma schema"
git push origin main
```

### 3단계: 수동 작업 (필수)

1. Vercel 대시보드 접속
2. Production Overrides의 Build Command 비우기
3. 저장
4. 재배포

---

## 결론

**완전 자동화는 불가능하지만, 대부분의 작업은 자동화할 수 있습니다.**

**Production Overrides를 비우는 작업만 수동으로 하면 됩니다.**

이 작업은 **한 번만** 하면 되고, 이후로는 자동으로 작동합니다! 🚀

