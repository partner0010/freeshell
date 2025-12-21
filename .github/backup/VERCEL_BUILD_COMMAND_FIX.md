# 🚨 Vercel Build Command 최종 해결

## ❌ 현재 문제

빌드 로그 분석:
- `npm run build`가 실행됨
- 하지만 `> next build`만 보이고 `npx prisma generate`가 실행되지 않음
- `package.json`의 `build` 스크립트가 업데이트되지 않았거나 무시되고 있음

## ✅ 해결 방법: Vercel Build Settings에서 직접 설정 (필수)

`package.json`의 변경사항이 적용되지 않을 수 있으므로, **Vercel 대시보드에서 직접 Build Command를 설정**해야 합니다.

### 단계별 가이드

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard

2. **프로젝트 선택**
   - Freeshell 프로젝트 클릭

3. **Settings → General → Build & Development Settings**
   - 현재 페이지에서 진행

4. **Framework Settings 섹션**
   - **Build Command** 필드 찾기
   - 오른쪽의 **"Override"** 토글을 **켜기** (ON) - 이것이 중요!

5. **Build Command 입력**
   - 값: `npx prisma generate && npx next build`
   - 정확히 이 값으로 입력

6. **저장**
   - "Save" 버튼 클릭
   - 저장 완료 확인

7. **재배포**
   - **Deployments** 탭 클릭
   - 최신 배포의 **"..."** (점 3개) 메뉴 클릭
   - **"Redeploy"** 선택
   - 확인

---

## 📋 설정 값 (정확히 복사)

### Build Command
```
npx prisma generate && npx next build
```

**주의:**
- 공백과 대소문자 정확히 입력
- `&&` 앞뒤에 공백 필요
- `npx`를 반드시 포함

---

## 🔍 확인 사항

### 1. Override 토글이 켜져 있는지 확인
- Build Command 필드 오른쪽의 "Override" 토글이 **ON** (파란색)이어야 함
- OFF (회색)이면 켜야 함

### 2. Build Command 값 확인
- 정확히 `npx prisma generate && npx next build`인지 확인
- 저장 후에도 값이 유지되는지 확인

### 3. Production Overrides 확인
- 경고 메시지가 있으면 Production Overrides 섹션도 확인
- 필요하면 Production Overrides의 Build Command도 수정

---

## ✅ 예상 결과

Vercel Build Settings에서 Build Command를 설정하면:
- ✅ Vercel이 `npx prisma generate`를 먼저 실행
- ✅ 그 다음 `npx next build` 실행
- ✅ Prisma Client가 빌드 시점에 정상 생성
- ✅ 빌드 성공
- ✅ 배포 성공

---

## 🆘 문제가 계속되면

### 1. Prisma Schema 위치 확인

GitHub에서 확인:
- `prisma/schema.prisma` 파일이 프로젝트 루트에 있는지 확인
- 파일이 커밋되어 있는지 확인

### 2. Build Logs 확인

재배포 후:
- Deployments → 최신 배포 → Build Logs
- `npx prisma generate`가 실행되는지 확인
- 오류 메시지가 있는지 확인

### 3. 환경 변수 확인

- Settings → Environment Variables
- `DATABASE_URL` 등 필요한 변수 확인

---

## 💡 중요 사항

1. **Override 토글을 반드시 켜야 함**
   - Override 토글이 꺼져 있으면 기본값(`npm run build`)이 사용됨
   - Override 토글을 켜야 설정한 Build Command가 적용됨

2. **정확한 명령어 입력**
   - `npx prisma generate && npx next build`
   - 공백과 대소문자 정확히 입력

3. **저장 후 재배포**
   - 설정을 저장한 후 반드시 재배포해야 함
   - 기존 배포는 이전 설정으로 빌드됨

---

## ✅ 최종 확인 체크리스트

- [ ] Vercel 대시보드 접속
- [ ] Settings → General → Build & Development Settings
- [ ] Build Command Override 토글 켜기 (ON)
- [ ] Build Command: `npx prisma generate && npx next build` 입력
- [ ] 저장 완료
- [ ] 재배포 실행
- [ ] Build Logs에서 `npx prisma generate` 실행 확인
- [ ] 빌드 성공 확인

이 모든 것이 완료되면 빌드가 성공해야 합니다!

