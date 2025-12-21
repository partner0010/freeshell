# ✏️ Build Command 필드 수정 방법

## 현재 화면

새 프로젝트 생성 화면에서 Build Command 필드를 수정해야 합니다.

---

## Build Command 필드 수정 방법

### 방법 1: 연필 아이콘 클릭

1. **Build and Output Settings 섹션** 찾기
2. **Build Command** 필드 찾기
3. **연필 아이콘 (✏️) 클릭**
4. 필드가 편집 가능해짐
5. 현재 값 삭제: `npm run build`
6. 새 값 입력: `npx prisma generate && npx next build`
7. Enter 키 누르거나 필드 밖 클릭

### 방법 2: 필드 직접 클릭

1. **Build Command** 필드 직접 클릭
2. 필드가 편집 가능해짐
3. 현재 값 삭제: `npm run build`
4. 새 값 입력: `npx prisma generate && npx next build`
5. Enter 키 누르거나 필드 밖 클릭

---

## 입력할 값

```
npx prisma generate && npx next build
```

**정확히 이 값으로 입력하세요!** (공백 포함)

---

## 다른 설정

### Root Directory
- 현재 값: `./`
- **그대로 두기** (수정 불필요)

### Output Directory
- 현재 값: "Next.js default"
- **그대로 두기** (수정 불필요)

### Install Command
- 현재 값: `npm install`
- **그대로 두기** (수정 불필요)

---

## ✅ 최종 확인

Build Command 필드가:
- ✅ `npx prisma generate && npx next build`로 변경되었는지 확인

---

## 🚀 다음 단계

1. **Build Command 수정 완료**
2. **"Deploy" 버튼 클릭**
3. **배포 확인**

**이것만 하면 됩니다!** 🎉

