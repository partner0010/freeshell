# 🔒 읽기 전용 필드 해결 방법

## 문제 상황

Production Overrides의 Build Command 필드가:
- 수정 불가능함
- 마우스 커서를 가져가도 막혀있음
- 읽기 전용으로 보임

## 해결 방법

### 방법 1: "Revert" 링크 사용 (가장 쉬움)

1. **Production Overrides 섹션**에서
   - "Revert to @username/projectname" 링크 찾기
   - 이 링크가 보이면 클릭
   - Production Overrides가 기본값으로 되돌아감 (비워짐)

2. **저장**
   - "Save" 버튼 클릭

3. **재배포**

### 방법 2: Project Settings에서 Override 활성화

Production Overrides가 수정 불가능하면, **Project Settings를 사용**하세요:

1. **Project Settings 섹션**
   - "Project Settings" 섹션 찾기

2. **Build Command Override 활성화**
   - Build Command의 **"Override" 토글을 켜기** (OFF → ON)
   - 이미 켜져있다면 확인

3. **Build Command 확인**
   - Build Command가 `npx prisma generate && npx next build`인지 확인
   - 다르다면 수정

4. **저장**
   - "Save" 버튼 클릭

5. **재배포**

**이렇게 하면 Project Settings가 사용됩니다!**

### 방법 3: Vercel 프로젝트 재연결

1. **Settings → General**
   - 왼쪽 메뉴에서 "General" 클릭

2. **"Disconnect Git Repository" 클릭**
   - 프로젝트를 Git 저장소에서 분리

3. **다시 GitHub 저장소 연결**
   - "Connect Git Repository" 클릭
   - GitHub 저장소 선택
   - 연결

4. **재배포**
   - 자동으로 배포가 시작됨

### 방법 4: Vercel API 사용 (고급)

Vercel API를 사용하여 설정을 변경할 수 있습니다:

1. **Vercel API 토큰 생성**
   - Settings → Tokens → Create Token

2. **API 호출**
   ```bash
   curl -X PATCH "https://api.vercel.com/v9/projects/{project-id}" \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{
       "buildCommand": null
     }'
   ```

하지만 Production Overrides는 API로도 수정이 제한적일 수 있습니다.

---

## 권장 방법

### 방법 1: "Revert" 링크 사용

**가장 간단하고 확실한 방법입니다!**

1. Production Overrides 섹션에서 **"Revert to @username/projectname"** 링크 찾기
2. 클릭
3. 저장
4. 재배포

### 방법 2: Project Settings 사용

**Production Overrides가 수정 불가능하면:**

1. Project Settings의 Build Command Override가 켜져있는지 확인
2. Build Command가 `npx prisma generate && npx next build`인지 확인
3. 저장
4. 재배포

**Project Settings가 Production Overrides보다 우선순위가 낮지만, Production Overrides가 비어있으면 Project Settings가 사용됩니다!**

---

## 확인 방법

재배포 후 Build Logs에서:
- ✅ 성공: `Running "npx prisma generate && npx next build"`
- ❌ 실패: `Running "npm run build"` (여전히 Production Overrides가 사용 중)

---

## 💡 중요 사항

**Production Overrides가 읽기 전용이면:**
- "Revert" 링크를 사용하거나
- Project Settings를 사용하세요

**Project Settings의 Build Command Override가 켜져있고, Build Command가 올바르게 설정되어 있다면, Production Overrides를 비우지 않아도 작동할 수 있습니다!**

---

## 🚀 다음 단계

1. **"Revert" 링크 찾기 및 클릭** (방법 1)
2. 또는 **Project Settings 확인** (방법 2)
3. **저장**
4. **재배포**

이렇게 하면 해결될 것입니다! 🎉

