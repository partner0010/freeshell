/**
 * ESLint 설정 가이드 (참고용)
 * ESLint Configuration Guide (Reference)
 */

/**
 * 권장 ESLint 설정
 * 
 * .eslintrc.json 예시:
 * {
 *   "extends": [
 *     "next/core-web-vitals",
 *     "plugin:@typescript-eslint/recommended",
 *     "plugin:@typescript-eslint/recommended-requiring-type-checking"
 *   ],
 *   "rules": {
 *     "@typescript-eslint/no-explicit-any": "warn",
 *     "@typescript-eslint/no-unused-vars": "error",
 *     "@typescript-eslint/explicit-function-return-type": "warn",
 *     "no-console": ["warn", { "allow": ["warn", "error"] }],
 *     "react-hooks/exhaustive-deps": "warn"
 *   }
 * }
 */

/**
 * 권장 TypeScript 설정
 * 
 * tsconfig.json 예시:
 * {
 *   "compilerOptions": {
 *     "strict": true,
 *     "noImplicitAny": true,
 *     "strictNullChecks": true,
 *     "strictFunctionTypes": true,
 *     "strictBindCallApply": true,
 *     "strictPropertyInitialization": true,
 *     "noImplicitThis": true,
 *     "alwaysStrict": true,
 *     "noUnusedLocals": true,
 *     "noUnusedParameters": true,
 *     "noImplicitReturns": true,
 *     "noFallthroughCasesInSwitch": true
 *   }
 * }
 */

export const eslintRecommendations = {
  noExplicitAny: 'any 타입 사용 금지 (경고)',
  noUnusedVars: '사용하지 않는 변수 제거',
  explicitFunctionReturnType: '함수 반환 타입 명시',
  noConsole: 'console.log 사용 제한',
  reactHooksExhaustiveDeps: 'useEffect 의존성 배열 완전성',
};

export const typescriptStrictMode = {
  strict: '엄격 모드 활성화',
  noImplicitAny: '암시적 any 타입 금지',
  strictNullChecks: 'null/undefined 엄격 검사',
  strictFunctionTypes: '함수 타입 엄격 검사',
  noUnusedLocals: '사용하지 않는 지역 변수 에러',
  noUnusedParameters: '사용하지 않는 매개변수 에러',
  noImplicitReturns: '모든 경로에서 반환값 필요',
};

