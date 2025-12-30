# 배치 파일 실행 로그 확인 가이드

## 📋 로그 기능

배치 파일(`.github\deploy.bat`) 실행 시 모든 출력이 `deploy.log` 파일에 자동으로 기록됩니다.

## 🔍 로그 확인 방법

### 방법 1: 로그 뷰어 배치 파일 사용 (권장)

```cmd
.github\view-log.bat
```

이 배치 파일은 다음 기능을 제공합니다:
- 마지막 50줄 보기
- 마지막 100줄 보기
- 전체 로그 보기 (메모장)
- 실시간 모니터링 (새 로그만)

### 방법 2: PowerShell로 실시간 모니터링

새 PowerShell 창에서:

```powershell
.github\monitor-deploy.ps1
```

이 스크립트는:
- 배치 파일을 실행
- 로그 파일을 실시간으로 모니터링
- 새 로그를 화면에 표시

### 방법 3: 직접 로그 파일 확인

#### 명령 프롬프트에서:
```cmd
type deploy.log
```

#### PowerShell에서:
```powershell
Get-Content deploy.log -Tail 50
Get-Content deploy.log -Wait  # 실시간 모니터링
```

#### 메모장으로 열기:
```cmd
notepad deploy.log
```

## 💡 실시간 모니터링 팁

### 배치 파일 실행 중 로그 확인하기

1. **배치 파일 실행**: `.github\deploy.bat` 실행
2. **새 터미널 창 열기**: 또 다른 명령 프롬프트 또는 PowerShell 창 열기
3. **로그 확인**: 새 창에서 다음 명령어 실행:
   ```cmd
   .github\view-log.bat
   ```
   또는
   ```powershell
   Get-Content deploy.log -Wait -Tail 20
   ```

### PowerShell 실시간 모니터링

PowerShell에서 다음 명령어로 실시간 모니터링:

```powershell
Get-Content deploy.log -Wait -Tail 30
```

`-Wait`: 파일에 새 내용이 추가될 때까지 대기
`-Tail 30`: 마지막 30줄만 표시

## 📁 로그 파일 위치

- **파일명**: `deploy.log`
- **위치**: 프로젝트 루트 디렉토리
- **예시**: `C:\Users\partn\OneDrive\바탕 화면\Cursor\Freeshell Update\deploy.log`

## 🔧 문제 해결

### 로그 파일이 생성되지 않는 경우

1. 배치 파일이 정상적으로 실행되고 있는지 확인
2. 프로젝트 루트 디렉토리에 쓰기 권한이 있는지 확인
3. 배치 파일이 실행 중인지 확인 (프로세스 확인)

### 로그 파일이 너무 큰 경우

로그 파일이 너무 커지면:

```powershell
# 마지막 1000줄만 남기기
Get-Content deploy.log -Tail 1000 | Set-Content deploy.log
```

또는 로그 파일을 삭제하고 새로 시작:

```cmd
del deploy.log
```

## 📝 로그 예시

로그 파일에는 다음 정보가 포함됩니다:

```
========================================
Shell Quick Deploy Log
Started: 2025-12-30 15:30:45
프로젝트 루트: C:\Users\partn\OneDrive\바탕 화면\Cursor\Freeshell Update
========================================

[1/4] 의존성 확인 및 설치...
의존성 확인 완료

[2/4] 빌드 테스트...
빌드 시작 (몇 분 소요될 수 있습니다)...
빌드 성공!

[3/4] Git 커밋...
커밋 완료!

[4/4] GitHub로 푸시...
[DEBUG] 단계 4-3: 브랜치 푸시 시작 (master)...
...
```

## 🚀 빠른 시작

1. 배치 파일 실행: `.github\deploy.bat`
2. 새 창에서 로그 확인: `.github\view-log.bat`
3. 실시간 모니터링: PowerShell에서 `Get-Content deploy.log -Wait -Tail 30`

