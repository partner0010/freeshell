# 🔧 Git 푸시 오류 해결

## 오류 원인

**오류 메시지:**
```
[rejected] main -> main (fetch first)
Updates were rejected because the remote contains work that you do not have locally.
```

원격 저장소에 로컬에 없는 변경사항이 있어서 푸시가 거부되었습니다.

---

## 해결 방법

### 방법 1: Pull 후 Push (권장)

```cmd
git pull origin main --rebase
git push origin main
```

### 방법 2: Pull 후 Merge

```cmd
git pull origin main
git push origin main
```

---

## 현재 상황

- ✅ `package.json` 커밋 완료 (로컬)
- ❌ Git 푸시 실패 (원격과 충돌)

---

## 다음 단계

1. **`.github` 폴더에서:**
   ```cmd
   git pull origin main --rebase
   git push origin main
   ```

2. **또는 프로젝트 루트에서:**
   ```cmd
   cd ..
   git pull origin main --rebase
   git add package.json
   git commit -m "fix: add missing @dnd-kit packages"
   git push origin main
   ```

---

## 주의사항

- 충돌이 발생하면 해결 후 다시 푸시해야 합니다
- `--rebase` 옵션은 로컬 커밋을 원격 변경사항 위에 재배치합니다

