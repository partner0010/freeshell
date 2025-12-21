# 🔧 JSON 오류 수정 가이드

## 문제

GitHub에 푸시된 `package.json` 파일에 JSON 구문 오류가 있습니다.

오류 메시지:
```
Expected double-quoted property name in JSON at position 200.
```

## 원인

GitHub에서 직접 수정할 때 JSON 형식이 깨졌을 가능성이 높습니다.

## 해결 방법

### 방법 1: 로컬에서 수정 후 Git에 푸시 (권장)

1. **로컬 `package.json` 확인**
   - 프로젝트 루트의 `package.json` 파일 확인
   - 이미 올바르게 수정되어 있음

2. **Git에 커밋 및 푸시**
   ```cmd
   git add package.json
   git commit -m "fix: correct package.json JSON syntax"
   git push origin main
   ```

3. **Vercel에서 자동 재배포 대기**

---

### 방법 2: GitHub에서 직접 수정

1. **GitHub 저장소 열기**
   - `https://github.com/partner0010/freeshell`

2. **`package.json` 파일 클릭**

3. **연필 아이콘 클릭** (편집)

4. **전체 내용을 다음으로 교체:**
   ```json
   {
     "name": "freeshell",
     "version": "2.0.0",
     "private": true,
     "scripts": {
       "postinstall": "npx prisma generate",
       "prebuild": "npx prisma generate",
       "dev": "next dev",
       "build": "npx prisma generate && next build",
       "start": "next start",
       "lint": "next lint",
       "vercel-build": "npx prisma generate && next build"
     },
     "dependencies": {
       "next": "14.2.35",
       "react": "^18.2.0",
       "react-dom": "^18.2.0",
       "next-auth": "^4.24.5",
       "@prisma/client": "^5.22.0",
       "bcryptjs": "^2.4.3",
       "zustand": "^4.4.7",
       "framer-motion": "^10.16.16",
       "lucide-react": "^0.294.0",
       "tailwindcss": "^3.4.1",
       "autoprefixer": "^10.4.16",
       "postcss": "^8.4.32"
     },
     "devDependencies": {
       "@types/node": "^20.10.6",
       "@types/react": "^18.2.45",
       "@types/react-dom": "^18.2.18",
       "@types/bcryptjs": "^2.4.6",
       "typescript": "^5.3.3",
       "prisma": "^5.22.0",
       "eslint": "^8.56.0",
       "eslint-config-next": "14.2.35"
     }
   }
   ```

5. **커밋 메시지 입력**
   ```
   fix: correct package.json JSON syntax
   ```

6. **"Commit changes" 버튼 클릭**

---

## ✅ 확인 방법

1. **JSON 유효성 검사**
   - GitHub에서 `package.json` 파일이 정상적으로 표시되는지 확인
   - JSON 포맷터로 검증

2. **Vercel 재배포**
   - Git에 푸시하면 자동으로 재배포 시작
   - Build Logs에서 JSON 오류가 사라졌는지 확인

---

## 🚀 지금 바로 하세요!

1. **로컬에서 Git에 푸시** (위 명령어 실행)
2. **또는 GitHub에서 직접 수정** (위 내용 복사/붙여넣기)
3. **Vercel에서 자동 재배포 대기**

**이것만 하면 됩니다!** 🎉

