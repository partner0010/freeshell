# ✅ NextAuth PagesOptions 타입 오류 수정 완료

## 문제
- `authOptions.ts`에서 `pages.signUp`을 사용하지만
- NextAuth v4의 `PagesOptions` 타입에 `signUp` 속성이 없음
- TypeScript 오류: "Object literal may only specify known properties, and 'signUp' does not exist in type 'Partial<PagesOptions>'"

## 해결
NextAuth v4에서는 `signUp` 페이지 옵션이 지원되지 않으므로 제거했습니다.

### 변경 사항

**파일**: `src/lib/auth/options.ts`

**수정 전**:
```typescript
pages: {
  signIn: '/auth/signin',
  signUp: '/auth/signup',
  error: '/auth/error',
},
```

**수정 후**:
```typescript
pages: {
  signIn: '/auth/signin',
  error: '/auth/error',
},
```

### 설명

- NextAuth v4의 `PagesOptions`는 다음 속성만 지원합니다:
  - `signIn`: 로그인 페이지
  - `signOut`: 로그아웃 페이지 (선택)
  - `error`: 오류 페이지
  - `verifyRequest`: 이메일 인증 요청 페이지 (선택)
  - `newUser`: 신규 사용자 페이지 (선택)
- `signUp` 페이지는 NextAuth에서 직접 지원하지 않으므로, 커스텀 페이지로 구현해야 합니다.
- `/auth/signup` 페이지는 이미 존재하므로, NextAuth 설정에서 제거해도 문제없습니다.

## 다음 단계

1. **로컬 빌드 테스트**
   ```bash
   npm run build
   ```

2. **빌드 성공 확인**
   - TypeScript 오류가 사라졌는지 확인

3. **변경사항 커밋 및 푸시**
   ```bash
   git add src/lib/auth/options.ts src/lib/ai/nanobana.ts src/lib/ai/genspark.ts src/types/next-auth.d.ts src/store/editor-store.ts src/app/creator/page.tsx src/app/api/admin/licenses/route.ts src/app/admin/layout.tsx
   git commit -m "fix: resolve all TypeScript errors (NextAuth pages options, authOptions email type, NanoBana types, Genspark types, NextAuth types, sidebarTab, AdBanner, Prisma type, Key icon)"
   git push origin main
   ```

4. **Vercel에서 자동 배포 확인**
   - 배포 상태가 "Ready"인지 확인

---

## ✅ 예상 결과

수정 후:
- ✅ TypeScript 오류 해결
- ✅ 빌드 성공
- ✅ Vercel 배포 성공

---

## 수정된 파일 목록

1. `src/lib/auth/options.ts` - `authOptions` 분리, 이메일 타입 수정, pages 옵션 수정
2. `src/app/admin/layout.tsx` - `Key` 아이콘 import 추가
3. `src/app/api/admin/licenses/route.ts` - Prisma 타입 추론 사용
4. `src/app/creator/page.tsx` - `AdBanner` import 추가
5. `src/store/editor-store.ts` - `sidebarTab` 타입 확장
6. `src/types/next-auth.d.ts` - NextAuth 타입 확장
7. `src/lib/ai/genspark.ts` - 타입 가드 추가
8. `src/lib/ai/nanobana.ts` - 타입 가드 추가

