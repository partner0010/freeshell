# Netlify 배포 문제 해결 가이드

## 문제: 배포 스크립트 실행은 성공하지만 실제 Netlify에 반영되지 않음

### 원인 분석
1. **`netlify.toml` 위치 문제**: `.github` 폴더에 있어서 Netlify가 인식하지 못함
2. **Git 저장소 상태**: 제대로 초기화되지 않았거나 커밋이 없음
3. **Git Push 실패**: 실제로 GitHub에 push되지 않음

### 해결 방법

#### 1. `netlify.toml` 위치 확인
- ✅ **올바른 위치**: 프로젝트 루트 (`/netlify.toml`)
- ❌ **잘못된 위치**: `.github/netlify.toml`

#### 2. Git 저장소 상태 확인
```bash
# 프로젝트 루트에서 실행
git status
git remote -v
git branch
```

#### 3. 수동 배포 방법

**방법 1: Git Push 후 Netlify 자동 배포**
```bash
# 1. 변경사항 커밋
git add .
git commit -m "보안 미들웨어 수정 및 반응형 개선"

# 2. GitHub에 Push
git push origin master
# 또는
git push origin main
```

**방법 2: Netlify CLI로 직접 배포**
```bash
# Netlify CLI 설치 (한 번만)
npm install -g netlify-cli

# 로그인
netlify login

# 배포
netlify deploy --prod
```

**방법 3: Netlify 대시보드에서 수동 배포**
1. Netlify 대시보드 접속
2. Site settings → Build & deploy
3. "Trigger deploy" → "Deploy site" 클릭

#### 4. Netlify 설정 확인

**Site settings → Build & deploy → Continuous Deployment**
- ✅ Repository 연결 확인
- ✅ Branch: `master` 또는 `main` 확인
- ✅ Build command: `npm run build` 확인
- ✅ Publish directory: `.next` (Next.js 플러그인이 자동 처리)

#### 5. 배포 로그 확인
1. Netlify 대시보드 → Deploys 탭
2. 최신 배포 클릭
3. Build log 확인
4. 오류가 있으면 수정 후 재배포

### 배포 확인 체크리스트

- [ ] `netlify.toml`이 프로젝트 루트에 있음
- [ ] Git 저장소가 제대로 초기화됨
- [ ] 변경사항이 커밋됨 (`git status`로 확인)
- [ ] GitHub에 push됨 (`git log`로 확인)
- [ ] Netlify가 Git 저장소와 연결됨
- [ ] Netlify Deploys에 새 배포가 나타남
- [ ] 배포 상태가 "Published" 또는 "Ready"임

### 문제 해결 후 확인

배포 완료 후:
1. 사이트 URL 접속
2. 강력 새로고침: `Ctrl + Shift + R` (Windows) 또는 `Cmd + Shift + R` (Mac)
3. 개발자 도구 → Network 탭에서 캐시 확인
4. 변경사항이 반영되었는지 확인

### 추가 팁

**캐시 문제 해결**
- Netlify 대시보드 → Site settings → Build & deploy → "Clear cache and deploy site"
- 또는 배포 시 "Clear cache" 옵션 선택

**빠른 재배포**
- Netlify 대시보드 → Deploys → "Trigger deploy" → "Deploy site"

