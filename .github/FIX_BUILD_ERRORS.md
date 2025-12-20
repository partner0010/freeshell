# 빌드 오류 해결 가이드

## 현재 문제

TypeScript가 다음 모듈을 찾지 못함:
- `@/components/layout/GlobalHeader`
- `@/lib/ai/agents`

## 해결 방법

### 1. 파일 존재 확인
파일들이 실제로 존재하는지 확인:
- ✅ `src/components/layout/GlobalHeader.tsx` - 존재함
- ✅ `src/lib/ai/agents.ts` - 존재함

### 2. TypeScript 서버 재시작
VS Code/Cursor에서:
1. `Ctrl+Shift+P` (또는 `Cmd+Shift+P`)
2. "TypeScript: Restart TS Server" 실행

### 3. 빌드 캐시 삭제
```bash
# .next 폴더 삭제
rmdir /s /q .next

# TypeScript 캐시 삭제
rmdir /s /q node_modules\.cache

# 재빌드
npm run build
```

### 4. tsconfig.json 확인
`tsconfig.json`이 프로젝트 루트에 있고, paths 설정이 올바른지 확인:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    },
    "baseUrl": "."
  }
}
```

### 5. 실제 빌드 테스트
TypeScript 오류는 있지만 실제 빌드는 성공할 수 있습니다:
```bash
npm run build
```

## 중요 사항

**TypeScript 오류 ≠ 빌드 실패**

- TypeScript는 개발 중 타입 체크를 위한 도구
- Next.js는 실제 빌드 시 다른 방식으로 모듈을 해석
- 실제 빌드가 성공하면 배포 가능

## 확인 방법

1. **로컬 빌드 테스트**
   ```bash
   npm run build
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **Vercel 빌드 로그 확인**
   - Vercel 대시보드 → Deployments → Build Logs

## 빠른 해결

가장 빠른 방법:
1. `.next` 폴더 삭제
2. `npm run build` 실행
3. 빌드 성공 여부 확인

빌드가 성공하면 TypeScript 오류는 무시해도 됩니다.

