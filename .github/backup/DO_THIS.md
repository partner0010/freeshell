# 🎯 지금 바로 하세요!

## 단계별 가이드 (매우 간단)

### 1단계: Vercel 대시보드 열기

1. 브라우저에서 https://vercel.com/dashboard 접속
2. 로그인 (필요시)
3. **Freeshell** 프로젝트 클릭

### 2단계: Git 저장소 연결 해제

1. 왼쪽 메뉴에서 **"Settings"** 클릭
2. **"General"** 클릭
3. 페이지를 아래로 스크롤
4. **"Git"** 섹션 찾기
5. **"Disconnect Git Repository"** 버튼 클릭
6. 확인 메시지에서 **"Disconnect"** 클릭

### 3단계: Git 저장소 다시 연결

1. **"Connect Git Repository"** 버튼 클릭
2. GitHub 계정 선택
3. 저장소 목록에서 **"partner0010/freeshell"** 선택
4. **"Deploy"** 또는 **"Import"** 클릭

### 4단계: 배포 확인

1. 자동으로 배포가 시작됨
2. **Deployments** 탭에서 배포 상태 확인
3. 배포가 완료되면 **Build Logs** 확인

---

## ✅ 확인 사항

재배포 후 Build Logs에서:
- ✅ 성공: `Running "npx prisma generate && npx next build"` 또는 `> npx prisma generate && next build`
- ❌ 실패: `Running "npm run build"` (여전히 문제 있음)

---

## 🆘 여전히 안 되면

### Vercel 지원팀에 문의

1. Vercel 대시보드 오른쪽 하단 **"Help"** 또는 **"Support"** 클릭
2. 또는 https://vercel.com/support 접속
3. 문의 내용:
   ```
   Production Overrides의 Build Command 필드가 읽기 전용이고 수정할 수 없습니다.
   Prisma를 사용하는 프로젝트이므로 빌드 명령에 `npx prisma generate`를 포함해야 합니다.
   현재 `npm run build`가 실행되고 있어서 Prisma Client가 생성되지 않습니다.
   해결 방법을 알려주세요.
   ```

---

## 💡 요약

**지금 바로 하세요:**
1. Vercel 대시보드 → Settings → General
2. "Disconnect Git Repository" 클릭
3. "Connect Git Repository" 클릭
4. GitHub 저장소 선택
5. 배포 시작

**이것만 하면 됩니다!** 🚀

