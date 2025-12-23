# ✅ Netlify 자동 배포 체크리스트

## 🔍 즉시 확인 사항

### 1. netlify.toml 파일 위치
- [ ] 프로젝트 루트에 `netlify.toml` 파일이 있는가?
- [ ] 파일 내용이 올바른가?

**위치**: `C:\Users\partn\OneDrive\바탕 화면\Cursor\Freeshell\netlify.toml`

### 2. Netlify 대시보드 설정
1. https://app.netlify.com 접속
2. 사이트 선택
3. **Site settings** → **Build & deploy** 확인

#### 빌드 설정 확인
- [ ] **Build command**: `npx prisma generate && npm run build`
- [ ] **Publish directory**: `.next`
- [ ] **Base directory**: (비워두기)

#### GitHub 연동 확인
- [ ] **Continuous Deployment** 활성화됨
- [ ] 올바른 저장소 연결됨
- [ ] 브랜치가 `main` 또는 `master`로 설정됨

### 3. 환경 변수 확인
**Site settings** → **Build & deploy** → **Environment variables**:
- [ ] 필요한 환경 변수가 모두 설정되어 있는가?
- [ ] `DATABASE_URL` (필요시)
- [ ] `NEXTAUTH_SECRET` (필요시)
- [ ] `NEXTAUTH_URL` (필요시)

### 4. 빌드 로그 확인
1. **Deploys** 탭 클릭
2. 최근 배포 선택
3. **Deploy log** 확인
4. 오류 메시지 확인

## 🚨 일반적인 오류 및 해결

### 오류 1: "Prisma Client not found"
**해결**: 빌드 명령어에 `npx prisma generate` 추가
```toml
[build]
  command = "npx prisma generate && npm run build"
```

### 오류 2: "Build directory not found"
**해결**: 배포 디렉토리를 `.next`로 설정
```toml
[build]
  publish = ".next"
```

### 오류 3: "GitHub webhook failed"
**해결**: 
1. Netlify에서 저장소 다시 연결
2. GitHub에서 웹훅 확인

### 오류 4: "Build timeout"
**해결**: 
1. 빌드 명령어 최적화
2. 불필요한 의존성 제거

## 🔧 수동 배포 테스트

1. Netlify 대시보드 → **Deploys** 탭
2. **Trigger deploy** → **Deploy site** 클릭
3. 빌드 로그 확인
4. 성공 여부 확인

## 📝 다음 단계

1. ✅ `netlify.toml` 파일 확인
2. ✅ Netlify 대시보드 설정 확인
3. ✅ 수동 배포 테스트
4. ✅ 빌드 로그 확인
5. ✅ GitHub에 푸시하여 자동 배포 확인

---

**중요**: 모든 설정을 확인한 후에도 문제가 지속되면, Netlify 지원팀에 문의하세요.

