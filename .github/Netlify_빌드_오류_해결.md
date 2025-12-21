# 🔧 Netlify 빌드 오류 해결

## 오류 원인

**누락된 패키지:**
- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`

이 패키지들이 코드에서 사용되고 있지만 `package.json`에 없어서 빌드가 실패했습니다.

---

## 해결 방법

### 1. package.json 수정 완료 ✅

다음 패키지들을 `dependencies`에 추가했습니다:
- `@dnd-kit/core`: `^6.1.0`
- `@dnd-kit/sortable`: `^8.0.0`
- `@dnd-kit/utilities`: `^3.2.2`

### 2. Git에 푸시 (필수!)

프로젝트 루트에서 다음 명령어 실행:

```cmd
git add package.json
git commit -m "fix: add missing @dnd-kit packages"
git push origin main
```

### 3. Netlify에서 재배포

1. **"Deploys" 메뉴 클릭**
2. **"Trigger deploy" → "Clear cache and deploy site"**
3. **배포 완료 대기**

---

## 확인 체크리스트

- [x] package.json에 @dnd-kit 패키지 추가
- [ ] Git에 푸시
- [ ] Netlify에서 재배포
- [ ] 빌드 성공 확인

---

## 🚀 지금 바로 하세요!

1. **Git에 푸시:**
   ```cmd
   git add package.json
   git commit -m "fix: add missing @dnd-kit packages"
   git push origin main
   ```

2. **Netlify에서 재배포:**
   - "Deploys" → "Trigger deploy" → "Clear cache and deploy site"

**이제 빌드가 성공할 것입니다!** ✅

