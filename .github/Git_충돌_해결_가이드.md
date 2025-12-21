# 🔧 Git 충돌 해결 가이드

## 현재 문제

**오류 메시지:**
```
error: Your local changes to the following files would be overwritten by merge:
  package.json
Please commit your changes or stash them before you merge.
```

**원인:**
- 로컬에 커밋되지 않은 `package.json` 변경사항이 있음
- 원격에도 `package.json` 변경사항이 있음
- 두 변경사항이 충돌함

---

## 해결 방법

### 방법 1: 변경사항 커밋 후 Pull (권장)

```cmd
# 1. 현재 변경사항 커밋
git add package.json
git commit -m "fix: add missing @dnd-kit packages"

# 2. 원격 변경사항 가져오기 (rebase)
git pull origin main --rebase

# 3. 충돌이 있다면 해결 후
git add .
git rebase --continue

# 4. 푸시
git push origin main
```

### 방법 2: Stash 사용

```cmd
# 1. 현재 변경사항 임시 저장
git stash

# 2. 원격 변경사항 가져오기
git pull origin main

# 3. 임시 저장한 변경사항 복원
git stash pop

# 4. 충돌 해결 후 커밋
git add package.json
git commit -m "fix: add missing @dnd-kit packages"

# 5. 푸시
git push origin main
```

### 방법 3: 강제 병합 (주의!)

```cmd
# 1. 현재 변경사항 커밋
git add package.json
git commit -m "fix: add missing @dnd-kit packages"

# 2. 원격 변경사항 가져오기 (merge)
git pull origin main --no-rebase

# 3. 충돌 해결 후
git add .
git commit -m "merge: resolve conflicts"

# 4. 푸시
git push origin main
```

---

## 단계별 해결 (프로젝트 루트에서)

### 1단계: 프로젝트 루트로 이동

```cmd
cd "C:\Users\partn\OneDrive\바탕 화면\Cursor\Freeshell"
```

### 2단계: 현재 상태 확인

```cmd
git status
```

### 3단계: 변경사항 커밋

```cmd
git add package.json
git commit -m "fix: add missing @dnd-kit packages"
```

### 4단계: 원격 변경사항 가져오기

```cmd
git pull origin main --rebase
```

**충돌이 발생하면:**
1. `package.json` 파일을 열어서 충돌 마커(`<<<<<<<`, `=======`, `>>>>>>>`) 확인
2. 필요한 부분만 남기고 나머지 삭제
3. 저장 후:
   ```cmd
   git add package.json
   git rebase --continue
   ```

### 5단계: 푸시

```cmd
git push origin main
```

---

## 자동화 스크립트

`.github/fix-git-push.bat` 파일을 실행하세요:

```cmd
.github\fix-git-push.bat
```

---

## 확인 체크리스트

- [ ] 프로젝트 루트에서 작업 중
- [ ] `package.json` 변경사항 커밋 완료
- [ ] `git pull origin main --rebase` 성공
- [ ] 충돌 해결 완료 (있는 경우)
- [ ] `git push origin main` 성공

---

## 🚀 지금 바로 하세요!

프로젝트 루트에서 다음 명령어를 순서대로 실행:

```cmd
cd "C:\Users\partn\OneDrive\바탕 화면\Cursor\Freeshell"
git add package.json
git commit -m "fix: add missing @dnd-kit packages"
git pull origin main --rebase
git push origin main
```

**충돌이 발생하면 수동으로 해결해야 합니다!** ⚠️

