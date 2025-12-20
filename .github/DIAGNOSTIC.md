# 문제 진단 및 해결 가이드

## 현재 확인된 문제

### 1. TypeScript 모듈 해석 오류
- `@/components/layout/GlobalHeader` 모듈을 찾을 수 없음
- `@/lib/ai/agents` 모듈을 찾을 수 없음

### 2. 가능한 원인
- tsconfig.json의 paths 설정 문제
- 파일 경로 문제
- 빌드 캐시 문제

## 해결 방법

### 방법 1: TypeScript 설정 확인
`tsconfig.json` 파일에서 paths 설정 확인:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 방법 2: 빌드 캐시 삭제
```bash
# .next 폴더 삭제
rm -rf .next
# 또는 Windows
rmdir /s /q .next

# node_modules 재설치
rm -rf node_modules
npm install

# 빌드 재시도
npm run build
```

### 방법 3: 파일 경로 확인
- `src/components/layout/GlobalHeader.tsx` 파일이 존재하는지 확인
- `src/lib/ai/agents.ts` 파일이 존재하는지 확인

### 방법 4: Vercel 배포 확인
1. Vercel 대시보드에서 빌드 로그 확인
2. 실제 오류 메시지 확인
3. 환경 변수 설정 확인

## 빠른 확인 명령어

```bash
# 파일 존재 확인
ls src/components/layout/GlobalHeader.tsx
ls src/lib/ai/agents.ts

# TypeScript 컴파일 확인
npx tsc --noEmit

# 빌드 테스트
npm run build
```

