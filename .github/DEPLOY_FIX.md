# 🔧 배포 문제 해결 가이드

## ❌ 배포가 안되는 주요 원인

### 1. **package.json이 프로젝트 루트에 없음**
   - ✅ 해결: 프로젝트 루트에 `package.json` 파일이 있어야 합니다
   - 현재 `.github` 폴더에만 있었던 파일들을 루트로 복사했습니다

### 2. **필수 설정 파일 누락**
   - ✅ 해결: 다음 파일들이 프로젝트 루트에 있어야 합니다:
     - `package.json`
     - `next.config.js`
     - `tsconfig.json`
     - `tailwind.config.js`
     - `postcss.config.js`
     - `vercel.json`

### 3. **src 폴더 확인 필요**
   - ⚠️ `src` 폴더가 있는지 확인하세요
   - 없으면 소스 코드가 없어서 빌드가 안됩니다

## ✅ 지금 해야 할 일

### 1단계: 파일 확인
```bash
# 프로젝트 루트에서 실행
Get-ChildItem -File | Select-Object Name
```

다음 파일들이 있어야 합니다:
- ✅ package.json
- ✅ next.config.js
- ✅ tsconfig.json
- ✅ tailwind.config.js
- ✅ postcss.config.js
- ✅ vercel.json
- ✅ .env

### 2단계: src 폴더 확인
```bash
Test-Path src
```

`src` 폴더가 있어야 합니다. 없으면 소스 코드가 없어서 배포가 안됩니다.

### 3단계: npm install
```bash
npm install
```

### 4단계: 빌드 테스트
```bash
npm run build
```

빌드가 성공하면 배포 준비가 완료된 것입니다.

## 🚀 Vercel 배포 체크리스트

배포 전 확인사항:

- [ ] `package.json`이 프로젝트 루트에 있음
- [ ] `next.config.js`가 프로젝트 루트에 있음
- [ ] `src` 폴더가 있음
- [ ] `npm install` 완료
- [ ] `npm run build` 성공
- [ ] `.env` 파일에 필요한 환경 변수 설정
- [ ] GitHub에 코드 푸시 완료
- [ ] Vercel에서 환경 변수 설정 완료

## 💡 Vercel 배포 오류 해결

### 오류: "Build Command Failed"
- `package.json`이 루트에 있는지 확인
- `npm install`이 성공했는지 확인
- 로컬에서 `npm run build`가 되는지 확인

### 오류: "Module Not Found"
- `src` 폴더가 있는지 확인
- import 경로가 올바른지 확인
- `tsconfig.json`의 paths 설정 확인

### 오류: "Environment Variables Missing"
- Vercel 대시보드에서 환경 변수 설정 확인
- `.env` 파일의 변수들이 모두 설정되었는지 확인

## 📝 다음 단계

1. 위의 파일들이 모두 프로젝트 루트에 있는지 확인
2. `npm install` 실행
3. `npm run build` 테스트
4. 빌드 성공하면 Vercel에 배포

